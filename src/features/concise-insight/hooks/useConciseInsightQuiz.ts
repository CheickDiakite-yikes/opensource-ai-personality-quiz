import { useState, useEffect } from "react";
import { ConciseInsightResponses } from "../types";
import { conciseInsightQuestions } from "../data/questions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "concise_insight_responses";

export const useConciseInsightQuiz = (totalQuestions: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<ConciseInsightResponses>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Load saved progress from localStorage on initial load
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsedResponses = JSON.parse(savedProgress);
        setResponses(parsedResponses);
        
        // Find the next unanswered question
        const answeredQuestionIds = Object.keys(parsedResponses);
        if (answeredQuestionIds.length > 0 && answeredQuestionIds.length < totalQuestions) {
          for (let i = 0; i < conciseInsightQuestions.length; i++) {
            if (!answeredQuestionIds.includes(conciseInsightQuestions[i].id)) {
              setCurrentQuestionIndex(i);
              break;
            }
          }
        }
        
        console.log(`Loaded saved progress: ${answeredQuestionIds.length} questions answered`);
      } catch (err) {
        console.error("Error loading saved progress", err);
      }
    }
  }, [totalQuestions]);
  
  // Function to save current progress to localStorage
  const saveProgress = (updatedResponses: ConciseInsightResponses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResponses));
  };
  
  // Handle submitting an answer and moving to next question
  const handleSubmitQuestion = async (questionId: string, answer: string) => {
    setError(null);
    
    if (!answer) {
      setError("Please select an answer before continuing");
      return;
    }
    
    // Update responses with new answer
    const updatedResponses = { ...responses, [questionId]: answer };
    setResponses(updatedResponses);
    saveProgress(updatedResponses);
    
    // If this is the last question, save all responses to the database
    if (currentQuestionIndex === totalQuestions - 1) {
      try {
        if (!user) {
          toast.error("You must be signed in to save your assessment results.");
          navigate("/auth");
          return;
        }
        
        // Save responses to Supabase
        const assessmentId = `concise-${Date.now()}`;
        const { error: saveError } = await supabase
          .from('concise_assessments')
          .insert({
            id: assessmentId,
            user_id: user.id,
            responses: updatedResponses
          } as any);
          
        if (saveError) {
          throw saveError;
        }
        
        // Clear local storage after successful submission
        localStorage.removeItem(STORAGE_KEY);
        
        toast.success("Assessment completed successfully!");
        
        // Navigate to results page
        navigate(`/concise-insight/results?id=${assessmentId}`);
      } catch (err) {
        console.error("Error saving assessment", err);
        toast.error("There was an error saving your assessment. Please try again.");
      }
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Go back to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Clear saved progress and restart quiz
  const clearSavedProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setResponses({});
    setCurrentQuestionIndex(0);
    toast.success("Progress has been reset. You can start fresh.");
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
