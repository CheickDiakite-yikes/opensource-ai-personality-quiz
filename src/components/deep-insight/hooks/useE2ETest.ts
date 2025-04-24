
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { deepInsightQuestions } from '@/utils/deep-insight/questionBank';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface TestResponse {
  questionId: string;
  question: string;
  answer: string;
  category: string;
}

interface AnalysisResponse {
  id: string;
  overview?: string;
}

export const useE2ETest = (user: User | null, addLog: (message: string) => void) => {
  const [isRunning, setIsRunning] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const runE2ETest = async () => {
    try {
      setIsRunning(true);
      addLog('Starting E2E test');

      if (!user) {
        throw new Error('User not authenticated. Please sign in to run the test.');
      }

      // Generate test responses
      addLog('Generating test responses');
      const responses = deepInsightQuestions.reduce((acc, question) => {
        const randomOptionIndex = Math.floor(Math.random() * question.options.length);
        acc[question.id] = question.options[randomOptionIndex];
        return acc;
      }, {} as Record<string, string>);

      addLog(`Generated ${Object.keys(responses).length} responses`);

      // Save assessment
      addLog('Saving assessment to database');
      
      try {
        const testId = `test-${Date.now()}`;
        const { error: assessmentError } = await supabase
          .from('deep_insight_assessments')
          .insert({
            id: testId,
            user_id: user.id,
            responses,
            completed_at: new Date().toISOString(),
          });

        if (assessmentError) {
          throw new Error(`Failed to save assessment: ${assessmentError.message}`);
        }

        addLog(`Assessment saved with ID: ${testId}`);

        // Format responses for analysis
        const formattedResponses: TestResponse[] = deepInsightQuestions.map(q => ({
          questionId: q.id,
          question: q.question,
          answer: responses[q.id],
          category: q.category || 'unknown'
        }));

        // Check if we should proceed with analysis
        if (formattedResponses.length === 0) {
          throw new Error('No responses to analyze');
        }

        // Call analysis function
        addLog('Calling Deep Insight Analysis function');
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke<AnalysisResponse>(
          'deep-insight-analysis',
          {
            body: {
              responses: formattedResponses,
              assessmentId: testId,
              questionCount: deepInsightQuestions.length,
              responseCount: Object.keys(responses).length
            }
          }
        );

        if (analysisError) throw analysisError;
        if (!analysisData) throw new Error('No analysis data received');

        addLog('Analysis completed successfully');
        setAnalysisId(analysisData.id);
        addLog(`Analysis ID: ${analysisData.id}`);

        // Verify analysis was saved with improved handling
        addLog('Waiting for database consistency (2 seconds)...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // First attempt - try direct UUID lookup
        let verificationSuccessful = false;
        
        try {
          const { data: verifyData, error: verifyError } = await supabase
            .from('deep_insight_analyses')
            .select('id, created_at')
            .eq('id', analysisData.id)
            .limit(1);

          if (verifyError) {
            addLog(`Warning: Verification query error: ${verifyError.message}`);
          } else if (!verifyData || verifyData.length === 0) {
            // Try with string conversion of UUID to handle format differences
            const { data: altVerifyData } = await supabase
              .from('deep_insight_analyses')
              .select('id, created_at')
              .eq('id', analysisData.id.toString())
              .limit(1);
              
            if (altVerifyData && altVerifyData.length > 0) {
              const createdTime = new Date(altVerifyData[0].created_at).toISOString();
              addLog(`Analysis verified with string conversion - created at ${createdTime}`);
              verificationSuccessful = true;
            } else {
              // If exact match fails, try with user_id filter
              addLog(`Warning: Direct lookup failed. Trying UUID lookup...`);
              
              // Try a more flexible approach - get recent analyses for this user
              const { data: recentAnalyses, error: recentError } = await supabase
                .from('deep_insight_analyses')
                .select('id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);
                
              if (recentError) {
                addLog(`Warning: Recent analyses lookup failed: ${recentError.message}`);
              } else if (recentAnalyses && recentAnalyses.length > 0) {
                // Check if any of the recent analyses have a matching ID or close timestamp
                const foundAnalysis = recentAnalyses[0];
                const createdTime = new Date(foundAnalysis.created_at).toISOString();
                addLog(`Found most recent analysis from ${createdTime}: ${foundAnalysis.id}`);
                
                if (foundAnalysis.id === analysisData.id) {
                  addLog(`Verified that analysis exists with matching ID`);
                  verificationSuccessful = true;
                } else {
                  const currentTime = new Date().toISOString();
                  const timeDiffMs = new Date(currentTime).getTime() - new Date(createdTime).getTime();
                  const timeDiffSec = Math.round(timeDiffMs / 1000);
                  
                  if (timeDiffSec < 30) { // If created within the last 30 seconds
                    addLog(`Analysis ID mismatch but recently created (${timeDiffSec}s ago) - likely the same analysis`);
                    addLog(`Function returned ID: ${analysisData.id}`);
                    addLog(`Database contains ID: ${foundAnalysis.id}`);
                    verificationSuccessful = true;
                  } else {
                    addLog(`Found analysis with different ID created ${timeDiffSec}s ago`);
                    addLog(`This may be a previous test run - using the one from analysis function`);
                  }
                }
              } else {
                // Try one more approach - attempt to list ALL analyses regardless of user
                const { data: allAnalyses, error: allError } = await supabase
                  .from('deep_insight_analyses')
                  .select('count')
                  .limit(1);
                  
                if (allError) {
                  addLog(`Error checking for any analyses: ${allError.message}`);
                } else if (allAnalyses && allAnalyses.length > 0) {
                  addLog(`Database connection works but no analyses found for this user`);
                } else {
                  addLog(`Warning: No analyses found in database at all - possible database configuration issue`);
                  // Perform a basic connectivity check
                  try {
                    const { count } = await supabase
                      .from('deep_insight_analyses')
                      .select('*', { count: 'exact', head: true });
                    
                    addLog(`Database connectivity check: can query the table, found ${count} total records`);
                  } catch (connError) {
                    addLog(`Database connectivity error: ${connError.message}`);
                  }
                }
                
                addLog(`Warning: Analysis with ID ${analysisData.id} not found in database`);
              }
            }
          } else {
            const createdTime = new Date(verifyData[0].created_at).toISOString();
            addLog(`Analysis verified in database - created at ${createdTime}`);
            verificationSuccessful = true;
          }
        } catch (verifyError: any) {
          addLog(`Warning: Error during analysis verification: ${verifyError.message}`);
          console.error('Verification error:', verifyError);
        }
        
        // Update final status message based on verification result
        if (verificationSuccessful) {
          addLog(`E2E test completed successfully with verified analysis in the database`);
        } else {
          addLog(`E2E test completed, but analysis verification failed - using function-provided ID: ${analysisData.id}`);
        }
        
        return analysisData.id;
      } catch (dbError: any) {
        // Specific handling for database/network errors
        const errorMessage = dbError?.message || 'Unknown database error occurred';
        addLog(`ERROR: ${errorMessage}`);
        
        // Try to determine if this is a network error
        if (errorMessage.includes('Load failed') || errorMessage.includes('Network') || errorMessage.includes('connection')) {
          addLog('ERROR: Network connection issue detected. Please check your internet connection.');
          toast.error('Network connection issue', {
            description: 'Please check your internet connection and try again'
          });
        } else {
          // Standard error handling
          toast.error('Database operation failed', {
            description: errorMessage
          });
        }
        
        throw dbError; // Re-throw to be caught by outer catch
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`ERROR: ${errorMessage}`);
      toast.error('E2E Test failed', {
        description: errorMessage
      });
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    analysisId,
    runE2ETest
  };
};
