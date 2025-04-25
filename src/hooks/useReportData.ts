
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
  
  // Debug logging - add more visibility to state changes
  useEffect(() => {
    console.log("useReportData state:", {
      reportId,
      hasAnalysis: !!analysis,
      hasStableAnalysis: !!stableAnalysis,
      hasDirectAnalysis: !!directlyFetchedAnalysis,
      historyLength: currentHistory.length,
      isLoading,
      isLoadingAllAnalyses,
      isChangingAnalysis,
      loadAttempts,
      errorMessage
    });
  }, [
    reportId, analysis, stableAnalysis, directlyFetchedAnalysis, 
    currentHistory.length, isLoading, isLoadingAllAnalyses, 
    isChangingAnalysis, loadAttempts, errorMessage
  ]);
  
  // Initial data load when component mounts
  useEffect(() => {
    async function initialLoad() {
      setIsLoadingAllAnalyses(true);
      try {
        console.log("Initial load started for reportId:", reportId);
        // Try to load all analyses first for complete history
        await loadAllAnalysesFromSupabase();
        
        // If we have an ID but no data, try to load directly
        if (reportId && !analysis && !stableAnalysis) {
          console.log(`Trying direct fetch for report ID: ${reportId}`);
          const directAnalysis = await fetchAnalysisById(reportId);
          if (directAnalysis) {
            console.log("Direct fetch successful:", directAnalysis.id);
            setDirectlyFetchedAnalysis(directAnalysis);
          } else {
            console.log("Direct fetch failed to find analysis");
          }
        }
      } catch (error) {
        console.error("Error in initial load:", error);
        setErrorMessage("Error loading analyses. Please try refreshing.");
      } finally {
        setIsLoadingAllAnalyses(false);
      }
    }
    
    initialLoad();
  }, [reportId]); // Depend only on reportId to avoid unnecessary reruns

  // When on /report with no reportId parameter, we need to set the current analysis
  // to the first one in history if available
  useEffect(() => {
    if (!reportId && !isLoading && !isLoadingAllAnalyses && currentHistory.length > 0 && 
        !stableAnalysis && !directlyFetchedAnalysis) {
      console.log("No reportId but history available, setting current analysis to:", currentHistory[0].id);
      const found = setCurrentAnalysis(currentHistory[0].id);
      if (found) {
        console.log("Successfully set current analysis from history");
      }
    }
  }, [reportId, isLoading, isLoadingAllAnalyses, currentHistory, stableAnalysis, directlyFetchedAnalysis, setCurrentAnalysis]);

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
        console.log(`Analysis ${reportId} not found, attempt ${loadAttempts + 1} to fetch`);
        
        // Try to fetch this specific analysis again
        fetchAnalysisById(reportId).then(directAnalysis => {
          if (directAnalysis) {
            console.log("Successfully fetched analysis directly:", directAnalysis.id);
            setDirectlyFetchedAnalysis(directAnalysis);
          } else if (loadAttempts >= 1) {
            // If we've tried multiple times and still can't find it
            setErrorMessage(`Could not find analysis with ID: ${reportId}`);
          }
        });
      }
    }
  }, [reportId, analysis, stableAnalysis, directlyFetchedAnalysis, isLoading, loadAttempts, isChangingAnalysis, setCurrentAnalysis, fetchAnalysisById]);
  
  // Update stable analysis when the main analysis changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      console.log("Updating stable analysis:", analysis.id);
      setStableAnalysis(analysis);
      setIsChangingAnalysis(false);
    }
  }, [analysis, stableAnalysis]);
  
  // Handle changing between analyses
  const handleAnalysisChange = useCallback(async (analysisId: string) => {
    if (analysisId === reportId) return;
    
    console.log(`Changing analysis to: ${analysisId}`);
    setIsChangingAnalysis(true);
    
    try {
      // Try to set the current analysis using the standard method
      const foundAnalysis = setCurrentAnalysis(analysisId);
      
      if (foundAnalysis !== null) {
        console.log("Found analysis in current history:", analysisId);
        navigate(`/report/${analysisId}`, { replace: false });
        return;
      }
      
      console.log("Analysis not found in history, trying direct fetch");
      // Try direct fetch if standard method fails
      const directAnalysis = await fetchAnalysisById(analysisId);
      
      if (directAnalysis) {
        console.log("Direct fetch successful:", directAnalysis.id);
        setDirectlyFetchedAnalysis(directAnalysis);
        navigate(`/report/${analysisId}`, { replace: false });
      } else {
        console.log("Direct fetch failed, trying force fetch");
        // Last resort: try to force fetch all analyses
        await forceFetchAllAnalyses();
        
        // Try one more time with the refreshed data
        const secondAttempt = setCurrentAnalysis(analysisId);
        
        if (secondAttempt !== null) {
          console.log("Found analysis after force fetch");
          navigate(`/report/${analysisId}`, { replace: false });
        } else {
          console.error("Could not find analysis after all attempts");
          toast.error("Could not load the selected analysis");
        }
      }
    } catch (error) {
      console.error("Error changing analysis:", error);
      toast.error("Failed to change analysis");
    } finally {
      setIsChangingAnalysis(false);
    }
  }, [reportId, setCurrentAnalysis, fetchAnalysisById, forceFetchAllAnalyses, navigate]);

  // Manual refresh function - Returns Promise<void>
  const handleManualRefresh = useCallback(async (): Promise<void> => {
    console.log("Manual refresh initiated");
    toast.loading("Refreshing your analyses...", { id: "refresh-toast" });
    setErrorMessage(null);
    
    try {
      const analyses = await forceFetchAllAnalyses();
      
      if (analyses && analyses.length > 0) {
        console.log(`Successfully refreshed ${analyses.length} analyses`);
        toast.success(`Successfully loaded ${analyses.length} analyses`, { id: "refresh-toast" });
        
        // If we have a reportId but no analysis, try to find it in the refreshed data
        if (reportId && !stableAnalysis && !directlyFetchedAnalysis) {
          const found = setCurrentAnalysis(reportId);
          
          if (!found) {
            console.log("Current analysis not found in refreshed data, trying direct fetch");
            const directAnalysis = await fetchAnalysisById(reportId);
            if (directAnalysis) {
              setDirectlyFetchedAnalysis(directAnalysis);
            } else if (analyses.length > 0) {
              // If we couldn't find the requested analysis, but we have others, use the first one
              console.log("Using first available analysis instead:", analyses[0].id);
              navigate(`/report/${analyses[0].id}`, { replace: true });
            }
          }
        } else if (!reportId && analyses.length > 0) {
          // If we're on the base route and have analyses, navigate to the first one
          console.log("No reportId, navigating to first analysis:", analyses[0].id);
          navigate(`/report/${analyses[0].id}`, { replace: true });
        }
      } else {
        console.log("No analyses found during refresh");
        toast.error("No analyses found", { id: "refresh-toast" });
      }
    } catch (error) {
      console.error("Error manually refreshing analyses:", error);
      toast.error("Failed to refresh analyses", { id: "refresh-toast" });
    }
  }, [reportId, stableAnalysis, directlyFetchedAnalysis, forceFetchAllAnalyses, fetchAnalysisById, setCurrentAnalysis, navigate]);

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
