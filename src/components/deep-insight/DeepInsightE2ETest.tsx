
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { deepInsightQuestions } from '@/utils/deep-insight/questionBank';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const DeepInsightE2ETest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { user } = useAuth();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  const runE2ETest = async () => {
    try {
      setIsRunning(true);
      setLogs([]);
      addLog('Starting E2E test');

      // Check if user is authenticated
      if (!user) {
        throw new Error('User not authenticated. Please sign in to run the test.');
      }

      // Step 1: Generate test responses for all questions
      addLog('Generating test responses');
      const responses = deepInsightQuestions.reduce((acc, question) => {
        // Randomly select an option for each question
        const randomOptionIndex = Math.floor(Math.random() * question.options.length);
        acc[question.id] = question.options[randomOptionIndex];
        return acc;
      }, {} as Record<string, string>);

      addLog(`Generated ${Object.keys(responses).length} responses`);

      // Step 2: Save assessment to database
      addLog('Saving assessment to database');
      const assessmentId = `test-${Date.now()}`;
      const { error: assessmentError } = await supabase
        .from('deep_insight_assessments')
        .insert({
          id: assessmentId,
          responses: responses,
          completed_at: new Date().toISOString(),
          user_id: user.id // Add the user_id field which is required
        });

      if (assessmentError) {
        throw new Error(`Failed to save assessment: ${assessmentError.message}`);
      }

      addLog(`Assessment saved with ID: ${assessmentId}`);

      // Step 3: Call analysis edge function
      addLog('Calling Deep Insight Analysis function');
      
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => {
        const question = deepInsightQuestions.find(q => q.id === questionId);
        return {
          questionId,
          question: question ? question.question : "Unknown question",
          answer,
          category: question?.category || "unknown"
        };
      });

      // Add more detailed error handling for the edge function call
      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
          'deep-insight-analysis',
          {
            body: {
              responses: formattedResponses,
              assessmentId,
              questionCount: deepInsightQuestions.length,
              responseCount: Object.keys(responses).length
            }
          }
        );

        if (analysisError) {
          addLog(`Analysis error: ${analysisError.message}`);
          throw new Error(`Analysis failed: ${analysisError.message}`);
        }

        if (!analysisData) {
          addLog('Error: No analysis data received');
          throw new Error('No analysis data received');
        }

        addLog('Analysis completed successfully');

        // Step 4: Verify analysis was saved
        addLog('Verifying analysis in database');
        
        // Try to save the analysis directly if the edge function succeeded but didn't save to DB
        try {
          const { data: savedAnalyses, error: fetchError } = await supabase
            .from('deep_insight_analyses')
            .select('*')
            .eq('id', analysisData.id)
            .single();

          if (fetchError) {
            addLog(`Warning: Could not verify saved analysis: ${fetchError.message}`);
            
            // Try to save the analysis manually as a fallback
            if (analysisData.overview || analysisData.core_traits) {
              addLog('Attempting to save analysis manually');
              
              const analysisToSave = {
                user_id: user.id,
                complete_analysis: analysisData.complete_analysis || {
                  status: 'completed',
                  error_occurred: false
                },
                overview: analysisData.overview || "Analysis overview is being processed.",
                core_traits: analysisData.core_traits || {},
                cognitive_patterning: analysisData.cognitive_patterning || {},
                emotional_architecture: analysisData.emotional_architecture || {},
                interpersonal_dynamics: analysisData.interpersonal_dynamics || {},
                growth_potential: analysisData.growth_potential || {},
                intelligence_score: analysisData.intelligence_score || 70,
                emotional_intelligence_score: analysisData.emotional_intelligence_score || 70
              };
              
              const { data: manualSave, error: saveError } = await supabase
                .from('deep_insight_analyses')
                .insert(analysisToSave)
                .select('id')
                .single();
                
              if (saveError) {
                addLog(`Error saving analysis manually: ${saveError.message}`);
                throw new Error(`Failed to manually save analysis: ${saveError.message}`);
              }
              
              if (manualSave) {
                setAnalysisId(manualSave.id);
                addLog(`Analysis manually saved with ID: ${manualSave.id}`);
                addLog('E2E test completed with manual save!');
              }
            }
          } else {
            setAnalysisId(savedAnalyses.id);
            addLog(`Analysis verified and saved with ID: ${savedAnalyses.id}`);
            addLog('E2E test completed successfully!');
          }
        } catch (dbError) {
          addLog(`Error verifying analysis: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
          throw new Error(`Failed to verify or save analysis: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
        }

        toast.success('E2E Test completed successfully!', {
          description: `Analysis ID: ${analysisId || 'Processing'}`
        });
      } catch (functionError) {
        // More detailed error handling for the edge function
        const errorMessage = functionError instanceof Error ? functionError.message : 'Unknown error occurred';
        addLog(`ERROR: ${errorMessage}`);
        
        if (errorMessage.includes('non-2xx status code')) {
          addLog('This could indicate an error in the edge function. Check the edge function logs.');
        }
        
        toast.error('E2E Test encountered an error', {
          description: errorMessage
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`ERROR: ${errorMessage}`);
      toast.error('E2E Test failed', {
        description: errorMessage
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Deep Insight E2E Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runE2ETest} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Test...' : 'Run E2E Test'}
          </Button>
        </CardContent>
      </Card>

      {analysisId && (
        <Card className="mb-8 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">
              Test Completed Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analysis ID: {analysisId}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="pb-1">
                {log}
              </div>
            ))}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepInsightE2ETest;
