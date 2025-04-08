
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { useAnalysisById } from './aiAnalysis/useAnalysisById';
import { PersonalityAnalysis } from '@/utils/types';
import { useState, useEffect } from 'react';
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

  // Add a function to manually force refresh from all sources
  const forceFetchAllAnalyses = async () => {
    toast.loading("Forcing complete analysis refresh...", { id: "force-refresh" });
    console.log("[useAIAnalysis] Starting force fetch of all analyses");
    
    try {
      // First try the direct refresh from useAnalysisRefresh
      const directAnalyses = await forceAnalysisRefresh();
      console.log(`[useAIAnalysis] Direct refresh found ${directAnalyses?.length || 0} analyses`);
      
      // Then try the loadAll method from useAIAnalysisCore
      const coreAnalyses = await loadAllAnalysesFromSupabase();
      console.log(`[useAIAnalysis] Core refresh found ${coreAnalyses?.length || 0} analyses`);
      
      // Determine if we succeeded
      const totalAnalyses = Math.max(
        directAnalyses?.length || 0,
        coreAnalyses?.length || 0,
        analysisHistory?.length || 0
      );
      
      if (totalAnalyses > 0) {
        toast.success(`Found ${totalAnalyses} analyses`, { 
          id: "force-refresh",
          description: "Your reports are now available"
        });
      } else {
        toast.error("Could not find any analyses", { 
          id: "force-refresh",
          description: "Please check your connection and try again"
        });
      }
      
      return directAnalyses || coreAnalyses;
    } catch (error) {
      console.error("[useAIAnalysis] Error in forceFetchAllAnalyses:", error);
      toast.error("Error refreshing analyses", { id: "force-refresh" });
      return null;
    }
  };

  // Fix for the analysis generation process
  const enhancedAnalyzeResponses = async (responses: any) => {
    console.log("[useAIAnalysis] Starting enhanced analysis with responses:", responses.length);
    try {
      // First try the standard analysis method
      const result = await analyzeResponses(responses);
      console.log("[useAIAnalysis] Analysis completed successfully:", result?.id);
      return result;
    } catch (error) {
      console.error("[useAIAnalysis] Error in first analysis attempt:", error);
      
      // If the first attempt failed, wait and try again
      toast.loading("First analysis attempt failed, retrying...", { id: "retry-analysis" });
      
      try {
        // Wait 3 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 3000));
        const secondAttempt = await analyzeResponses(responses);
        console.log("[useAIAnalysis] Second analysis attempt succeeded:", secondAttempt?.id);
        toast.success("Analysis completed on retry", { id: "retry-analysis" });
        return secondAttempt;
      } catch (secondError) {
        console.error("[useAIAnalysis] Second analysis attempt also failed:", secondError);
        toast.error("Analysis failed after multiple attempts", { id: "retry-analysis" });
        throw secondError;
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
    forceFetchAllAnalyses
  };
};
