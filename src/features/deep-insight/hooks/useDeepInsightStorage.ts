
import { useEffect } from "react";
import { toast } from "sonner";
import { DeepInsightResponses } from "../types";

const STORAGE_KEY = "deep_insight_progress";

interface SavedProgress {
  responses: DeepInsightResponses;
  currentQuestionIndex: number;
  lastUpdated: string;
}

export const useDeepInsightStorage = (
  responses: DeepInsightResponses,
  currentQuestionIndex: number,
  setResponses: (responses: DeepInsightResponses) => void,
  setCurrentQuestionIndex: (index: number) => void,
  totalQuestions: number
) => {
  // Load saved progress on initial mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const savedProgress: SavedProgress = JSON.parse(savedData);
        
        if (
          savedProgress && 
          savedProgress.responses && 
          savedProgress.currentQuestionIndex >= 0 &&
          savedProgress.currentQuestionIndex < totalQuestions
        ) {
          setResponses(savedProgress.responses);
          setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
          
          // Calculate how many questions were answered
          const answeredQuestions = Object.keys(savedProgress.responses).length;
          
          // Format the last updated time
          const lastUpdated = new Date(savedProgress.lastUpdated);
          const timeAgo = getTimeAgo(lastUpdated);
          
          if (answeredQuestions > 0) {
            toast.info(
              `Progress restored (${answeredQuestions} questions answered)`, 
              { description: `Last active ${timeAgo}` }
            );
            console.log("Deep Insight quiz progress restored:", savedProgress);
          }
        }
      }
    } catch (error) {
      console.error("Error loading saved Deep Insight quiz progress:", error);
    }
  }, [setResponses, setCurrentQuestionIndex, totalQuestions]);
  
  // Save progress whenever responses or currentQuestionIndex changes
  useEffect(() => {
    // Only save if there's at least one response
    if (Object.keys(responses).length > 0) {
      try {
        const progressToSave: SavedProgress = {
          responses,
          currentQuestionIndex,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
        console.log("Deep Insight quiz progress saved:", progressToSave);
      } catch (error) {
        console.error("Error saving Deep Insight quiz progress:", error);
      }
    }
  }, [responses, currentQuestionIndex]);
  
  // Helper function to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  
  // Function to clear saved progress
  const clearSavedProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Progress cleared", {
      description: "Starting fresh"
    });
  };
  
  return { clearSavedProgress };
};
