
import { useState } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { saveAssessmentToStorage } from "./useLocalStorage";
import { categorizeResponses, generateMockAnalysis } from "./mockAnalysisGenerator";

export const useAnalyzeResponses = (
  saveToHistory: (analysis: PersonalityAnalysis) => PersonalityAnalysis, 
  setAnalysis: (analysis: PersonalityAnalysis) => void
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResponses = async (responses: AssessmentResponse[]): Promise<PersonalityAnalysis> => {
    setIsAnalyzing(true);
    toast.info("Analyzing your responses...");

    try {
      // In a real implementation, you would send the responses to an AI API
      // and process the results
      console.log("Analyzing responses:", responses);
      
      // Save responses to localStorage and get assessment ID
      const assessmentId = saveAssessmentToStorage(responses);
      
      // Categorize responses for potential use in analysis
      const categorizedResponses = categorizeResponses(responses);
      console.log("Categorized responses:", categorizedResponses);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock analysis with the assessment ID
      const mockAnalysis = generateMockAnalysis(assessmentId);
      
      // Save to history and update the current analysis
      const savedAnalysis = saveToHistory(mockAnalysis);
      setAnalysis(savedAnalysis);
      
      toast.success("Analysis complete!");
      return savedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      toast.error("Failed to analyze responses. Please try again.");
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeResponses
  };
};
