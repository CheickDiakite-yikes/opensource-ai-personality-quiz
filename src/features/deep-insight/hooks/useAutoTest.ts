
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

    // Process all questions except the last one
    for (let i = 0; i < questions.length - 1; i++) {
      const question = questions[i];
      // Randomly select an option
      const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
      // Submit the random answer
      onSubmit(question.id, randomOption.id);
      
      // Brief delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Go to the last question
    setCurrentQuestionIndex(questions.length - 1);
    setIsAutoTesting(false);
    
    toast.success("Auto-test completed", {
      description: "You're now on the final question. Click Complete to analyze results."
    });
  };

  return {
    isAutoTesting,
    startAutoTest
  };
};
