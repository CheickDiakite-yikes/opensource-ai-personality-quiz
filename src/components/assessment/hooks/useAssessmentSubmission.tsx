
import { useNavigate } from "react-router-dom";
import { AssessmentResponse } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { toast } from "sonner";

const ASSESSMENT_STORAGE_KEY = "assessment_progress";

export const useAssessmentSubmission = (
  responses: AssessmentResponse[],
  saveCurrentResponse: () => void
) => {
  const { analyzeResponses, isAnalyzing, refreshAnalysis } = useAIAnalysis();
  const navigate = useNavigate();
  
  const handleSubmitAssessment = async () => {
    // Save the final response
    saveCurrentResponse();
    
    try {
      toast.info("Analyzing your responses...", {
        duration: 3000,
      });
      
      // Send responses to the analyze function, which will store in Supabase if user is logged in
      const analysis = await analyzeResponses(responses);
      
      // Clear saved progress after successful submission
      localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
      
      // Refresh the analysis data to ensure we have the latest from Supabase
      await refreshAnalysis();
      
      // Navigate to the report page with the ID to ensure it can be loaded in the future
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
