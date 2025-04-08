
import { useNavigate } from "react-router-dom";
import { AssessmentResponse } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

const ASSESSMENT_STORAGE_KEY = "assessment_progress";

export const useAssessmentSubmission = (
  responses: AssessmentResponse[],
  saveCurrentResponse: () => void
) => {
  const { analyzeResponses, isAnalyzing, refreshAnalysis } = useAIAnalysis();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const saveResponsesDirectlyToSupabase = async (responses: AssessmentResponse[]) => {
    if (!user) {
      console.log("No user logged in, skipping direct Supabase save");
      return null;
    }
    
    try {
      // Generate a UUID for assessment
      const assessmentId = `assessment-${uuidv4()}`;
      
      // Convert responses to JSON-compatible format
      const jsonResponses = JSON.parse(JSON.stringify(responses));
      
      // Insert into assessments table
      const { data, error } = await supabase
        .from('assessments')
        .insert({
          id: assessmentId,
          user_id: user.id,
          responses: jsonResponses
        })
        .select('id')
        .single();
        
      if (error) {
        console.error("Failed to save assessment to Supabase:", error);
        toast.error("Failed to save your assessment", {
          description: "Your results will still be analyzed but may not be saved to your account"
        });
        return null;
      }
      
      console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
      return assessmentId;
    } catch (error) {
      console.error("Exception saving assessment to Supabase:", error);
      return null;
    }
  };
  
  const handleSubmitAssessment = async () => {
    // Save the final response
    saveCurrentResponse();
    
    try {
      toast.info("Analyzing your responses...", {
        duration: 5000,
        id: "analyzing-toast"
      });
      
      // Validate that we have sufficient responses
      if (responses.length < 5) {
        toast.error("Not enough responses to analyze", {
          description: "Please answer more questions"
        });
        return;
      }
      
      // First, save responses directly to Supabase
      const savedAssessmentId = await saveResponsesDirectlyToSupabase(responses);
      
      if (savedAssessmentId) {
        console.log("Assessment saved with ID:", savedAssessmentId);
      } else {
        console.warn("Could not save assessment directly, continuing with analysis only");
      }
      
      // Send responses to the analyze function, which will also try to store in Supabase
      const analysis = await analyzeResponses(responses).catch(error => {
        console.error("Error during analysis:", error);
        throw new Error(`Analysis failed: ${error.message}`);
      });
      
      if (!analysis || !analysis.id) {
        throw new Error("Invalid analysis result");
      }
      
      // Clear saved progress after successful submission
      localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
      
      // Refresh the analysis data to ensure we have the latest from Supabase
      await refreshAnalysis().catch(error => {
        console.error("Failed to refresh analysis data:", error);
        // Continue even if refresh fails, as we still have the analysis object
      });
      
      // Update the analyzing toast to show success
      toast.success("Analysis completed successfully!", {
        id: "analyzing-toast",
        duration: 3000
      });
      
      // Navigate to the report page with the ID to ensure it can be loaded in the future
      navigate(`/report/${analysis.id}`);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Something went wrong during analysis", {
        id: "analyzing-toast",
        description: "Please try again or check your connection",
        duration: 5000
      });
    }
  };

  return {
    handleSubmitAssessment,
    isAnalyzing
  };
};
