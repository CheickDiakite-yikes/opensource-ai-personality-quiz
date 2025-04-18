
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
        
        // More substantial delay to ensure the UI updates before we select an option
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const question = questions[i];
        console.log(`Auto-test: Processing question ${i+1}/${questions.length-1}: ${question.id}`);
        
        // Skip to next iteration if this question somehow doesn't have options
        if (!question.options || question.options.length === 0) {
          console.warn(`Auto-test: Question ${question.id} has no options to select from`);
          continue;
        }
        
        // Randomly select an option
        const randomIndex = Math.floor(Math.random() * question.options.length);
        const randomOption = question.options[randomIndex];
        
        // Log for debugging
        console.log(`Auto-test: Selected option ${randomOption.id} for question ${question.id}`);
        
        try {
          // Submit answer for the current question and wait for it to complete
          onSubmit(question.id, randomOption.id);
          
          // Log after submission attempt
          console.log(`Auto-test: Submitted answer for question ${question.id}`);
          
          // Wait for state updates to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (submitError) {
          console.error(`Auto-test: Error submitting answer for question ${question.id}:`, submitError);
        }
      }

      // Go to the last question after all answers have been submitted
      setCurrentQuestionIndex(questions.length - 1);
      console.log(`Auto-test: Navigation to final question complete`);
      
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
