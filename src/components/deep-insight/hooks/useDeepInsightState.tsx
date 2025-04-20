
import { useState, useEffect } from 'react';
import { AssessmentQuestion } from '@/utils/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

type DeepInsightResponses = Record<string, string>;

export const useDeepInsightState = (questions: AssessmentQuestion[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useLocalStorage<DeepInsightResponses>('deep_insight_responses', {});
  const [progress, setProgress] = useState(0);

  // Calculate progress whenever responses or questions change
  useEffect(() => {
    const responseCount = Object.keys(responses).length;
    const completionPercentage = (responseCount / questions.length) * 100;
    setProgress(completionPercentage);
  }, [responses, questions.length]);

  // Current question is the one at the current index
  const currentQuestion = questions[currentQuestionIndex];

  // Check if there's a response for a given question ID
  const hasResponse = (questionId: string) => {
    return !!responses[questionId];
  };

  // Update a response for a specific question
  const updateResponse = (questionId: string, selectedOption: string) => {
    const updatedResponses = {
      ...responses,
      [questionId]: selectedOption
    };
    setResponses(updatedResponses);
  };

  // Clear all responses and start fresh
  const resetResponses = () => {
    setResponses({});
    setCurrentQuestionIndex(0);
    toast.success("Assessment has been reset", {
      description: "You can now retake the questionnaire"
    });
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    updateResponse,
    resetResponses,
    currentQuestion,
    hasResponse,
    progress
  };
};

export default useDeepInsightState;
