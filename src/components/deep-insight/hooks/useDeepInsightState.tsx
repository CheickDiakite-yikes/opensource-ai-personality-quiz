
import { useState, useEffect } from "react";
import { AssessmentQuestion } from "@/utils/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useDeepInsightState = (questions: AssessmentQuestion[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { user } = useAuth();
  
  // Calculate progress percentage
  const progress = (Object.keys(responses).length / questions.length) * 100;
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Check if current question has a response
  const hasResponse = (questionId: string) => {
    return !!responses[questionId];
  };
  
  // Update response for a question
  const updateResponse = (questionId: string, selectedOption: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
    
    // Save progress to localStorage
    saveProgress();
  };
  
  // Save progress to localStorage
  const saveProgress = () => {
    if (user) {
      try {
        localStorage.setItem("deep_insight_progress", JSON.stringify({
          responses,
          currentQuestionIndex,
          lastSaved: new Date().toISOString(),
          userId: user.id
        }));
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };
  
  // Load progress from localStorage on initial load
  useEffect(() => {
    if (user) {
      try {
        const savedProgress = localStorage.getItem("deep_insight_progress");
        
        if (savedProgress) {
          const { responses: savedResponses, currentQuestionIndex: savedIndex, userId } = JSON.parse(savedProgress);
          
          // Only restore if it belongs to the current user
          if (userId === user.id) {
            setResponses(savedResponses);
            setCurrentQuestionIndex(savedIndex);
            
            toast.info("Your progress has been restored", {
              description: "Continue your assessment where you left off."
            });
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, [user]);
  
  // Save progress when responses or currentQuestionIndex changes
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      saveProgress();
    }
  }, [responses, currentQuestionIndex]);
  
  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    updateResponse,
    currentQuestion,
    hasResponse,
    progress
  };
};
