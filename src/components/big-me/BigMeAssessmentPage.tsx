
import React, { useState } from "react";
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

    setIsSubmitting(true);

    try {
      // Format responses for submission
      const formattedResponses = Object.values(responses).map(response => ({
        questionId: response.questionId,
        selectedOption: response.selectedOption,
        customResponse: response.customResponse,
        category: response.category
      }));

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("big-me-analysis", {
        body: {
          responses: formattedResponses,
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Assessment submitted successfully!");
      
      // Redirect to results page
      navigate("/big-me/results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error(`Error submitting assessment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
