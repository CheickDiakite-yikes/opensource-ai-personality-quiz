
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { useAnalysisById } from './aiAnalysis/useAnalysisById';
import { PersonalityAnalysis } from '@/utils/types';
import { useState, useEffect } from 'react';

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
  
  // Track last total count for debugging
  const [lastHistoryCount, setLastHistoryCount] = useState<number>(0);
  
  // Log changes to analysis history for debugging
  useEffect(() => {
    const currentCount = analysisHistory?.length || 0;
    if (currentCount !== lastHistoryCount) {
      console.log(`Analysis history count changed: ${lastHistoryCount} -> ${currentCount}`);
      setLastHistoryCount(currentCount);
    }
  }, [analysisHistory, lastHistoryCount]);

  return {
    analysis,
    isLoading: isLoading || isLoadingAnalysisById,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    getAnalysisById,
    fetchAnalysesFromSupabase,
    loadAllAnalysesFromSupabase,
    fetchAnalysisById,
    fetchError,
    analysisHistory
  };
};
