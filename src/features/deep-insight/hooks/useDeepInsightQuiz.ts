
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
  const { getResponses, saveResponses, clearSavedProgress } = useDeepInsightStorage();
  
  // Load saved responses if they exist
  useEffect(() => {
    const savedResponses = getResponses();
    if (Object.keys(savedResponses).length > 0) {
      setResponses(savedResponses);
      // Find the highest question index answered
      const questionIds = Object.keys(savedResponses);
      if (questionIds.length > 0) {
        // Set current question to the next unanswered one or the last one if all are answered
        const lastAnsweredIndex = questionIds.length - 1;
        const nextIndex = lastAnsweredIndex < totalQuestions - 1 ? lastAnsweredIndex + 1 : lastAnsweredIndex;
        setCurrentQuestionIndex(nextIndex);
        setIsRestoredSession(true);
      }
    }
  }, [totalQuestions]);
  
  // Reset error when question changes
  useEffect(() => {
    setError(null);
  }, [currentQuestionIndex]);
  
  // Reset error when coming from a restored session to prevent false validation errors
  useEffect(() => {
    if (isRestoredSession) {
      setError(null);
      console.log("Restored session detected, clearing validation errors");
      setIsRestoredSession(false);
    }
  }, [isRestoredSession]);
  
  const handleSubmitQuestion = (data: Record<string, string>) => {
    try {
      const questionId = Object.keys(data)[0];
      const responseValue = data[questionId];
      
      // Debug log to check what's being submitted
      console.log(`Submitting question ${questionId} with response:`, responseValue);
      
      // Validate response
      if (!responseValue || responseValue.trim() === '') {
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
      
      // Save to storage
      saveResponses(updatedResponses);
      
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
      console.log("Response count:", Object.keys(finalResponses).length);
      
      // Ensure responses are saved to storage before navigating
      saveResponses(finalResponses);
      
      // Verify responses were saved
      const savedResponses = getResponses();
      console.log("Verified saved responses count:", Object.keys(savedResponses).length);
      
      if (Object.keys(savedResponses).length === 0) {
        throw new Error("Failed to save responses. Please try again.");
      }
      
      // Show a more detailed toast message about the analysis process
      toast.success("Your Deep Insight assessment is complete!", {
        description: "Preparing your comprehensive personality analysis..."
      });
      
      // Important: Don't clear saved progress until analysis is complete
      // clearSavedProgress();
      
      // Navigate to results page
      navigate("/deep-insight/results");
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
