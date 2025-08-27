
import { useEffect } from "react";
import { AssessmentQuestion } from "@/utils/types";
import { useResponseManagement } from "./hooks/useResponseManagement";
import { useAssessmentStorage } from "./hooks/useAssessmentStorage";
import { useCategoryProgress } from "./hooks/useCategoryProgress";
import { useAssessmentNavigation } from "./hooks/useAssessmentNavigation";
import { useAssessmentSubmission } from "./hooks/useAssessmentSubmission";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useAssessmentState = (allQuestions: AssessmentQuestion[]) => {
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    responses,
    setResponses,
    completedQuestions,
    setCompletedQuestions,
    currentResponse,
    useCustomResponse,
    handleOptionSelect,
    handleCustomResponseChange,
    saveCurrentResponse,
    setupResponseForQuestion,
    initializeFromExistingResponses
  } = useResponseManagement(allQuestions);
  
  const { user } = useAuth();

  const { categoryProgress } = useCategoryProgress(responses, allQuestions);
  
  const { handleSubmitAssessment, isAnalyzing } = useAssessmentSubmission(
    responses,
    saveCurrentResponse
  );
  
  const { goToNextQuestion, goToPreviousQuestion } = useAssessmentNavigation(
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveCurrentResponse,
    setupResponseForQuestion,
    currentResponse,
    allQuestions.length,
    handleSubmitAssessment
  );
  
  const { clearSavedProgress } = useAssessmentStorage(
    responses,
    completedQuestions,
    currentQuestionIndex,
    setResponses,
    setCompletedQuestions,
    setCurrentQuestionIndex,
    allQuestions
  );
  
  // Handle restoring the current response when loaded from storage
  useEffect(() => {
    const attemptProgressRestore = () => {
      try {
        const savedProgress = localStorage.getItem("assessment_progress");
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          if (parsedProgress && parsedProgress.responses) {
            const restoredQuestionIndex = parsedProgress.currentQuestionIndex || 0;
            if (restoredQuestionIndex >= 0 && restoredQuestionIndex < allQuestions.length) {
              initializeFromExistingResponses(parsedProgress.responses, restoredQuestionIndex);
              setCurrentQuestionIndex(restoredQuestionIndex);
              setResponses(parsedProgress.responses);
              setCompletedQuestions(parsedProgress.completedQuestions || []);
              
              console.log(`Restored assessment progress with ${parsedProgress.responses.length} responses at question ${restoredQuestionIndex}`);
              
              if (user) {
                toast.info("Your progress has been restored", {
                  description: "Continue your assessment where you left off."
                });
              }
            } else {
              console.log("Invalid question index in saved progress, starting fresh");
            }
          }
        } else {
          console.log("No saved progress found, starting fresh assessment");
        }
      } catch (error) {
        console.error("Error initializing current response:", error);
        toast.error("Could not restore your previous progress", {
          description: "Starting a new assessment."
        });
      }
    };
    
    // Delay the progress restoration slightly to ensure component is fully mounted
    setTimeout(attemptProgressRestore, 100);
  }, []);

  return {
    currentQuestionIndex,
    currentQuestion,
    responses,
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
    clearSavedProgress,
  };
};
