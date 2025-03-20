
import { useState, useEffect } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { loadAnalysisHistory, saveAnalysisToHistory } from "./analysis/useLocalStorage";
import { useAnalyzeResponses } from "./analysis/useAnalyzeResponses";

export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);

  // Load analysis history from localStorage on component mount
  useEffect(() => {
    const history = loadAnalysisHistory();
    setAnalysisHistory(history);
    
    // If there's a current analysis in history, set it as the current one
    if (history.length > 0) {
      setAnalysis(history[0]);
    }
  }, []);

  // Function to save analysis to history
  const saveToHistory = (newAnalysis: PersonalityAnalysis) => {
    const savedAnalysis = saveAnalysisToHistory(newAnalysis, analysisHistory);
    // Update the history state
    setAnalysisHistory(prev => [savedAnalysis, ...prev.filter(a => a.id !== savedAnalysis.id)].slice(0, 10));
    return savedAnalysis;
  };

  // Use the analyze responses hook with the saveToHistory function
  const { isAnalyzing, analyzeResponses } = useAnalyzeResponses(saveToHistory, setAnalysis);

  // Utility functions for history management
  const getAnalysisHistory = () => {
    return analysisHistory;
  };

  const setCurrentAnalysis = (analysisId: string) => {
    const selected = analysisHistory.find(item => item.id === analysisId);
    if (selected) {
      setAnalysis(selected);
      return true;
    }
    return false;
  };

  return {
    isAnalyzing,
    analysis,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis
  };
};
