
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
        duration: 15000,
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
      
      console.log(`Submitting assessment with ${responses.length} responses`);
      
      // First, save responses directly to Supabase
      const savedAssessmentId = await saveResponsesDirectlyToSupabase(responses);
      
      if (savedAssessmentId) {
        console.log("Assessment saved with ID:", savedAssessmentId);
      } else {
        console.warn("Could not save assessment directly, continuing with analysis only");
      }
      
      toast.loading("Analysis in progress. This may take a few minutes as our AI generates comprehensive insights for you.", {
        id: "analyzing-toast",
        duration: 60000
      });
      
      // Send responses to AI for analysis
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
        
        // Attempt to refresh and get the latest analysis as fallback
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
          toast.error("Analysis failed", {
            id: "analyzing-toast",
            description: "Please try again or check your connection",
            duration: 8000
          });
          return;
        }
      }
      
      if (!analysis) {
        toast.error("Analysis failed", {
          id: "analyzing-toast",
          description: "Unable to generate your personality profile",
          duration: 8000
        });
        return;
      }
      
      // Clear saved progress after successful submission
      localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
      console.log("Cleared assessment progress from localStorage");
      
      // Force refresh the analysis data
      await refreshAnalysis();
      
      // Add a short delay to ensure analysis is available
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the toast to show success
      toast.success("Analysis completed successfully!", {
        id: "analyzing-toast",
        duration: 5000
      });
      
      // Navigate to the report page with the ID
      console.log("Navigating to report page with ID:", analysis.id);
      navigate(`/report/${analysis.id}`, { 
        state: { fromAssessment: true }
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Something went wrong during analysis", {
        id: "analyzing-toast",
        description: error instanceof Error ? error.message : "Please try again",
        duration: 8000
      });
    }
  };

  return {
    handleSubmitAssessment,
    isAnalyzing
  };
};
