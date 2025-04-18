
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
      // Process one question at a time with delays between each
      for (let i = 0; i < questions.length - 1; i++) {
        // Set current question index first
        setCurrentQuestionIndex(i);
        
        // Short delay to ensure the UI updates before we select an option
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const question = questions[i];
        console.log(`Processing question ${i+1}/${questions.length-1}: ${question.id}`);
        
        // Skip to next iteration if this question somehow doesn't have options
        if (!question.options || question.options.length === 0) {
          console.warn(`Question ${question.id} has no options to select from`);
          continue;
        }
        
        // Randomly select an option
        const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
        
        // Log for debugging
        console.log(`Auto-selecting option ${randomOption.id} for question ${question.id}`);
        
        // Submit answer for the current question
        onSubmit(question.id, randomOption.id);
        
        // Longer delay after submitting to allow for state updates and animations
        await new Promise(resolve => setTimeout(resolve, 500));
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
