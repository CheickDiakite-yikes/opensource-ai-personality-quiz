
import { AssessmentQuestion } from "@/utils/types";
import { useComprehensiveStorage } from "./hooks/useComprehensiveStorage";
import { useComprehensiveResponses } from "./hooks/useComprehensiveResponses";
import { useComprehensiveNavigation } from "./hooks/useComprehensiveNavigation";
import { useComprehensiveProgress } from "./hooks/useComprehensiveProgress";
import { useComprehensiveSubmission } from "./hooks/useComprehensiveSubmission";

export const useAssessmentState = (questionBank: AssessmentQuestion[]) => {
  // Use storage hook for state management
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    currentResponse,
    useCustomResponse,
    completedQuestions,
    setCompletedQuestions,
    responses,
    setResponses
  } = useComprehensiveStorage(questionBank);
  
  // Use responses hook for handling user input
  const {
    handleOptionSelect,
    handleCustomResponseChange
  } = useComprehensiveResponses(
    currentQuestion,
    currentResponse,
    responses,
    setResponses,
    completedQuestions,
    setCompletedQuestions
  );
  
  // Use navigation hook for moving between questions
  const {
    goToNextQuestion,
    goToPreviousQuestion
  } = useComprehensiveNavigation(
    currentQuestionIndex,
    setCurrentQuestionIndex,
    questionBank.length
  );
  
  // Use progress hook for tracking assessment completion
  const { categoryProgress } = useComprehensiveProgress(questionBank, responses);
  
  // Use submission hook for submitting assessment
  const { isAnalyzing, handleSubmitAssessment } = useComprehensiveSubmission(responses);
  
  return {
    currentQuestionIndex,
    currentQuestion,
    currentResponse,
    useCustomResponse,
    completedQuestions,
    categoryProgress,
    isAnalyzing,
    handleOptionSelect,
    handleCustomResponseChange,
    goToNextQuestion,
    goToPreviousQuestion,
    handleSubmitAssessment,
  };
};
