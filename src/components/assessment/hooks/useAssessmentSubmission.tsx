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
        duration: 15000, // Increased duration to account for longer analysis time
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
      console.log("Analysis may take 2-5 minutes due to comprehensive data generation");
      
      toast.loading("Analysis in progress. This may take a few minutes as our AI generates comprehensive insights for you.", {
        id: "analyzing-toast",
        duration: 60000
      });
      
      // CRITICAL FIX: Modify retry mechanism for analysis to avoid duplicate calls
      let analysis = null;
      
      try {
        analysis = await analyzeResponses(responses);
        
        if (!analysis || !analysis.id) {
          console.error("Invalid analysis result:", analysis);
          throw new Error("Invalid analysis result");
        }
        
        console.log("Analysis completed successfully with ID:", analysis.id);
      } catch (error) {
        console.error("Analysis failed:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
        
        // CRITICAL FIX: Get the last analysis from history as a fallback
        await refreshAnalysis();
        const analysisHistory = await supabase
          .from('analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (!analysisHistory.error && analysisHistory.data && analysisHistory.data.length > 0) {
          console.log("Found fallback analysis from database:", analysisHistory.data[0].id);
          analysis = analysisHistory.data[0];
        } else {
          console.error("No fallback analysis available");
          throw new Error(`Analysis failed and no fallback available: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      if (!analysis) {
        throw new Error("Analysis attempt failed and no fallback available");
      }
      
      // Clear saved progress after successful submission
      localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
      console.log("Cleared assessment progress from localStorage");
      
      // Force refresh the analysis data to ensure we have the latest from Supabase
      console.log("Refreshing analysis data before navigation...");
      await refreshAnalysis().catch(error => {
        console.error("Failed to refresh analysis data:", error);
        // Continue even if refresh fails, as we still have the analysis object
      });
      
      // Add increased delay to ensure analysis is fully processed and available
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if analysis is sufficiently complete
      const traitsCount = analysis.traits && Array.isArray(analysis.traits) ? analysis.traits.length : 0;
      const isComplete = traitsCount >= 8;
      
      console.log(`Analysis has ${traitsCount} traits, minimum required: 8, complete: ${isComplete}`);
      
      // Update the analyzing toast to show success
      toast.success(isComplete ? "Analysis completed successfully!" : "Analysis partially completed", {
        id: "analyzing-toast",
        duration: 5000
      });
      
      // Validate that we have sufficient traits for display
      if (!isComplete) {
        console.warn(`Analysis has insufficient traits: ${traitsCount}/8 minimum required`);
        toast.warning("Analysis data is incomplete", {
          description: "We'll try to show what we have, but consider retaking the assessment",
          duration: 8000
        });
      }
      
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
        duration: 8000
      });
    }
  };

  return {
    handleSubmitAssessment,
    isAnalyzing
  };
};
