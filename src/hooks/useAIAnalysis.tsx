
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { useAnalysisById } from './aiAnalysis/useAnalysisById';
import { PersonalityAnalysis } from '@/utils/types';
import { useState, useEffect, useRef } from 'react';
import { useAnalysisRefresh } from './useAnalysisRefresh';
import { toast } from 'sonner';

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
  
  // Track when this hook is mounted/unmounted to prevent stale state
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Add a function to manually force refresh from all sources
  const forceFetchAllAnalyses = async () => {
    const toastId = "force-refresh";
    toast.loading("Forcing complete analysis refresh...", { id: toastId });
    console.log("[useAIAnalysis] Starting force fetch of all analyses");
    
    try {
      // First try the direct refresh from useAnalysisRefresh
      const directAnalyses = await forceAnalysisRefresh().catch(err => {
        console.error("Error in forceAnalysisRefresh:", err);
        return null;
      });
      
      if (!isMounted.current) return null;
      
      // Then try the loadAll method from useAIAnalysisCore
      const coreAnalyses = await loadAllAnalysesFromSupabase().catch(err => {
        console.error("Error in loadAllAnalysesFromSupabase:", err);
        return null;
      });
      
      if (!isMounted.current) return null;
      
      // Determine if we succeeded
      const totalAnalyses = Math.max(
        directAnalyses?.length || 0,
        coreAnalyses?.length || 0,
        analysisHistory?.length || 0
      );
      
      if (totalAnalyses > 0) {
        toast.success(`Found ${totalAnalyses} analyses`, { 
          id: toastId,
          description: "Your reports are now available"
        });
      } else {
        toast.error("Could not find any analyses", { 
          id: toastId,
          description: "Please check your connection and try again"
        });
      }
      
      return directAnalyses || coreAnalyses;
    } catch (error) {
      console.error("[useAIAnalysis] Error in forceFetchAllAnalyses:", error);
      toast.error("Error refreshing analyses", { id: toastId });
      return null;
    }
  };

  // Enhanced analysis generation with retry mechanism
  const enhancedAnalyzeResponses = async (responses: any) => {
    console.log("[useAIAnalysis] Starting enhanced analysis with responses:", responses.length);
    
    // CRITICAL FIX: Use ref to prevent duplicate retries
    if (retryRef.current) {
      console.warn("[useAIAnalysis] Analysis is already being retried, skipping redundant retry");
      throw new Error("Analysis is already being retried");
    }
    
    try {
      // First try the standard analysis method
      const result = await analyzeResponses(responses);
      console.log("[useAIAnalysis] Analysis completed successfully:", result?.id);
      return result;
    } catch (error) {
      console.error("[useAIAnalysis] Error in first analysis attempt:", error);
      
      // Only retry if we aren't already doing so
      if (retryRef.current) {
        console.warn("[useAIAnalysis] Already retrying, not starting another retry");
        throw error;
      }
      
      // Mark that we're retrying to prevent multiple simultaneous retries
      setIsRetrying(true);
      retryRef.current = true;
      
      toast.loading("First analysis attempt failed, retrying once...", { id: "retry-analysis" });
      
      try {
        // Wait 3 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (!isMounted.current) {
          throw new Error("Component unmounted during retry");
        }
        
        const secondAttempt = await analyzeResponses(responses);
        console.log("[useAIAnalysis] Second analysis attempt succeeded:", secondAttempt?.id);
        toast.success("Analysis completed on retry", { id: "retry-analysis" });
        return secondAttempt;
      } catch (secondError) {
        console.error("[useAIAnalysis] Second analysis attempt also failed:", secondError);
        toast.error("Analysis failed after multiple attempts", { id: "retry-analysis" });
        throw secondError;
      } finally {
        if (isMounted.current) {
          setIsRetrying(false);
        }
        retryRef.current = false;
      }
    }
  };

  return {
    analysis,
    isLoading: isLoading || isLoadingAnalysisById,
    isAnalyzing,
    analyzeResponses: enhancedAnalyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    getAnalysisById,
    fetchAnalysesFromSupabase,
    loadAllAnalysesFromSupabase,
    fetchAnalysisById,
    fetchError,
    analysisHistory,
    forceFetchAllAnalyses,
    isRetrying
  };
};
