
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
      
      // Insert into assessments table with retry mechanism
      let retries = 0;
      const maxRetries = 2;
      let data = null;
      let error = null;
      
      while (retries <= maxRetries) {
        try {
          const result = await supabase
            .from('assessments')
            .insert({
              id: assessmentId,
              user_id: user.id,
              responses: jsonResponses
            })
            .select('id')
            .single();
            
          data = result.data;
          error = result.error;
          
          if (!error) {
            console.log(`Successfully saved assessment to Supabase with ID: ${assessmentId} on attempt ${retries + 1}`);
            break;
          }
          
          console.error(`Attempt ${retries + 1}: Failed to save assessment to Supabase:`, error);
          retries++;
          
          if (retries <= maxRetries) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            console.log(`Retrying save, attempt ${retries + 1}...`);
          }
        } catch (e) {
          console.error(`Attempt ${retries + 1}: Exception saving assessment to Supabase:`, e);
          error = e;
          retries++;
          
          if (retries <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          }
        }
      }
      
      if (error) {
        console.error("All attempts to save assessment failed:", error);
        toast.error("Failed to save your assessment", {
          description: "Your results will still be analyzed but may not be saved to your account"
        });
        return null;
      }
      
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
        duration: 20000, // Increased duration to account for longer analysis time
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
        duration: 90000 // 1.5 minutes
      });
      
      // Add retry mechanism for analysis
      let analysis = null;
      let retryCount = 0;
      let lastError = null;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries && !analysis) {
        try {
          if (retryCount > 0) {
            console.log(`Retry attempt ${retryCount} for analysis...`);
            toast.loading(`Retrying analysis (attempt ${retryCount} of ${maxRetries})...`, {
              id: "analyzing-toast",
              duration: 60000
            });
            
            // Wait a bit longer between retries
            await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
          }
          
          // Retry with progressively fewer responses if we're on retry attempts
          const responseSubset = retryCount > 0 ? 
            responses.slice(0, Math.max(20, Math.floor(responses.length * 0.8))) : 
            responses;
            
          if (retryCount > 0) {
            console.log(`Using reduced set of ${responseSubset.length} responses for retry attempt`);
          }
          
          analysis = await analyzeResponses(responseSubset);
          
          if (!analysis || !analysis.id) {
            console.error(`Attempt ${retryCount}: Invalid analysis result:`, analysis);
            throw new Error("Invalid analysis result");
          }
          
          console.log(`Analysis completed successfully on attempt ${retryCount} with ID:`, analysis.id);
          break; // Exit the loop if successful
          
        } catch (error) {
          console.error(`Analysis attempt ${retryCount} failed:`, error);
          console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
          lastError = error;
          
          if (retryCount >= maxRetries) {
            throw new Error(`Analysis failed after ${maxRetries} attempts: ${error instanceof Error ? error.message : String(error)}`);
          }
          
          retryCount++;
        }
      }
      
      if (!analysis) {
        throw new Error("All analysis attempts failed");
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
      const isComplete = traitsCount >= 5;
      
      console.log(`Analysis has ${traitsCount} traits, minimum required: 5, complete: ${isComplete}`);
      
      // Update the analyzing toast to show success
      toast.success(isComplete ? "Analysis completed successfully!" : "Analysis partially completed", {
        id: "analyzing-toast",
        duration: 5000
      });
      
      // Validate that we have sufficient traits for display
      if (!isComplete) {
        console.warn(`Analysis has insufficient traits: ${traitsCount}/5 minimum required`);
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
