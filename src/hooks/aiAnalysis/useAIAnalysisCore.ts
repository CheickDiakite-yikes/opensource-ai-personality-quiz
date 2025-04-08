
import { useEffect, useRef } from 'react';
import { useAnalysisState } from './useAnalysisState';
import { useAnalysisRefresh } from './useAnalysisRefresh';
import { useAnalysisManagement } from './useAnalysisManagement';
import { useAnalyzeResponses } from '../analysis/useAnalyzeResponses';
import { useSupabaseSync } from './useSupabaseSync';

// Main hook that combines the smaller hooks
export const useAIAnalysisCore = () => {
  const state = useAnalysisState();
  const { refreshAnalysis } = useAnalysisRefresh(state, state);
  const { saveToHistory, getAnalysisHistory, setCurrentAnalysis } = useAnalysisManagement(state, state);
  const { isAnalyzing, analyzeResponses } = useAnalyzeResponses(saveToHistory, state.setAnalysis);
  const { fetchAnalysesFromSupabase } = useSupabaseSync();
  const initialLoadCompletedRef = useRef(false);
  const fetchAttemptsRef = useRef(0);
  
  // Load analysis once on mount - with a guard to prevent multiple loads
  // and add retry logic for more reliability
  useEffect(() => {
    if (!initialLoadCompletedRef.current) {
      const attemptRefresh = async () => {
        try {
          await refreshAnalysis();
          initialLoadCompletedRef.current = true;
          console.log("Initial analysis load completed");
          fetchAttemptsRef.current = 0; // Reset attempts on success
        } catch (error) {
          console.error("Error during initial analysis load:", error);
          
          // Try up to 3 times with exponential backoff
          if (fetchAttemptsRef.current < 3) {
            const delay = Math.pow(2, fetchAttemptsRef.current) * 1000; // 1s, 2s, 4s
            fetchAttemptsRef.current++;
            console.log(`Retrying analysis load (attempt ${fetchAttemptsRef.current}) in ${delay}ms`);
            setTimeout(attemptRefresh, delay);
          } else {
            console.error("Max retry attempts reached for initial analysis load");
            initialLoadCompletedRef.current = true; // Mark as completed to avoid further attempts
          }
        }
      };
      
      attemptRefresh();
    }
  }, [refreshAnalysis]);

  return {
    ...state,
    isAnalyzing,
    analyzeResponses,
    refreshAnalysis,
    getAnalysisHistory,
    setCurrentAnalysis,
    fetchAnalysesFromSupabase
  };
};
