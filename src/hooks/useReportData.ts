
import { useState, useCallback, useEffect } from 'react';
import { PersonalityAnalysis } from '@/utils/types';
import { useAIAnalysis } from './useAIAnalysis';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useReportData(reportId?: string) {
  const {
    analysis,
    isLoading,
    analysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    getAnalysisHistory,
    fetchAnalysisById,
    loadAllAnalysesFromSupabase,
    forceFetchAllAnalyses,
  } = useAIAnalysis();
  
  const navigate = useNavigate();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [directlyFetchedAnalysis, setDirectlyFetchedAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [isChangingAnalysis, setIsChangingAnalysis] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isLoadingAllAnalyses, setIsLoadingAllAnalyses] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get a stable copy of the analysis history
  const currentHistory = getAnalysisHistory();
  
  // Initial data load when component mounts
  useEffect(() => {
    async function initialLoad() {
      setIsLoadingAllAnalyses(true);
      try {
        // Try to load all analyses first for complete history
        await loadAllAnalysesFromSupabase();
        
        // If we have an ID but no data, try to load directly
        if (reportId && !analysis && !stableAnalysis) {
          console.log(`Trying direct fetch for report ID: ${reportId}`);
          const directAnalysis = await fetchAnalysisById(reportId);
          if (directAnalysis) {
            setDirectlyFetchedAnalysis(directAnalysis);
          }
        }
      } catch (error) {
        console.error("Error in initial load:", error);
      } finally {
        setIsLoadingAllAnalyses(false);
      }
    }
    
    initialLoad();
  }, [reportId]); // Depend only on reportId to avoid unnecessary reruns

  // Handle setting the analysis when data changes
  useEffect(() => {
    const currentAnalysis = directlyFetchedAnalysis || stableAnalysis || analysis;
    
    // If we have an ID but no analysis, try to set it
    if (reportId && !currentAnalysis && !isLoading && !isChangingAnalysis) {
      // Use setCurrentAnalysis to find the analysis by ID
      const found = setCurrentAnalysis(reportId);
      if (!found && loadAttempts < 2) {
        // If not found and we haven't tried too many times, try a force fetch
        setLoadAttempts(prev => prev + 1);
        
        // Try to fetch this specific analysis again
        fetchAnalysisById(reportId).then(directAnalysis => {
          if (directAnalysis) {
            setDirectlyFetchedAnalysis(directAnalysis);
          } else if (loadAttempts >= 1) {
            // If we've tried multiple times and still can't find it
            setErrorMessage(`Could not find analysis with ID: ${reportId}`);
          }
        });
      }
    }
  }, [reportId, analysis, stableAnalysis, directlyFetchedAnalysis, isLoading, loadAttempts, isChangingAnalysis]);
  
  // Update stable analysis when the main analysis changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
      setIsChangingAnalysis(false);
    }
  }, [analysis, stableAnalysis]);
  
  // Handle first analysis load or redirect
  useEffect(() => {
    // If we have analyses but no specific ID was provided, use the most recent one
    if (!reportId && currentHistory && currentHistory.length > 0 && !isChangingAnalysis) {
      navigate(`/report/${currentHistory[0].id}`, { replace: true });
    } 
    // If we have no analyses and we've tried loading, go to assessment
    else if (!reportId && !isLoading && !isLoadingAllAnalyses && 
             currentHistory.length === 0 && loadAttempts > 0) {
      toast.error("No analysis reports found", {
        description: "Please complete the assessment first to view your report"
      });
      navigate("/assessment", { replace: true });
    }
  }, [reportId, currentHistory, isLoading, isLoadingAllAnalyses, loadAttempts, isChangingAnalysis]);

  // Handle changing between analyses
  const handleAnalysisChange = useCallback(async (analysisId: string) => {
    if (analysisId === reportId) return;
    
    setIsChangingAnalysis(true);
    
    try {
      // Try to set the current analysis using the standard method
      const foundAnalysis = setCurrentAnalysis(analysisId);
      
      if (foundAnalysis !== null) {
        navigate(`/report/${analysisId}`, { replace: false });
        return;
      }
      
      // Try direct fetch if standard method fails
      const directAnalysis = await fetchAnalysisById(analysisId);
      
      if (directAnalysis) {
        setDirectlyFetchedAnalysis(directAnalysis);
        navigate(`/report/${analysisId}`, { replace: false });
      } else {
        // Last resort: try to force fetch all analyses
        await forceFetchAllAnalyses();
        
        // Try one more time with the refreshed data
        const secondAttempt = setCurrentAnalysis(analysisId);
        
        if (secondAttempt !== null) {
          navigate(`/report/${analysisId}`, { replace: false });
        } else {
          toast.error("Could not load the selected analysis");
        }
      }
    } catch (error) {
      console.error("Error changing analysis:", error);
      toast.error("Failed to change analysis");
    } finally {
      setIsChangingAnalysis(false);
    }
  }, [reportId, setCurrentAnalysis, fetchAnalysisById, forceFetchAllAnalyses]);

  // Manual refresh function - Modified to return Promise<void> instead of Promise<boolean>
  const handleManualRefresh = useCallback(async (): Promise<void> => {
    toast.loading("Refreshing your analyses...", { id: "refresh-toast" });
    setErrorMessage(null);
    
    try {
      const analyses = await forceFetchAllAnalyses();
      
      if (analyses && analyses.length > 0) {
        toast.success(`Successfully loaded ${analyses.length} analyses`, { id: "refresh-toast" });
        
        // If we have a reportId but no analysis, try to find it in the refreshed data
        if (reportId && !stableAnalysis && !directlyFetchedAnalysis) {
          const found = setCurrentAnalysis(reportId);
          
          if (!found) {
            const directAnalysis = await fetchAnalysisById(reportId);
            if (directAnalysis) {
              setDirectlyFetchedAnalysis(directAnalysis);
            }
          }
        }
      } else {
        toast.error("No analyses found", { id: "refresh-toast" });
      }
    } catch (error) {
      console.error("Error manually refreshing analyses:", error);
      toast.error("Failed to refresh analyses", { id: "refresh-toast" });
    }
  }, [reportId, stableAnalysis, directlyFetchedAnalysis, forceFetchAllAnalyses, fetchAnalysisById, setCurrentAnalysis]);

  // Determine the current displayable analysis
  const displayAnalysis = directlyFetchedAnalysis || stableAnalysis || analysis;
  
  // Return all the data and functions
  return {
    analysis: displayAnalysis,
    analysisHistory: currentHistory,
    isLoading: isLoading || isLoadingAllAnalyses || isChangingAnalysis,
    errorMessage,
    onAnalysisChange: handleAnalysisChange,
    onManualRefresh: handleManualRefresh,
    retryLoading: () => {
      setLoadAttempts(0);
      setErrorMessage(null);
      return handleManualRefresh();
    }
  };
}
