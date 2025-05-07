
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AssessmentResponse } from "@/utils/types";

export const useAssessmentSubmission = (
  responses: AssessmentResponse[],
  saveCurrentResponse: () => void
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Helper function to convert responses to a JSON-compatible format
  const toJsonCompatible = (responses: AssessmentResponse[]): any => {
    return responses.map(response => ({
      questionId: response.questionId,
      selectedOption: response.selectedOption || null,
      customResponse: response.customResponse || null,
      category: response.category,
      timestamp: response.timestamp.toISOString(),
    }));
  };

  const handleSubmitAssessment = async () => {
    try {
      saveCurrentResponse();
      setIsAnalyzing(true);

      // First, check if the user has credits
      const { data: creditsData, error: creditsError } = await supabase
        .from("assessment_credits")
        .select("credits_remaining")
        .eq("user_id", user?.id)
        .single();

      if (creditsError) {
        console.error("Error checking credits:", creditsError);
        toast.error("Failed to check your assessment credits. Please try again.");
        setIsAnalyzing(false);
        return;
      }

      if (!creditsData || creditsData.credits_remaining <= 0) {
        toast.error("You don't have enough credits to submit this assessment.");
        navigate("/assessment"); // Redirect to assessment intro page
        setIsAnalyzing(false);
        return;
      }

      // User has credits, proceed with assessment submission
      console.log("Submitting assessment with responses:", responses);

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Convert responses to JSON-compatible format
      const jsonResponses = toJsonCompatible(responses);

      // Save assessment responses to database
      const assessmentId = crypto.randomUUID();
      const { error: assessmentError } = await supabase.from("assessments").insert({
        id: assessmentId,
        user_id: user.id,
        responses: jsonResponses,
      });

      if (assessmentError) {
        throw new Error(`Error saving assessment: ${assessmentError.message}`);
      }

      // Deduct a credit from user's account
      const { error: updateCreditsError } = await supabase
        .from("assessment_credits")
        .update({
          credits_remaining: creditsData.credits_remaining - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateCreditsError) {
        console.error("Error updating credits:", updateCreditsError);
        // Continue processing even if credit update fails
        // We should implement a more robust error handling in production
      }

      // Make API call to analyze responses
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        "analyze-responses",
        {
          body: {
            assessmentId,
            userId: user.id,
            responses,
          },
        }
      );

      if (analysisError) {
        throw new Error(`Analysis error: ${analysisError.message}`);
      }

      // Clear local storage
      localStorage.removeItem("assessment_progress");

      // Navigate to the results page
      navigate(`/report/${assessmentId}`);
      toast.success("Your assessment has been submitted successfully!");
    } catch (error) {
      console.error("Assessment submission error:", error);
      toast.error("There was an error submitting your assessment. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    handleSubmitAssessment,
  };
};
