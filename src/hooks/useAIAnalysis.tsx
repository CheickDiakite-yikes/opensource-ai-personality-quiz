
import { useState } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { useAnalyzeResponses } from "./analysis/useAnalyzeResponses";
import { saveAnalysisToHistory, getAnalysisById } from "./analysis/useLocalStorage";

export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  
  // Use the useAnalyzeResponses hook to handle analysis operations
  const { isAnalyzing, analyzeResponses: processResponses } = useAnalyzeResponses(
    saveAnalysisToHistory,
    setAnalysis
  );
  
  // Wrapper function to analyze responses
  const analyzeResponses = (
    responses: AssessmentResponse[], 
    assessmentId?: string
  ): Promise<PersonalityAnalysis> => {
    return processResponses(responses, assessmentId);
  };
  
  // Get analysis by ID from local storage
  const getAnalysis = (id: string): PersonalityAnalysis | null => {
    return getAnalysisById(id);
  };
  
  return {
    analysis,
    setAnalysis,
    isAnalyzing,
    analyzeResponses,
    getAnalysis
  };
};
