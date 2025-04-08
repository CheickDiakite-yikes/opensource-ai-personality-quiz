
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
      // Generate a simple ID for assessment - text format now works with our updated table
      const assessmentId = `assessment-${Date.now()}`;
      
      // Convert responses to JSON-compatible format
      const jsonResponses = JSON.parse(JSON.stringify(responses));
      
      console.log(`Attempting to save assessment with ID: ${assessmentId} and ${responses.length} responses`);
      console.log("First few responses:", JSON.stringify(responses.slice(0, 2)));
      
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
        console.error("Error details:", JSON.stringify(error));
        toast.error("Failed to save your assessment", {
          description: "Your results will still be analyzed but may not be saved to your account"
        });
        return null;
      }
      
      console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
      return assessmentId;
    } catch (error) {
      console.error("Exception saving assessment to Supabase:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
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
        console.error("Not enough responses to analyze:", responses.length);
        toast.error("Not enough responses to analyze", {
          description: "Please answer more questions"
        });
        return;
      }
      
      // Log responses for debugging
      console.log(`Submitting assessment with ${responses.length} responses`);
      console.log("Response categories distribution:", 
        [...new Set(responses.map(r => r.category))].map(category => 
          `${category}: ${responses.filter(r => r.category === category).length}`
        ).join(', ')
      );
      
      // First, save responses directly to Supabase
      const savedAssessmentId = await saveResponsesDirectlyToSupabase(responses);
      
      if (savedAssessmentId) {
        console.log("Assessment saved with ID:", savedAssessmentId);
      } else {
        console.warn("Could not save assessment directly, continuing with analysis only");
      }
      
      // Send responses to the analyze function, which will also try to store in Supabase
      console.log("Starting AI analysis with responses:", responses.length);
      const analysis = await analyzeResponses(responses).catch(error => {
        console.error("Error during analysis:", error);
        console.error("Error stack:", error.stack);
        throw new Error(`Analysis failed: ${error.message}`);
      });
      
      if (!analysis || !analysis.id) {
        console.error("Invalid analysis result:", analysis);
        throw new Error("Invalid analysis result");
      }
      
      console.log("Analysis completed successfully with ID:", analysis.id);
      
      // Clear saved progress after successful submission
      localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
      console.log("Cleared assessment progress from localStorage");
      
      // Force refresh the analysis data to ensure we have the latest from Supabase
      console.log("Refreshing analysis data before navigation...");
      await refreshAnalysis().catch(error => {
        console.error("Failed to refresh analysis data:", error);
        // Continue even if refresh fails, as we still have the analysis object
      });
      
      // Update the analyzing toast to show success
      toast.success("Analysis completed successfully!", {
        id: "analyzing-toast",
        duration: 3000
      });
      
      // Navigate to the report page with the ID and state to indicate it's from assessment
      console.log("Navigating to report page with ID:", analysis.id);
      navigate(`/report/${analysis.id}`, { 
        state: { fromAssessment: true }
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
      toast.error("Something went wrong during analysis", {
        id: "analyzing-toast",
        description: error instanceof Error ? error.message : "Please try again or check your connection",
        duration: 5000
      });
    }
  };

  return {
    handleSubmitAssessment,
    isAnalyzing
  };
};
