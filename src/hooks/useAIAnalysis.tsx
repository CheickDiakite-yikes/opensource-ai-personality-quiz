
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { useAnalysisById } from './aiAnalysis/useAnalysisById';
import { PersonalityAnalysis } from '@/utils/types';
import { useState, useEffect, useRef } from 'react';
import { useAnalysisRefresh } from './useAnalysisRefresh';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const {
    analysis,
    isLoading,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    fetchAnalysesFromSupabase,
    loadAllAnalysesFromSupabase,
    fetchAnalysisById,
    fetchError,
    analysisHistory
  } = useAIAnalysisCore();
  
  const { getAnalysisById, isLoadingAnalysisById } = useAnalysisById();
  const { forceAnalysisRefresh } = useAnalysisRefresh();
  
  // Track last total count for debugging
  const [lastHistoryCount, setLastHistoryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryRef = useRef<boolean>(false); // Use ref to avoid stale closures
  
  // Log changes to analysis history for debugging
  useEffect(() => {
    const currentCount = analysisHistory?.length || 0;
    if (currentCount !== lastHistoryCount) {
      console.log(`[useAIAnalysis] Analysis history count changed: ${lastHistoryCount} -> ${currentCount}`);
      
      // Add detailed logging about analyses
      if (analysisHistory && analysisHistory.length > 0) {
        console.log(`[useAIAnalysis] First analysis ID: ${analysisHistory[0].id}`);
        console.log(`[useAIAnalysis] Analysis history IDs: ${analysisHistory.map(a => a.id).join(', ')}`);
      }
      
      setLastHistoryCount(currentCount);
    }
  }, [analysisHistory, lastHistoryCount]);

  // Track when this hook is mounted/unmounted to prevent stale state
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle initial loading and periodic refreshes
  useEffect(() => {
    // Only load if the component is still mounted
    if (isMounted.current && !isRetrying) {
      console.log("[useAIAnalysis] Initial load or forced refresh triggered");
      
      // Avoid unnecessary loading if we already have data
      if (!analysis && !isLoading && analysisHistory.length === 0) {
        console.log("[useAIAnalysis] No analysis data found, loading from Supabase");
        
        setIsRetrying(true);
        retryRef.current = true;
        
        // Load all analyses from Supabase
        loadAllAnalysesFromSupabase()
          .then(analyses => {
            if (isMounted.current) {
              if (analyses && analyses.length > 0) {
                console.log(`[useAIAnalysis] Successfully loaded ${analyses.length} analyses from Supabase`);
              } else {
                console.log("[useAIAnalysis] No analyses found in Supabase");
              }
              setIsRetrying(false);
              retryRef.current = false;
            }
          })
          .catch(error => {
            if (isMounted.current) {
              console.error("[useAIAnalysis] Error loading analyses:", error);
              setIsRetrying(false);
              retryRef.current = false;
            }
          });
      }
    }
  }, [analysis, isLoading, loadAllAnalysesFromSupabase, analysisHistory.length, isRetrying]);

  // Add the forceFetchAllAnalyses method
  const forceFetchAllAnalyses = async (): Promise<PersonalityAnalysis[]> => {
    try {
      console.log("[useAIAnalysis] Force fetching all analyses");
      toast.loading("Fetching all analyses...", { id: "force-fetch" });
      
      // Try to get analyses from Supabase
      const allAnalyses = await fetchAnalysesFromSupabase(true);
      
      if (allAnalyses && allAnalyses.length > 0) {
        toast.success(`Found ${allAnalyses.length} analyses`, { id: "force-fetch" });
        return allAnalyses;
      }
      
      // If that fails, try the forceAnalysisRefresh method
      console.log("[useAIAnalysis] Direct fetch failed, trying forceAnalysisRefresh");
      const analyses = await forceAnalysisRefresh();
      
      if (analyses && analyses.length > 0) {
        toast.success(`Found ${analyses.length} analyses through fallback method`, { id: "force-fetch" });
        return analyses;
      }
      
      toast.error("Could not find any analyses", { id: "force-fetch" });
      return [];
    } catch (error) {
      console.error("[useAIAnalysis] Error in forceFetchAllAnalyses:", error);
      toast.error("Error fetching analyses", {
        id: "force-fetch",
        description: error instanceof Error ? error.message : "Unknown error"
      });
      return [];
    }
  };

  return {
    analysis,
    isLoading,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    fetchAnalysesFromSupabase,
    loadAllAnalysesFromSupabase,
    fetchAnalysisById,
    getAnalysisById,
    isLoadingAnalysisById,
    fetchError,
    forceAnalysisRefresh,
    forceFetchAllAnalyses
  };
};
