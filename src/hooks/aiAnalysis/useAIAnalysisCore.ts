
import { useEffect, useRef } from 'react';
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
  const initialLoadCompletedRef = useRef(false);
  
  // Load analysis once on mount - with a guard to prevent multiple loads
  useEffect(() => {
    if (!initialLoadCompletedRef.current) {
      refreshAnalysis().then(() => {
        initialLoadCompletedRef.current = true;
        console.log("Initial analysis load completed");
      });
    }
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
