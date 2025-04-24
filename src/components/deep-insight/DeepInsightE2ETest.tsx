import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { deepInsightQuestions } from '@/utils/deep-insight/questionBank';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { DeepInsightAnalysis } from './types/deepInsight';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

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

      // Step 1: Generate test responses
      addLog('Generating test responses');
      const responses = deepInsightQuestions.reduce((acc, question) => {
        const randomOptionIndex = Math.floor(Math.random() * question.options.length);
        acc[question.id] = question.options[randomOptionIndex];
        return acc;
      }, {} as Record<string, string>);

      addLog(`Generated ${Object.keys(responses).length} responses`);
      addLog(`Sample responses: ${JSON.stringify(Object.entries(responses).slice(0, 2))}`);

      // Step 2: Save assessment to database
      addLog('Saving assessment to database');
      const assessmentId = `test-${Date.now()}`;
      const { error: assessmentError } = await supabase
        .from('deep_insight_assessments')
        .insert({
          id: assessmentId,
          user_id: user.id,
          responses: responses,
          completed_at: new Date().toISOString(),
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

      addLog(`Formatted ${formattedResponses.length} responses for analysis`);
      addLog(`Analysis payload sample: ${JSON.stringify(formattedResponses.slice(0, 2))}`);

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

        addLog('Analysis response received');
        addLog(`Raw analysis data: ${JSON.stringify(analysisData)}`);

        if (!analysisData) {
          addLog('Error: No analysis data received');
          throw new Error('No analysis data received');
        }

        addLog('Analysis completed successfully');
        
        // The analysis should now come back with its own ID
        if (analysisData.id) {
          setAnalysisId(analysisData.id);
          addLog(`Analysis ID received: ${analysisData.id}`);
        } else {
          addLog('Warning: No analysis ID in response');
        }

        // Verify the analysis was saved
        if (analysisData.id) {
          addLog('Verifying analysis in database');
          const { data: savedAnalysis, error: verifyError } = await supabase
            .from('deep_insight_analyses')
            .select('*')
            .eq('id', analysisData.id)
            .single();

          if (verifyError) {
            addLog(`Warning: Could not verify saved analysis: ${verifyError.message}`);
          } else {
            addLog(`Analysis verified in database with ID: ${savedAnalysis.id}`);
            addLog(`Analysis overview sample: ${savedAnalysis.overview?.substring(0, 200)}...`);
          }
        } else {
          // If no ID was received, try to find by assessment ID
          addLog('Checking for analysis by assessment ID');
          
          // Fix: Use explicit type annotations to avoid deep type instantiation
          const result = await supabase
            .from('deep_insight_analyses')
            .select('id')  // Select only the ID field to simplify the type
            .eq('assessment_id', assessmentId)
            .limit(1);
            
          const linkedAnalyses = result.data;
          const linkedError = result.error;
            
          if (linkedError) {
            addLog(`Warning: Could not check linked analyses: ${linkedError.message}`);
          } else if (linkedAnalyses && linkedAnalyses.length > 0) {
            setAnalysisId(linkedAnalyses[0].id);
            addLog(`Found linked analysis with ID: ${linkedAnalyses[0].id}`);
          } else {
            addLog('No linked analysis found by assessment ID');
          }
        }
      } catch (functionError) {
        const errorMessage = functionError instanceof Error ? functionError.message : 'Unknown error occurred';
        addLog(`ERROR: ${errorMessage}`);
        
        if (errorMessage.includes('non-2xx status code')) {
          addLog('This indicates an error in the edge function. Check the edge function logs for more details.');
        }
        
        throw functionError;
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
