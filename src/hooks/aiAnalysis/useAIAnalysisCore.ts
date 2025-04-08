
import { useEffect, useRef, useState } from 'react';
import { useAnalysisState } from './useAnalysisState';
import { useAnalysisRefresh } from './useAnalysisRefresh';
import { useAnalysisManagement } from './useAnalysisManagement';
import { useAnalyzeResponses } from '../analysis/useAnalyzeResponses';
import { useSupabaseSync } from './useSupabaseSync';
import { PersonalityAnalysis } from '@/utils/types';
import { toast } from 'sonner';

// Main hook that combines the smaller hooks
export const useAIAnalysisCore = () => {
  const state = useAnalysisState();
  const { refreshAnalysis } = useAnalysisRefresh(state, state);
  const { saveToHistory, getAnalysisHistory, setCurrentAnalysis } = useAnalysisManagement(state, state);
  const { isAnalyzing, analyzeResponses } = useAnalyzeResponses(saveToHistory, state.setAnalysis);
  const { fetchAnalysesFromSupabase } = useSupabaseSync();
  const initialLoadCompletedRef = useRef(false);
  const fetchAttemptsRef = useRef(0);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  
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
          setFetchError(null);
        } catch (error) {
          console.error("Error during initial analysis load:", error);
          setFetchError(error instanceof Error ? error : new Error("Unknown error during analysis load"));
          
          // Try up to 4 times with exponential backoff
          if (fetchAttemptsRef.current < 4) {
            const delay = Math.pow(2, fetchAttemptsRef.current) * 1000; // 1s, 2s, 4s, 8s
            fetchAttemptsRef.current++;
            console.log(`Retrying analysis load (attempt ${fetchAttemptsRef.current}) in ${delay}ms`);
            setTimeout(attemptRefresh, delay);
          } else {
            console.error("Max retry attempts reached for initial analysis load");
            initialLoadCompletedRef.current = true; // Mark as completed to avoid further attempts
            toast.error("Could not load your analysis data after multiple attempts", {
              description: "Please try refreshing the page"
            });
          }
        }
      };
      
      attemptRefresh();
    }
  }, [refreshAnalysis]);

  // Function to manually reload all analyses from Supabase
  const loadAllAnalysesFromSupabase = async (): Promise<PersonalityAnalysis[]> => {
    try {
      const data = await fetchAnalysesFromSupabase();
      if (!data || data.length === 0) {
        console.log("No analyses found in Supabase during manual load");
        return [];
      }
      
      console.log(`Manual load retrieved ${data.length} analyses from Supabase`);
      
      // Re-attempt refresh to update the state with all analyses
      await refreshAnalysis();
      
      // Return current analysis history
      return getAnalysisHistory();
    } catch (error) {
      console.error("Error during manual load of analyses:", error);
      toast.error("Failed to load all analyses", {
        description: "Please try again later"
      });
      return [];
    }
  };

  return {
    ...state,
    isAnalyzing,
    analyzeResponses,
    refreshAnalysis,
    getAnalysisHistory,
    setCurrentAnalysis,
    fetchAnalysesFromSupabase,
    loadAllAnalysesFromSupabase,
    fetchError
  };
};
