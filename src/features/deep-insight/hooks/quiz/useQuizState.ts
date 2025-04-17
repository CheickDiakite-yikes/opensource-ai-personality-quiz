
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { DeepInsightResponses } from "../../types";
import { useDeepInsightStorage } from "../useDeepInsightStorage";
import { useQuizProgress } from "./useQuizProgress";
import { useQuizSubmission } from "./useQuizSubmission";
import { deepInsightQuestions } from "../../data/questions";

/**
 * Main hook that combines all quiz functionality
 */
export const useQuizState = (totalQuestions: number) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);
  
  // Get progress tracking functions
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    setResponses,
    findLastAnsweredQuestionIndex,
    handlePrevious
  } = useQuizProgress(totalQuestions);
  
  // Storage related hooks
  const { getResponses, saveResponses, clearSavedProgress } = useDeepInsightStorage();
  
  // Submission related hooks
  const { handleSubmitQuestion } = useQuizSubmission(
    totalQuestions,
    responses,
    setResponses,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setError
  );
  
  // Load saved responses if they exist
  useEffect(() => {
    const loadSavedResponses = async () => {
      try {
        const savedResponses = await getResponses();
        
        if (Object.keys(savedResponses).length > 0) {
          setResponses(savedResponses);
          // Find the highest question index answered
          const lastAnsweredIndex = findLastAnsweredQuestionIndex(savedResponses);
          const nextIndex = lastAnsweredIndex < totalQuestions - 1 ? lastAnsweredIndex + 1 : lastAnsweredIndex;
          setCurrentQuestionIndex(nextIndex);
          
          // Show toast notification only for partial progress and only once
          const questionCount = Object.keys(savedResponses).length;
          if (questionCount < totalQuestions && !toastShownRef.current) {
            toast.info(`Restored your progress (${questionCount}/${totalQuestions} questions answered)`, {
              description: "Continue where you left off"
            });
            toastShownRef.current = true;
          } else if (questionCount === totalQuestions && !toastShownRef.current) {
            toast.success(`All ${totalQuestions} questions answered!`, {
              description: "You can review or change your answers"
            });
            toastShownRef.current = true;
          }
        }
      } catch (err) {
        console.error("Error loading saved responses:", err);
        setError("Failed to load your progress. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load responses immediately without delay
    loadSavedResponses();
  }, [totalQuestions, getResponses, findLastAnsweredQuestionIndex, setResponses, setCurrentQuestionIndex]);
  
  // Reset error when question changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [currentQuestionIndex, error]);
  
  // Handler to clear progress
  const handleClearProgress = useCallback(async () => {
    try {
      await clearSavedProgress();
      setResponses({});
      setCurrentQuestionIndex(0);
      toast.success("Progress cleared successfully");
      // Reset the toast flag so it can show again if needed
      toastShownRef.current = false;
    } catch (error) {
      console.error("Error clearing progress:", error);
      toast.error("Failed to clear progress");
    }
  }, [clearSavedProgress, setResponses, setCurrentQuestionIndex]);
  
  return {
    currentQuestionIndex,
    responses,
    error,
    isLoading,
    handleSubmitQuestion,
    handlePrevious,
    clearSavedProgress: handleClearProgress
  };
};
