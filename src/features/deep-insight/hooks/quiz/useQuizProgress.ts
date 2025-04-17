
import { useState, useCallback, useMemo } from "react";
import { DeepInsightResponses } from "../../types";
import { deepInsightQuestions } from "../../data/questions";

/**
 * Hook for tracking quiz progress
 */
export const useQuizProgress = (totalQuestions: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<DeepInsightResponses>({});
  
  // Create question map once for better performance
  const questionMap = useMemo(() => {
    return new Map(
      deepInsightQuestions.map((q, index) => [q.id, index])
    );
  }, []);
  
  // Find the index of the last answered question
  const findLastAnsweredQuestionIndex = useCallback((savedResponses: DeepInsightResponses): number => {
    // Find the highest index of answered questions
    let highestIndex = -1;
    
    for (const questionId of Object.keys(savedResponses)) {
      const questionIndex = questionMap.get(questionId);
      if (questionIndex !== undefined && questionIndex > highestIndex) {
        highestIndex = questionIndex;
      }
    }
    
    return highestIndex;
  }, [questionMap]);
  
  // Navigate to the previous question
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);
  
  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    setResponses,
    findLastAnsweredQuestionIndex,
    handlePrevious
  };
};
