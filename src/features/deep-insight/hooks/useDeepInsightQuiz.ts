
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeepInsightResponses } from "../types";
import { useDeepInsightStorage } from "./useDeepInsightStorage";

export const useDeepInsightQuiz = (totalQuestions: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<DeepInsightResponses>({});
  const [error, setError] = useState<string | null>(null);
  const [isRestoredSession, setIsRestoredSession] = useState(false);
  const navigate = useNavigate();
  
  // Use the storage hook to handle saving/restoring progress
  const { clearSavedProgress } = useDeepInsightStorage(
    responses,
    currentQuestionIndex,
    setResponses,
    setCurrentQuestionIndex,
    totalQuestions,
    setIsRestoredSession
  );
  
  // Reset error when question changes
  useEffect(() => {
    setError(null);
  }, [currentQuestionIndex]);
  
  // Reset error when coming from a restored session to prevent false validation errors
  useEffect(() => {
    if (isRestoredSession) {
      setError(null);
      setIsRestoredSession(false);
    }
  }, [isRestoredSession]);
  
  const handleSubmitQuestion = (data: Record<string, string>) => {
    try {
      const questionId = Object.keys(data)[0];
      const responseValue = data[questionId];
      
      // Validate response
      if (!responseValue) {
        setError("Please select an answer before continuing");
        toast.error("Please select an answer");
        return;
      }
      
      setError(null);
      
      // Save response
      const updatedResponses = {
        ...responses,
        [questionId]: responseValue
      };
      
      setResponses(updatedResponses);
      console.log(`Saved response for question ${questionId}:`, responseValue);
      
      // Move to next question or submit if done
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Submit all responses
        handleCompleteQuiz(updatedResponses);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error processing question:", errorMessage);
      setError("An error occurred. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError(null);
    }
  };
  
  const handleCompleteQuiz = (finalResponses: DeepInsightResponses) => {
    try {
      console.log("All responses collected:", finalResponses);
      
      // Clear saved progress since quiz is completed
      clearSavedProgress();
      
      // Show a more detailed toast message about the analysis process
      toast.success("Your Deep Insight assessment is complete!", {
        description: "Preparing your comprehensive personality analysis..."
      });
      
      // In a real implementation, we would send these responses to an API
      navigate("/deep-insight/results", { 
        state: { responses: finalResponses } 
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error completing quiz:", errorMessage);
      setError("Failed to complete the assessment. Please try again.");
      toast.error("Failed to submit your responses. Please try again.");
    }
  };
  
  return {
    currentQuestionIndex,
    responses,
    error,
    handleSubmitQuestion,
    handlePrevious,
    clearSavedProgress
  };
};
