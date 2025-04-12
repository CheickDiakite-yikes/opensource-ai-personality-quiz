
export function useComprehensiveNavigation(
  currentQuestionIndex: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questionBankLength: number
) {
  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questionBankLength - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  return {
    goToNextQuestion,
    goToPreviousQuestion
  };
}
