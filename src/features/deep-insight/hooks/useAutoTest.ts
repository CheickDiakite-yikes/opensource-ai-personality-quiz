
import { useState } from 'react';
import { DeepInsightQuestion } from '../types';
import { toast } from 'sonner';

export const useAutoTest = (
  questions: DeepInsightQuestion[],
  onSubmit: (questionId: string, selectedOption: string) => void,
  setCurrentQuestionIndex: (index: number) => void
) => {
  const [isAutoTesting, setIsAutoTesting] = useState(false);

  const startAutoTest = async () => {
    if (isAutoTesting) return; // Prevent multiple simultaneous runs
    
    setIsAutoTesting(true);
    toast.info("Auto-test mode activated", {
      description: "Filling all responses at once..."
    });

    try {
      // First, prepare all answers in memory
      const answers = {};
      
      // Pre-select answers for all questions
      questions.forEach((question, index) => {
        if (question.options && question.options.length > 0) {
          // Always select the first option for consistency and speed
          const selectedOption = question.options[0];
          answers[question.id] = selectedOption.id;
        }
      });
      
      console.log(`Auto-test: Prepared ${Object.keys(answers).length} answers`);
      
      // Go to the first question
      setCurrentQuestionIndex(0);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Submit answers one by one with minimal delay
      for (let i = 0; i < questions.length - 1; i++) {
        const question = questions[i];
        
        // Skip if somehow this question doesn't have a prepared answer
        if (!answers[question.id]) continue;
        
        try {
          // Submit the prepared answer
          onSubmit(question.id, answers[question.id]);
          
          // Minimal delay to allow state updates
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error submitting answer for question ${question.id}:`, error);
        }
      }

      // Go to the last question after all answers have been submitted
      setCurrentQuestionIndex(questions.length - 1);
      
      toast.success("Auto-test completed", {
        description: "All questions answered. Click Complete to see results."
      });
    } catch (error) {
      console.error("Auto-test error:", error);
      toast.error("Auto-test failed", {
        description: "There was an error during the auto-test process."
      });
    } finally {
      setIsAutoTesting(false);
    }
  };

  return {
    isAutoTesting,
    startAutoTest
  };
};
