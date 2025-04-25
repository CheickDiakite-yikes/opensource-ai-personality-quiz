
import { useState } from 'react';

// This is a stub file to prevent build errors
// The deep insight feature has been removed
export const useDeepInsightState = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  
  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    updateResponse: () => {},
    resetResponses: () => {},
    currentQuestion: { id: '', question: '', options: [], category: '' },
    hasResponse: false,
    progress: 0,
    totalQuestions: 0,
    isSubmitting: false,
    submissionError: null,
    handleOptionSelect: () => {},
    handlePrevious: () => {},
    handleNext: () => {},
    handleSubmit: () => {}
  };
};

export default useDeepInsightState;
