
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ComprehensiveResponse, ComprehensiveSubmissionResponse } from "./comprehensiveTypes";

export function useComprehensiveSubmission(
  responses: Record<string, ComprehensiveResponse>
) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Submit assessment for analysis
  const handleSubmitAssessment = async () => {
    if (!user) {
      toast.error("Please log in to submit your assessment");
      return;
    }
    
    // Convert responses to the format expected by the backend
    const formattedResponses: ComprehensiveSubmissionResponse[] = Object.values(responses).map(response => ({
      questionId: response.questionId,
      answer: response.selectedOption === "Other" ? response.customResponse : response.selectedOption
    }));
    
    try {
      setIsAnalyzing(true);
      
      // Save assessment responses to Supabase - fix the format to match what Supabase expects
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("comprehensive_assessments")
        .insert({
          user_id: user.id,
          responses: formattedResponses
        })
        .select('id')
        .single();
      
      if (assessmentError) throw new Error(assessmentError.message);
      
      if (!assessmentData?.id) {
        throw new Error("Failed to create assessment");
      }
      
      // Call Supabase Edge Function to analyze responses
      const { data, error } = await supabase.functions.invoke(
        "analyze-comprehensive-responses",
        {
          body: { 
            assessmentId: assessmentData.id,
            responses: formattedResponses
          }
        }
      );
      
      if (error) throw new Error(error.message);
      
      // Clear stored progress after successful submission
      localStorage.removeItem("comprehensive_assessment_progress");
      
      // Navigate to the comprehensive report page
      navigate(`/comprehensive-report/${data.analysisId}`);
      
      toast.success("Your comprehensive assessment has been analyzed!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to submit assessment", { 
        description: error instanceof Error ? error.message : "Please try again later"
      });
      setIsAnalyzing(false);
    }
  };
  
  return {
    isAnalyzing,
    handleSubmitAssessment
  };
}
