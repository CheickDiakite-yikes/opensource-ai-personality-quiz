
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentQuestion } from "@/utils/types";
import { useResponseManagement } from "./hooks/useResponseManagement";
import { useAssessmentStorage } from "./hooks/useAssessmentStorage";
import { useCategoryProgress } from "./hooks/useCategoryProgress";
import { useAssessmentNavigation } from "./hooks/useAssessmentNavigation";
import { useAssessmentSubmission } from "./hooks/useAssessmentSubmission";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAssessmentState = (allQuestions: AssessmentQuestion[]) => {
  const navigate = useNavigate();
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    responses,
    setResponses,
    completedQuestions,
    setCompletedQuestions,
    currentResponse,
    useCustomResponse,
    handleOptionSelect,
    handleCustomResponseChange,
    saveCurrentResponse,
    setupResponseForQuestion,
    initializeFromExistingResponses
  } = useResponseManagement(allQuestions);
  
  const { user } = useAuth();

  const { categoryProgress } = useCategoryProgress(responses, allQuestions);
  
  const { handleSubmitAssessment, isAnalyzing } = useAssessmentSubmission(
    responses,
    saveCurrentResponse
  );
  
  const { goToNextQuestion, goToPreviousQuestion } = useAssessmentNavigation(
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveCurrentResponse,
    setupResponseForQuestion,
    currentResponse,
    allQuestions.length,
    handleSubmitAssessment
  );
  
  const { clearSavedProgress } = useAssessmentStorage(
    responses,
    completedQuestions,
    currentQuestionIndex,
    setResponses,
    setCompletedQuestions,
    setCurrentQuestionIndex,
    allQuestions
  );

  // Check if the user has assessment credits
  useEffect(() => {
    const checkUserCredits = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("assessment_credits")
          .select("credits_remaining")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          console.error("Error checking credits:", error);
          return;
        }
        
        // If user has no credits, redirect to assessment intro
        if (!data || data.credits_remaining <= 0) {
          console.log("User has no credits, redirecting to assessment intro page...");
          
          // Only redirect if we're on the assessment quiz page
          if (window.location.pathname === "/assessment-quiz") {
            navigate("/assessment");
            toast.info("You need credits to access the assessment", {
              description: "Purchase credits to continue."
            });
          }
        } else {
          console.log(`User has ${data.credits_remaining} credits available.`);
        }
      } catch (err) {
        console.error("Error in credit checking:", err);
      }
    };
    
    checkUserCredits();
  }, [user, navigate]);
  
  // Handle restoring the current response when loaded from storage
  useEffect(() => {
    const attemptProgressRestore = () => {
      try {
        const savedProgress = localStorage.getItem("assessment_progress");
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          if (parsedProgress && parsedProgress.responses) {
            const restoredQuestionIndex = parsedProgress.currentQuestionIndex || 0;
            if (restoredQuestionIndex >= 0 && restoredQuestionIndex < allQuestions.length) {
              initializeFromExistingResponses(parsedProgress.responses, restoredQuestionIndex);
              setCurrentQuestionIndex(restoredQuestionIndex);
              setResponses(parsedProgress.responses);
              setCompletedQuestions(parsedProgress.completedQuestions || []);
              
              console.log(`Restored assessment progress with ${parsedProgress.responses.length} responses at question ${restoredQuestionIndex}`);
              
              if (user) {
                toast.info("Your progress has been restored", {
                  description: "Continue your assessment where you left off."
                });
              }
            } else {
              console.log("Invalid question index in saved progress, starting fresh");
            }
          }
        } else {
          console.log("No saved progress found, starting fresh assessment");
        }
      } catch (error) {
        console.error("Error initializing current response:", error);
        toast.error("Could not restore your previous progress", {
          description: "Starting a new assessment."
        });
      }
    };
    
    // Delay the progress restoration slightly to ensure component is fully mounted
    setTimeout(attemptProgressRestore, 100);
  }, []);

  return {
    currentQuestionIndex,
    currentQuestion,
    responses,
    currentResponse,
    useCustomResponse,
    completedQuestions,
    categoryProgress,
    isAnalyzing,
    handleOptionSelect,
    handleCustomResponseChange,
    goToNextQuestion,
    goToPreviousQuestion,
    handleSubmitAssessment,
    clearSavedProgress,
  };
};
