
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
      const assessmentId = `test-${Date.now()}`;
      const { error: assessmentError } = await supabase
        .from('deep_insight_assessments')
        .insert({
          id: assessmentId,
          user_id: user.id,
          responses,
          completed_at: new Date().toISOString(),
        });

      if (assessmentError) {
        throw new Error(`Failed to save assessment: ${assessmentError.message}`);
      }

      addLog(`Assessment saved with ID: ${assessmentId}`);

      // Format responses for analysis
      const formattedResponses: TestResponse[] = deepInsightQuestions.map(q => ({
        questionId: q.id,
        question: q.question,
        answer: responses[q.id],
        category: q.category || 'unknown'
      }));

      // Call analysis function
      addLog('Calling Deep Insight Analysis function');
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke<AnalysisResponse>(
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

      if (analysisError) throw analysisError;
      if (!analysisData) throw new Error('No analysis data received');

      addLog('Analysis completed successfully');
      setAnalysisId(analysisData.id);
      addLog(`Analysis ID: ${analysisData.id}`);

      // Verify analysis was saved
      const { data: verifyData, error: verifyError } = await supabase
        .from('deep_insight_analyses')
        .select('id')
        .eq('id', analysisData.id)
        .single();

      if (verifyError) {
        addLog(`Warning: Could not verify saved analysis: ${verifyError.message}`);
      } else {
        addLog('Analysis verified in database');
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

  return {
    isRunning,
    analysisId,
    runE2ETest
  };
};
