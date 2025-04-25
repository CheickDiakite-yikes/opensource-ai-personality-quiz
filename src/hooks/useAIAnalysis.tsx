
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { useAnalysisById } from './aiAnalysis/useAnalysisById';
import { PersonalityAnalysis } from '@/utils/types';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  
  // State for tracking retries and loading
  const [isRetrying, setIsRetrying] = useState(false);
  const retryRef = useRef<boolean>(false); // Use ref to avoid stale closures
  const maxRetries = useRef<number>(3); // Maximum number of retries
  
  // Track when this hook is mounted/unmounted
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle initial loading of analyses
  useEffect(() => {
    if (isMounted.current && !isRetrying && analysisHistory.length === 0 && !isLoading) {
      console.log("[useAIAnalysis] No analysis data found, loading from Supabase");
      
      setIsRetrying(true);
      retryRef.current = true;
      
      let retryCount = 0;
      const attemptLoad = async () => {
        try {
          // Load all analyses from Supabase
          const analyses = await loadAllAnalysesFromSupabase();
          
          if (isMounted.current) {
            if (analyses && analyses.length > 0) {
              console.log(`[useAIAnalysis] Successfully loaded ${analyses.length} analyses from Supabase`);
              setIsRetrying(false);
              retryRef.current = false;
            } else if (retryCount < maxRetries.current) {
              console.log(`[useAIAnalysis] Retry ${retryCount + 1}/${maxRetries.current}: No analyses found, retrying...`);
              retryCount++;
              setTimeout(attemptLoad, Math.pow(2, retryCount) * 1000); // Exponential backoff
            } else {
              console.log("[useAIAnalysis] Max retries reached, no analyses found");
              setIsRetrying(false);
              retryRef.current = false;
            }
          }
        } catch (error) {
          if (isMounted.current) {
            console.error("[useAIAnalysis] Error loading analyses:", error);
            if (retryCount < maxRetries.current) {
              console.log(`[useAIAnalysis] Retry ${retryCount + 1}/${maxRetries.current} due to error`);
              retryCount++;
              setTimeout(attemptLoad, Math.pow(2, retryCount) * 1000); // Exponential backoff
            } else {
              console.log("[useAIAnalysis] Max retries reached after errors");
              setIsRetrying(false);
              retryRef.current = false;
            }
          }
        }
      };
      
      // Start the retry process
      attemptLoad();
    }
  }, [analysisHistory.length, isLoading, loadAllAnalysesFromSupabase, isRetrying]);

  // Add the forceFetchAllAnalyses method 
  const forceFetchAllAnalyses = useCallback(async (): Promise<PersonalityAnalysis[]> => {
    try {
      console.log("[useAIAnalysis] Force fetching all analyses");
      toast.loading("Fetching all analyses...", { id: "force-fetch" });
      
      // Try direct approach - get all analyses at once
      let allAnalyses = await fetchAnalysesFromSupabase(true);
      
      if (allAnalyses && allAnalyses.length > 0) {
        console.log(`[useAIAnalysis] Direct fetch successful, found ${allAnalyses.length} analyses`);
        toast.success(`Found ${allAnalyses.length} analyses`, { id: "force-fetch" });
        return allAnalyses;
      }
      
      // If direct fetch failed, try fetch with pagination
      console.log("[useAIAnalysis] Direct fetch failed, trying fetch with pagination");
      allAnalyses = await loadAllAnalysesFromSupabase();
      
      if (allAnalyses && allAnalyses.length > 0) {
        console.log(`[useAIAnalysis] Second load retrieved ${allAnalyses.length} analyses`);
        toast.success(`Found ${allAnalyses.length} analyses through pagination`, { id: "force-fetch" });
        return allAnalyses;
      }
      
      // If that fails, try the forceAnalysisRefresh method as final fallback
      console.log("[useAIAnalysis] Paginated fetch failed, trying forceAnalysisRefresh");
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
  }, [fetchAnalysesFromSupabase, loadAllAnalysesFromSupabase, forceAnalysisRefresh]);

  // Enhanced direct fetch with better error handling
  const enhancedFetchById = useCallback(async (id: string): Promise<PersonalityAnalysis | null> => {
    try {
      // First try our main fetch method
      const result = await fetchAnalysisById(id);
      if (result) return result;
      
      // If that fails, try a direct database query with a timeout
      console.log(`Direct Supabase query for analysis ID: ${id}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .abortSignal(controller.signal)
        .maybeSingle();
      
      clearTimeout(timeoutId);
      
      if (error) throw error;
      if (!data) return null;
      
      // Use the getAnalysisById as a last resort
      if (!result) {
        return await getAnalysisById(id);
      }
      
      return result;
    } catch (error) {
      console.error(`Error in enhancedFetchById for ID ${id}:`, error);
      return null;
    }
  }, [fetchAnalysisById, getAnalysisById]);

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
    fetchAnalysisById: enhancedFetchById,
    getAnalysisById,
    isLoadingAnalysisById,
    fetchError,
    forceAnalysisRefresh,
    forceFetchAllAnalyses,
    analysisHistory
  };
};
