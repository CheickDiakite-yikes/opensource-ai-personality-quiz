
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DeepInsightResponses } from "../types";

const LOCAL_STORAGE_KEY = "deep_insight_responses";

export const useDeepInsightQuiz = (totalQuestions: number) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useLocalStorage<DeepInsightResponses>(LOCAL_STORAGE_KEY, {});
  const [error, setError] = useState<string | null>(null);
  
  // Find the last answered question to determine starting point
  useEffect(() => {
    const determineStartingPoint = () => {
      if (Object.keys(responses).length === 0) {
        return; // No saved progress, start from the beginning
      }
      
      // Find the highest question index that has been answered
      const questionIds = Object.keys(responses);
      const highestAnsweredId = Math.max(...questionIds.map(id => parseInt(id, 10)));
      
      // If we have a valid highest ID and it's not the last question, start from the next question
      if (!isNaN(highestAnsweredId) && highestAnsweredId < totalQuestions) {
        const nextQuestionIndex = questionIds.length;
        if (nextQuestionIndex < totalQuestions) {
          setCurrentQuestionIndex(nextQuestionIndex);
        }
      }
    };
    
    determineStartingPoint();
  }, [responses, totalQuestions]);
  
  // Handle submitting an answer to the current question
  const handleSubmitQuestion = (questionId: string, selectedOption: string) => {
    try {
      if (!selectedOption) {
        setError("Please select an option before continuing");
        return;
      }
      
      setError(null);
      
      // Save the response with the current timestamp
      const updatedResponses = {
        ...responses,
        [questionId]: selectedOption
      };
      
      setResponses(updatedResponses);
      
      // Move to the next question if not on the last question
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // If on the last question, navigate to results
        handleCompleteQuiz(updatedResponses);
      }
    } catch (e) {
      console.error("Error submitting question:", e);
      setError("Something went wrong. Please try again.");
    }
  };
  
  // Handle going back to the previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setError(null);
    }
  };
  
  // Handle clearing all saved progress
  const clearSavedProgress = () => {
    if (confirm("Are you sure you want to start over? All your progress will be lost.")) {
      setResponses({});
      setCurrentQuestionIndex(0);
      toast.success("Progress cleared. Starting over from the beginning.");
    }
  };
  
  // Handle completing the quiz and navigating to results
  const handleCompleteQuiz = (finalResponses: DeepInsightResponses) => {
    // Validate minimum number of responses
    const responseCount = Object.keys(finalResponses).length;
    if (responseCount < totalQuestions * 0.8) { // 80% completion requirement
      const remainingNeeded = Math.ceil(totalQuestions * 0.8) - responseCount;
      toast.error(`Please complete at least ${remainingNeeded} more questions before finishing.`);
      return;
    }
    
    toast.success("Assessment completed! Generating your insights...");
    
    // Navigate to results page with responses
    navigate("/deep-insight/results", { 
      state: { responses: finalResponses } 
    });
  };
  
  return {
    currentQuestionIndex,
    responses,
    error,
    handleSubmitQuestion,
    handlePrevious,
    clearSavedProgress,
    setCurrentQuestionIndex // Add this line to export the setCurrentQuestionIndex function
  };
};
