
import { useEffect } from 'react';
import { useAnalysisState } from './useAnalysisState';
import { useAnalysisRefresh } from './useAnalysisRefresh';
import { useAnalysisManagement } from './useAnalysisManagement';
import { useAnalyzeResponses } from '../analysis/useAnalyzeResponses';

// Main hook that combines the smaller hooks
export const useAIAnalysisCore = () => {
  const state = useAnalysisState();
  const { refreshAnalysis } = useAnalysisRefresh(state, state);
  const { saveToHistory, getAnalysisHistory, setCurrentAnalysis } = useAnalysisManagement(state, state);
  const { isAnalyzing, analyzeResponses } = useAnalyzeResponses(saveToHistory, state.setAnalysis);
  
  // Load analysis once on mount
  useEffect(() => {
    refreshAnalysis();
  }, [refreshAnalysis]);

  return {
    ...state,
    isAnalyzing,
    analyzeResponses,
    refreshAnalysis,
    getAnalysisHistory,
    setCurrentAnalysis
  };
};
