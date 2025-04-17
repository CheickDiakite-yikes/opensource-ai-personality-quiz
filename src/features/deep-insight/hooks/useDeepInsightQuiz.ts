
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeepInsightResponses } from "../types";
import { useDeepInsightStorage } from "./useDeepInsightStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDeepInsightQuiz = (totalQuestions: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<DeepInsightResponses>({});
  const [error, setError] = useState<string | null>(null);
  const [isRestoredSession, setIsRestoredSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
  
  const handleCompleteQuiz = async (finalResponses: DeepInsightResponses) => {
    try {
      setIsSubmitting(true);
      console.log("All responses collected:", finalResponses);
      
      // Clear saved progress since quiz is completed
      clearSavedProgress();
      
      // If user is logged in, save responses to Supabase
      if (user) {
        try {
          const assessmentId = `deep-insight-${Date.now()}`;
          const { error } = await supabase
            .from('deep_insight_assessments')
            .insert({
              id: assessmentId,
              user_id: user.id,
              responses: finalResponses,
              completed_at: new Date().toISOString()
            });
            
          if (error) {
            console.error("Error saving responses to Supabase:", error);
            // Continue with analysis even if saving fails
          } else {
            console.log("Responses saved to Supabase with ID:", assessmentId);
          }
        } catch (err) {
          console.error("Exception saving responses:", err);
          // Continue with analysis even if saving fails
        }
      }
      
      // Show a more detailed toast message about the analysis process
      toast.success("Your Deep Insight assessment is complete!", {
        description: "Preparing your comprehensive personality analysis..."
      });
      
      // Navigate to results page with responses
      navigate("/deep-insight/results", { 
        state: { responses: finalResponses } 
      });
    } catch (e) {
      setIsSubmitting(false);
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
    isSubmitting,
    handleSubmitQuestion,
    handlePrevious,
    clearSavedProgress
  };
};
