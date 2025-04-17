
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeepInsightResponses } from "../types";
import { useDeepInsightStorage } from "./useDeepInsightStorage";
import { deepInsightQuestions } from "../data/questions";

export const useDeepInsightQuiz = (totalQuestions: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<DeepInsightResponses>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use the storage hook to handle saving/restoring progress
  const { getResponses, saveResponses, clearSavedProgress } = useDeepInsightStorage();
  
  // Function to find the index of the last answered question
  const findLastAnsweredQuestionIndex = useCallback((savedResponses: DeepInsightResponses): number => {
    // Create a map of all questions by ID for faster lookup
    const questionMap = new Map(
      deepInsightQuestions.map((q, index) => [q.id, index])
    );
    
    // Find the highest index of answered questions
    let highestIndex = -1;
    
    for (const questionId of Object.keys(savedResponses)) {
      const questionIndex = questionMap.get(questionId);
      if (questionIndex !== undefined && questionIndex > highestIndex) {
        highestIndex = questionIndex;
      }
    }
    
    return highestIndex;
  }, []);
  
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
          
          // Show toast notification only for partial progress
          const questionCount = Object.keys(savedResponses).length;
          if (questionCount < totalQuestions) {
            toast.info(`Restored your progress (${questionCount}/${totalQuestions} questions answered)`, {
              description: "Continue where you left off"
            });
          } else if (questionCount === totalQuestions) {
            toast.success(`All ${totalQuestions} questions answered!`, {
              description: "You can review or change your answers"
            });
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
    
    // Cleanup function not needed since we're not setting up any subscriptions
  }, [totalQuestions, getResponses, findLastAnsweredQuestionIndex]);
  
  // Reset error when question changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [currentQuestionIndex, error]);
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleSubmitQuestion = useCallback(async (data: Record<string, string>) => {
    try {
      const questionId = Object.keys(data)[0];
      const responseValue = data[questionId];
      
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
      
      // Save to storage asynchronously - don't await here to improve UI responsiveness
      saveResponses(updatedResponses).catch(e => {
        console.error("Error saving responses:", e);
        toast.error("Failed to save your progress");
      });
      
      // Move to next question or submit if done
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Submit all responses
        await handleCompleteQuiz(updatedResponses);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error processing question:", errorMessage);
      setError("An error occurred. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  }, [currentQuestionIndex, responses, saveResponses, totalQuestions]);
  
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError(null);
    }
  }, [currentQuestionIndex]);
  
  const handleCompleteQuiz = useCallback(async (finalResponses: DeepInsightResponses) => {
    try {
      // Verify we have all the responses
      if (Object.keys(finalResponses).length < totalQuestions) {
        const missingCount = totalQuestions - Object.keys(finalResponses).length;
        
        toast.error(`Missing ${missingCount} responses`, {
          description: "Please complete all questions for an accurate analysis"
        });
        
        // Find the first unanswered question
        for (let i = 0; i < deepInsightQuestions.length; i++) {
          const question = deepInsightQuestions[i];
          if (!finalResponses[question.id]) {
            setCurrentQuestionIndex(i);
            break;
          }
        }
        
        return;
      }
      
      // First verify responses have been saved successfully
      await saveResponses(finalResponses);
      
      // Show a more detailed toast message about the analysis process
      toast.success("Your Deep Insight assessment is complete!", {
        description: "Preparing your comprehensive personality analysis..."
      });
      
      // Navigate to results page
      navigate("/deep-insight/results");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error completing quiz:", errorMessage);
      setError("Failed to complete the assessment. Please try again.");
      toast.error("Failed to submit your responses. Please try again.");
    }
  }, [navigate, saveResponses, totalQuestions]);
  
  const handleClearProgress = useCallback(async () => {
    try {
      await clearSavedProgress();
      setResponses({});
      setCurrentQuestionIndex(0);
      toast.success("Progress cleared successfully");
    } catch (error) {
      console.error("Error clearing progress:", error);
      toast.error("Failed to clear progress");
    }
  }, [clearSavedProgress]);
  
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
