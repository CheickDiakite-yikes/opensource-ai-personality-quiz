
import { useEffect } from "react";
import { AssessmentResponse } from "@/utils/types";
import { toast } from "sonner";

const ASSESSMENT_STORAGE_KEY = "assessment_progress";

interface AssessmentProgress {
  responses: AssessmentResponse[];
  completedQuestions: number[];
  currentQuestionIndex: number;
  lastUpdated: string;
}

export const useAssessmentStorage = (
  responses: AssessmentResponse[],
  completedQuestions: number[],
  currentQuestionIndex: number,
  setResponses: (responses: AssessmentResponse[]) => void,
  setCompletedQuestions: (completed: number[]) => void,
  setCurrentQuestionIndex: (index: number) => void,
  allQuestions: any[]
) => {
  // Load saved state from local storage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress) as AssessmentProgress;
        
        // Restore saved state if valid
        if (parsedProgress && parsedProgress.responses) {
          setResponses(parsedProgress.responses);
          setCompletedQuestions(parsedProgress.completedQuestions || []);
          setCurrentQuestionIndex(parsedProgress.currentQuestionIndex || 0);
          
          toast.info("Your previous progress has been restored", {
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error loading saved assessment progress:", error);
    }
  }, [allQuestions, setResponses, setCompletedQuestions, setCurrentQuestionIndex]);

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (responses.length > 0 || completedQuestions.length > 0) {
      try {
        const progressToSave = {
          responses,
          completedQuestions,
          currentQuestionIndex,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(progressToSave));
      } catch (error) {
        console.error("Error saving assessment progress:", error);
      }
    }
  }, [responses, completedQuestions, currentQuestionIndex]);

  const clearSavedProgress = () => {
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    toast.success("Saved progress cleared", {
      duration: 2000,
    });
  };

  return { clearSavedProgress };
};
