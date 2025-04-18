
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
    setIsAutoTesting(true);
    toast.info("Auto-test mode activated", {
      description: "Automatically filling responses..."
    });

    try {
      // Process all questions except the last one
      for (let i = 0; i < questions.length - 1; i++) {
        const question = questions[i];
        
        // Skip to next iteration if this question somehow doesn't have options
        if (!question.options || question.options.length === 0) {
          console.warn(`Question ${question.id} has no options to select from`);
          continue;
        }
        
        // Randomly select an option
        const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
        
        // Submit the random answer and log for debugging
        console.log(`Auto-selecting option ${randomOption.id} for question ${question.id}`);
        
        // Submit answer for the current question
        onSubmit(question.id, randomOption.id);
        
        // Much longer delay to ensure state updates complete before moving on
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Go to the last question after all answers have been submitted
      setCurrentQuestionIndex(questions.length - 1);
      
      toast.success("Auto-test completed", {
        description: "You're now on the final question. Click Complete to analyze results."
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
