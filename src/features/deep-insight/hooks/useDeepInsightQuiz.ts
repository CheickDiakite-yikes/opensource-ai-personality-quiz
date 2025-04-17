
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeepInsightResponses } from "../types";

const STORAGE_KEY = "deep_insight_progress";

// Import local storage utility functions from correct location
import { 
  saveAssessmentToStorage, 
  loadAnalysisHistory 
} from "@/hooks/analysis/useLocalStorage";

export const useDeepInsightQuiz = (totalQuestions: number) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<DeepInsightResponses>({});
  const [error, setError] = useState<string | null>(null);
  
  // Create localStorage helper functions
  const getItem = (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.error("Error reading from localStorage:", err);
      return null;
    }
  };
  
  const setItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.error("Error writing to localStorage:", err);
      return false;
    }
  };
  
  const removeItem = (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error("Error removing from localStorage:", err);
      return false;
    }
  };

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = getItem(STORAGE_KEY);
    console.log("Found saved progress:", savedProgress);
    
    if (savedProgress) {
      try {
        const { responses, currentQuestionIndex, lastUpdated } = JSON.parse(savedProgress);
        
        // Validate saved data
        if (typeof currentQuestionIndex === "number" && responses && typeof responses === "object") {
          setResponses(responses);
          setCurrentQuestionIndex(Math.min(currentQuestionIndex, totalQuestions - 1));
          console.log("Deep Insight quiz progress restored:", JSON.parse(savedProgress));
        }
      } catch (err) {
        console.error("Error parsing saved progress:", err);
        removeItem(STORAGE_KEY);
      }
    }
  }, [totalQuestions]);

  // Save progress whenever responses or currentQuestionIndex changes
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      const progressData = {
        responses,
        currentQuestionIndex,
        lastUpdated: new Date().toISOString()
      };
      
      setItem(STORAGE_KEY, JSON.stringify(progressData));
      console.log("Deep Insight quiz progress saved:", progressData);
    }
  }, [responses, currentQuestionIndex]);
  
  // Handle submitting a question response
  const handleSubmitQuestion = (data: Record<string, string>) => {
    // Validate input
    const questionId = Object.keys(data)[0];
    const response = data[questionId];
    
    if (!response) {
      setError("Please select an answer before continuing");
      return;
    }
    
    // Clear any previous error
    setError(null);
    
    // Add the new response
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
    
    // Handle last question submission
    if (currentQuestionIndex === totalQuestions - 1) {
      // This is the last question, navigate to results with responses
      const finalResponses = {
        ...responses,
        [questionId]: response
      };
      
      console.log("Final question submitted, navigating to results with responses:", finalResponses);
      
      // Add a toast to indicate transition
      toast.success("Assessment complete! Generating your analysis...", {
        id: "assessment-complete",
        duration: 4000
      });
      
      // Set a processing toast that will be updated by the results page
      toast.loading("Preparing your deep insight analysis...", { 
        id: "analyze-deep-insight", 
        duration: 180000 // 3 minute toast for longer processing
      });
      
      // Critical: Navigate to the results page with all responses
      navigate("/deep-insight/results", { 
        state: { 
          responses: finalResponses
        } 
      });
      
      return;
    }
    
    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  // Handle going to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Clear saved progress
  const clearSavedProgress = () => {
    removeItem(STORAGE_KEY);
    setResponses({});
    setCurrentQuestionIndex(0);
    toast.success("Progress cleared. Starting fresh.");
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
