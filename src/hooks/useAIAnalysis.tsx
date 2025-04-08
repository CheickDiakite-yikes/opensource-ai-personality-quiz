
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { useAnalysisById } from './aiAnalysis/useAnalysisById';
import { PersonalityAnalysis } from '@/utils/types';

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
