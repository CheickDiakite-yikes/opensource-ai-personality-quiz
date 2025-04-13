
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ComprehensiveResponse, ComprehensiveSubmissionResponse } from "./comprehensiveTypes";
import { Json } from "@/integrations/supabase/types";

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
    
    // Track the assessment data outside the try block so it's accessible in the catch block
    let createdAssessmentId: string | null = null;
    
    try {
      setIsAnalyzing(true);
      toast.loading("Saving your assessment responses...", { id: "assessment-submission" });
      
      // Save assessment responses to Supabase
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("comprehensive_assessments")
        .insert({
          user_id: user.id,
          responses: formattedResponses as unknown as Json
        })
        .select('id')
        .single();
      
      if (assessmentError) throw new Error(assessmentError.message);
      
      if (!assessmentData?.id) {
        throw new Error("Failed to create assessment");
      }
      
      // Store the ID for use in the catch block if needed
      createdAssessmentId = assessmentData.id;
      
      toast.loading("Analyzing your responses with AI...", { id: "assessment-submission" });
      
      // Call Supabase Edge Function to analyze responses with improved error handling
      const MAX_RETRIES = 2;
      let lastError = null;
      
      for (let retry = 0; retry <= MAX_RETRIES; retry++) {
        try {
          console.log(`Attempt ${retry + 1} to analyze responses for assessment ${createdAssessmentId}`);
          
          if (retry > 0) {
            // Add delay between retries with exponential backoff
            await new Promise(r => setTimeout(r, retry * 2000));
            toast.loading(`Retrying analysis... (Attempt ${retry + 1})`, { id: "assessment-submission" });
          }
          
          // Set a longer timeout for the request - we can't use AbortController with Supabase functions
          // so we'll need a different approach
          
          // Call the edge function without the signal option (it's not supported)
          const { data, error } = await supabase.functions.invoke(
            "analyze-comprehensive-responses",
            {
              body: { 
                assessmentId: createdAssessmentId,
                responses: formattedResponses
              }
              // Removed the signal property as it's not supported
            }
          );
          
          if (error) throw new Error(error.message);
          
          if (!data?.analysisId) {
            throw new Error("Analysis completed but no analysis ID was returned");
          }
          
          // Clear stored progress after successful submission
          localStorage.removeItem("comprehensive_assessment_progress");
          
          // Show success message
          toast.success("Analysis complete!", { id: "assessment-submission" });
          
          // Navigate to the comprehensive report page
          navigate(`/comprehensive-report/${data.analysisId}`);
          return;
        } catch (error) {
          console.error(`Error attempt ${retry + 1}:`, error);
          lastError = error;
          
          // If this was the last retry, we'll throw the error after the loop
          if (retry === MAX_RETRIES) {
            console.error("All retries failed");
          }
        }
      }
      
      // If we got here, all retries failed
      throw lastError || new Error("Failed to analyze responses after multiple attempts");
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // Check if the assessment was created but analysis failed
      if (createdAssessmentId) {
        toast.error("Your assessment was saved but analysis failed", { 
          id: "assessment-submission",
          description: "We'll try to analyze it again when you view your reports"
        });
        
        // Navigate to the profile page instead
        navigate("/profile");
      } else {
        // Complete submission failure
        toast.error("Failed to submit assessment", { 
          id: "assessment-submission",
          description: error instanceof Error ? error.message : "Please try again later"
        });
      }
      
      setIsAnalyzing(false);
    }
  };
  
  return {
    isAnalyzing,
    handleSubmitAssessment
  };
}
