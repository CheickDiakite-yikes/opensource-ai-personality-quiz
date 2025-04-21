
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBigMeState } from "./hooks/useBigMeState";
import BigMeQuestionCard from "./BigMeQuestionCard";
import BigMeProgress from "./BigMeProgress";
import BigMeHeader from "./BigMeHeader";
import BigMeControls from "./BigMeControls";

const BigMeAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add abort controller to handle timeouts and cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const { 
    currentQuestion,
    totalQuestions,
    responses,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    handleResponseSelection,
    handleCustomResponse,
    calculateProgress,
    isLastQuestion,
    isFirstQuestion
  } = useBigMeState();

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit your assessment");
      return;
    }

    // Clean up any existing controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new abort controller for this submission
    abortControllerRef.current = new AbortController();
    
    setIsSubmitting(true);
    
    // Show initial toast
    toast.loading("Analyzing your responses...", {
      id: "big-me-analysis",
      duration: 60000 // 1 minute loading toast
    });

    try {
      // Format responses for submission
      const formattedResponses = Object.values(responses).map(response => ({
        questionId: response.questionId,
        // Fix: Get the question text from currentQuestion or the question bank
        question: currentQuestion?.question || "",
        selectedOption: response.selectedOption,
        customResponse: response.customResponse,
        category: response.category
      }));

      // Add a timeout for the edge function call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Analysis request timed out")), 120000); // 2 minute timeout
      });

      // Call the Supabase Edge Function with a race against the timeout
      const resultPromise = supabase.functions.invoke("big-me-analysis", {
        body: {
          responses: formattedResponses,
          userId: user.id,
          timestamp: new Date().toISOString() // Add timestamp to reduce caching issues
        }
      });

      // Race between function call and timeout
      const { data, error } = await Promise.race([
        resultPromise,
        timeoutPromise.then(() => {
          throw new Error("Analysis request timed out after 2 minutes");
        })
      ]);

      if (error) {
        console.error("Error details:", error);
        throw new Error(error.message || "Unknown error during analysis");
      }

      if (!data || !data.analysisId) {
        throw new Error("Invalid response from analysis function");
      }

      toast.success("Assessment submitted successfully!", {
        id: "big-me-analysis"
      });
      
      // Redirect to results page
      navigate("/big-me/results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // Show more descriptive error message
      toast.error(`Error submitting assessment: ${error instanceof Error ? error.message : "Unknown error"}`, {
        id: "big-me-analysis",
        description: "Please try again in a moment",
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
      // Don't clear the abort controller here as we might need it for cleanup
    }
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BigMeHeader />
      
      <BigMeProgress 
        progress={calculateProgress()} 
        currentQuestion={currentQuestionIndex + 1} 
        totalQuestions={totalQuestions}
      />
      
      <Card className="p-6 mb-8 shadow-lg">
        {currentQuestion && (
          <BigMeQuestionCard
            question={currentQuestion}
            selectedOption={responses[currentQuestion.id]?.selectedOption}
            customResponse={responses[currentQuestion.id]?.customResponse}
            onSelectOption={(option) => handleResponseSelection(currentQuestion.id, option)}
            onCustomResponse={(response) => handleCustomResponse(currentQuestion.id, response)}
          />
        )}
      </Card>
      
      <BigMeControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default BigMeAssessmentPage;
