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
      
      // Call Supabase Edge Function to analyze responses with improved error handling and timeout management
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
          
          // Setup AbortController with timeout for the request (60 seconds)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000);
          
          try {
            // Call the edge function
            const { data, error } = await supabase.functions.invoke(
              "analyze-comprehensive-responses",
              {
                body: { 
                  assessmentId: createdAssessmentId,
                  responses: formattedResponses
                }
              }
            );
            
            // Clear the timeout since the request completed
            clearTimeout(timeoutId);
            
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
          } catch (abortError) {
            // Handle timeout specifically
            if (abortError.name === 'AbortError') {
              console.log("Request timed out, but responses were saved");
              throw new Error("Analysis request timed out after 60 seconds. Your responses were saved and will be analyzed later.");
            } else {
              throw abortError;
            }
          }
        } catch (error) {
          console.error(`Error attempt ${retry + 1}:`, error);
          lastError = error;
          
          // If this was the last retry, we'll handle the navigation after the loop
          if (retry === MAX_RETRIES) {
            console.error("All retries failed");
            // Instead of throwing an error, we'll handle the navigation to the report page
            // The report page will try to poll for the analysis
            toast.warning("Analysis is taking longer than expected", { 
              id: "assessment-submission",
              description: "We'll take you to the report page where you can check the status."
            });
            
            // Navigate to the report page with the assessment ID
            navigate(`/comprehensive-report/${createdAssessmentId}`);
            return;
          }
        }
      }
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // Check if the assessment was created but analysis failed
      if (createdAssessmentId) {
        toast.error("Your assessment was saved but analysis failed", { 
          id: "assessment-submission",
          description: "We'll try to analyze it again when you view your reports. You can continue to your profile to see existing reports."
        });
        
        // Navigate to the assessment ID, the report page will handle polling
        navigate(`/comprehensive-report/${createdAssessmentId}`);
      } else {
        // Complete submission failure
        toast.error("Failed to submit assessment", { 
          id: "assessment-submission",
          description: error instanceof Error ? error.message : "Please try again later"
        });
        
        setIsAnalyzing(false);
      }
    }
  };
  
  return {
    isAnalyzing,
    handleSubmitAssessment
  };
}
