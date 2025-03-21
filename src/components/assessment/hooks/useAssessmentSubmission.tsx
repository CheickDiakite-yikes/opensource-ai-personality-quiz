
import { useNavigate } from "react-router-dom";
import { AssessmentResponse } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ASSESSMENT_STORAGE_KEY = "assessment_progress";

export const useAssessmentSubmission = (
  responses: AssessmentResponse[],
  saveCurrentResponse: () => void
) => {
  const { analyzeResponses, isAnalyzing } = useAIAnalysis();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleSubmitAssessment = async () => {
    // Save the final response
    saveCurrentResponse();
    
    try {
      toast.info("Analyzing your responses...", {
        duration: 3000,
      });
      
      // Debug log to track submission start
      console.log("Starting assessment submission process, user:", user?.id || "not logged in");
      
      // Generate an assessment ID for both logged-in and anonymous users
      const assessmentId = `assessment-${Date.now()}`;
      
      // If user is logged in, save the assessment to Supabase first
      if (user) {
        console.log("User is logged in, saving assessment to Supabase for user:", user.id);
        try {
          // Convert AssessmentResponse[] to a JSON-compatible format
          const jsonResponses = JSON.parse(JSON.stringify(responses));
          
          const { error } = await supabase
            .from('assessments')
            .insert({
              id: assessmentId,
              user_id: user.id,
              responses: jsonResponses
            });
            
          if (error) {
            console.error("Error saving assessment to Supabase:", error);
            toast.error("Could not save your assessment data", {
              description: error.message,
              duration: 5000
            });
          } else {
            console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
          }
        } catch (err) {
          console.error("Unexpected error saving assessment:", err);
        }
      } else {
        console.log("User not logged in, assessment will only be stored locally");
      }
      
      // Send responses to the analyze function, which will store analysis in Supabase if user is logged in
      const analysis = await analyzeResponses(responses);
      
      // Clear saved progress after successful submission
      localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
      
      // Navigate to the report page with the ID to ensure it can be loaded in the future
      console.log("Analysis complete, navigating to report page with ID:", analysis.id);
      navigate(`/report/${analysis.id}`);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return {
    handleSubmitAssessment,
    isAnalyzing
  };
};
