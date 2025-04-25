
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
    getAnalysisById,
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
  
  // Initial data load when component mounts - only runs once
  useEffect(() => {
    async function initialLoad() {
      console.log("Initial load started for reportId:", reportId || 'none');
      setIsLoadingAllAnalyses(true);
      
      try {
        // Try to load all analyses first for complete history
        await loadAllAnalysesFromSupabase();
        
        // If we have an ID but no data, try to load directly
        if (reportId) {
          console.log(`Checking for specific report ID: ${reportId}`);
          const directAnalysis = await fetchAnalysisById(reportId);
          
          if (directAnalysis) {
            console.log("Direct fetch successful:", directAnalysis.id);
            setDirectlyFetchedAnalysis(directAnalysis);
            return;
          } 
          
          // If not found via standard methods, try the edge function directly
          console.log("Standard fetch failed, trying edge function directly");
          const publicAnalysis = await getAnalysisById(reportId);
          
          if (publicAnalysis) {
            console.log("Edge function fetch successful:", publicAnalysis.id);
            setDirectlyFetchedAnalysis(publicAnalysis);
          }
        }
      } catch (error) {
        console.error("Error in initial load:", error);
        setErrorMessage("Could not load analyses. Please try again later.");
      } finally {
        setIsLoadingAllAnalyses(false);
      }
    }
    
    initialLoad();
  }, []); // Empty dependency array - this only runs once on mount

  // When reportId changes, update the analysis
  useEffect(() => {
    if (reportId && !isLoading && !isLoadingAllAnalyses) {
      console.log(`Report ID changed to: ${reportId}`);
      setCurrentAnalysis(reportId);
    }
  }, [reportId, isLoading, isLoadingAllAnalyses, setCurrentAnalysis]);

  // Handle the case when we're on the base /report route with no ID - select first analysis
  useEffect(() => {
    if (!reportId && !isLoading && !isLoadingAllAnalyses && 
        currentHistory.length > 0 && !stableAnalysis && !directlyFetchedAnalysis) {
      console.log("No reportId provided but history available, setting first analysis:", 
                  currentHistory[0].id);
      
      // Just set the current analysis - navigation will happen in ReportPage
      setCurrentAnalysis(currentHistory[0].id);
    }
  }, [reportId, isLoading, isLoadingAllAnalyses, currentHistory, 
      stableAnalysis, directlyFetchedAnalysis, setCurrentAnalysis]);

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
    setErrorMessage(null);
    
    try {
      // Try to set the current analysis
      const foundAnalysis = setCurrentAnalysis(analysisId);
      
      if (foundAnalysis) {
        console.log("Found analysis in current history:", analysisId);
        navigate(`/report/${analysisId}`);
        return;
      }
      
      // Try direct fetch if standard method fails
      const directAnalysis = await fetchAnalysisById(analysisId);
      
      if (directAnalysis) {
        console.log("Direct fetch successful:", directAnalysis.id);
        setDirectlyFetchedAnalysis(directAnalysis);
        navigate(`/report/${analysisId}`);
        return;
      }
      
      // Try the edge function directly as last resort
      const publicAnalysis = await getAnalysisById(analysisId);
      
      if (publicAnalysis) {
        console.log("Edge function fetch successful:", publicAnalysis.id);
        setDirectlyFetchedAnalysis(publicAnalysis);
        navigate(`/report/${analysisId}`);
        return;
      }
      
      // Last resort: try to force fetch all analyses
      console.log("All direct fetch methods failed, trying force fetch");
      await forceFetchAllAnalyses();
      
      // Try one more time with the refreshed data
      const secondAttempt = setCurrentAnalysis(analysisId);
      
      if (secondAttempt) {
        console.log("Found analysis after force fetch");
        navigate(`/report/${analysisId}`);
      } else {
        console.error("Could not find analysis after all attempts");
        toast.error("Could not load the selected analysis");
        setErrorMessage(`Could not find analysis with ID: ${analysisId}`);
      }
    } catch (error) {
      console.error("Error changing analysis:", error);
      toast.error("Failed to change analysis");
      setErrorMessage("Failed to change analysis. Please try again.");
    } finally {
      setIsChangingAnalysis(false);
    }
  }, [reportId, setCurrentAnalysis, fetchAnalysisById, forceFetchAllAnalyses, navigate, getAnalysisById]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async (): Promise<void> => {
    console.log("Manual refresh initiated");
    toast.loading("Refreshing analyses...", { id: "refresh-toast" });
    setErrorMessage(null);
    
    try {
      const analyses = await forceFetchAllAnalyses();
      
      if (analyses && analyses.length > 0) {
        console.log(`Successfully refreshed ${analyses.length} analyses`);
        toast.success(`Successfully loaded ${analyses.length} analyses`, { id: "refresh-toast" });
        
        // If we have a reportId but no analysis, try to find it in the refreshed data
        if (reportId) {
          const found = setCurrentAnalysis(reportId);
          
          if (!found) {
            console.log("Current analysis not found in refreshed data, trying direct fetch");
            
            // Try both standard and edge function methods
            const directAnalysis = await fetchAnalysisById(reportId);
            
            if (directAnalysis) {
              setDirectlyFetchedAnalysis(directAnalysis);
              return;
            }
            
            const publicAnalysis = await getAnalysisById(reportId);
            
            if (publicAnalysis) {
              setDirectlyFetchedAnalysis(publicAnalysis);
              return;
            }
          }
        } 
        // If we're on the base route and have analyses, use the first one
        else if (analyses.length > 0) {
          console.log("No reportId, using first available analysis:", analyses[0].id);
          setCurrentAnalysis(analyses[0].id);
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
  }, [reportId, forceFetchAllAnalyses, fetchAnalysisById, setCurrentAnalysis, navigate, getAnalysisById]);

  // Determine the current displayable analysis
  const displayAnalysis = directlyFetchedAnalysis || stableAnalysis || analysis;
  
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
