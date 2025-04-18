
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
            savedProgress.currentQuestionIndex >= 0 &&
            savedProgress.currentQuestionIndex < totalQuestions
          ) {
            console.log("Storage: Found saved progress:", savedProgress);
            
            // Set restored session flag first
            if (setIsRestoredSession) {
              setIsRestoredSession(true);
              
              // Wait to ensure flag is set before updating state
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Update responses first
            setResponses(savedProgress.responses);
            
            // Add a delay between state updates
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Then update question index
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
              console.log("Storage: Deep Insight quiz progress restored with", 
                answeredQuestions, "questions answered.");
            }
          }
        }
      } catch (error) {
        console.error("Storage: Error loading saved Deep Insight quiz progress:", error);
      }
    };
    
    loadSavedProgress();
  }, [setResponses, setCurrentQuestionIndex, totalQuestions, setIsRestoredSession]);
  
  // Use a ref for debounced saving
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Save progress whenever responses or currentQuestionIndex changes
  useEffect(() => {
    // Cancel any pending save operation
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounced save to prevent excessive writes
    saveTimeoutRef.current = setTimeout(() => {
      // Only save if there's at least one response
      if (Object.keys(responses).length > 0) {
        try {
          const progressToSave: SavedProgress = {
            responses,
            currentQuestionIndex,
            lastUpdated: new Date().toISOString()
          };
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
          console.log("Storage: Deep Insight quiz progress saved. Current responses:", 
            Object.keys(responses).length);
        } catch (error) {
          console.error("Storage: Error saving Deep Insight quiz progress:", error);
        }
      }
    }, 300);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
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
