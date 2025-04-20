
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { bigMeQuestions } from "@/utils/big-me/questionBank";
import { BigMeResponse } from "@/utils/big-me/types";
import { QuestionCategory } from "@/utils/types";

export const useBigMeState = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useLocalStorage<Record<string, BigMeResponse>>(
    "big-me-responses",
    {}
  );

  const totalQuestions = bigMeQuestions.length;
  const currentQuestion = bigMeQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleResponseSelection = (questionId: string, selectedOption: string) => {
    const updatedResponses = {
      ...responses,
      [questionId]: {
        questionId,
        selectedOption,
        category: currentQuestion.category,
        timestamp: new Date(),
      },
    };
    setResponses(updatedResponses);
  };

  const handleCustomResponse = (questionId: string, customResponse: string) => {
    const updatedResponses = {
      ...responses,
      [questionId]: {
        questionId,
        customResponse,
        category: currentQuestion.category,
        timestamp: new Date(),
      },
    };
    setResponses(updatedResponses);
  };

  const calculateProgress = () => {
    const answeredQuestions = Object.keys(responses).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  // Group questions by category
  const questionsByCategory = bigMeQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<QuestionCategory, typeof bigMeQuestions>);

  return {
    currentQuestion,
    totalQuestions,
    responses,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    handleResponseSelection,
    handleCustomResponse,
    calculateProgress,
    isLastQuestion,
    isFirstQuestion,
    questionsByCategory,
  };
};
