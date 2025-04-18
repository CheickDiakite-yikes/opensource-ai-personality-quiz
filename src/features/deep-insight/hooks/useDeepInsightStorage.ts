
import { useEffect, useRef } from "react";
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
  totalQuestions: number,
  setIsRestoredSession?: (isRestored: boolean) => void
) => {
  // Add a ref to track initialization
  const isInitialized = useRef(false);
  
  // Track if we're in auto-test mode
  const isAutoTestingRef = useRef(false);

  // Load saved progress on initial mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const savedProgress: SavedProgress = JSON.parse(savedData);
          
          if (
            savedProgress && 
            savedProgress.responses && 
            Object.keys(savedProgress.responses).length > 0 &&
            savedProgress.currentQuestionIndex >= 0 &&
            savedProgress.currentQuestionIndex < totalQuestions
          ) {
            // Set restored session flag first
            if (setIsRestoredSession) {
              setIsRestoredSession(true);
            }
            
            // Update responses
            setResponses(savedProgress.responses);
            
            // Update question index
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
            }
          }
        }
      } catch (error) {
        console.error("Error loading saved progress:", error);
      }
    };
    
    loadSavedProgress();
  }, [setResponses, setCurrentQuestionIndex, totalQuestions, setIsRestoredSession]);
  
  // Save progress whenever responses or currentQuestionIndex changes
  useEffect(() => {
    // Don't save during auto-testing - we'll save at the end
    if (isAutoTestingRef.current) return;
    
    try {
      // Only save if there's at least one response
      if (Object.keys(responses).length > 0) {
        const progressToSave: SavedProgress = {
          responses,
          currentQuestionIndex,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
      }
    } catch (error) {
      console.error("Error saving progress:", error);
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
  
  return { 
    clearSavedProgress,
    setAutoTesting: (value: boolean) => {
      isAutoTestingRef.current = value;
    }
  };
};
