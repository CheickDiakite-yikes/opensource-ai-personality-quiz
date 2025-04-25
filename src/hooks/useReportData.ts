
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { PersonalityAnalysis } from '@/utils/types';

export function useReportData(id?: string) {
  const navigate = useNavigate();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [hasAttemptedToLoadAnalysis, setHasAttemptedToLoadAnalysis] = useState(false);
  const [forcedRefresh, setForcedRefresh] = useState(false);
  const [isChangingAnalysis, setIsChangingAnalysis] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isLoadingAllAnalyses, setIsLoadingAllAnalyses] = useState(false);
  const [directlyFetchedAnalysis, setDirectlyFetchedAnalysis] = useState<PersonalityAnalysis | null>(null);

  const { 
    analysis, 
    isLoading, 
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    getAnalysisById,
    loadAllAnalysesFromSupabase,
    fetchAnalysisById
  } = useAIAnalysis();

  const analysisHistory = getAnalysisHistory();

  // Force an initial load of all analyses when the component mounts
  const initialLoad = useCallback(async () => {
    if (!isLoadingAllAnalyses) {
      setIsLoadingAllAnalyses(true);
      try {
        const analyses = await loadAllAnalysesFromSupabase();
        console.log(`Loaded ${analyses?.length || 0} analyses on initial mount`);
        setForcedRefresh(true);
      } catch (error) {
        console.error("Error loading all analyses on mount:", error);
      } finally {
        setIsLoadingAllAnalyses(false);
      }
    }
  }, [loadAllAnalysesFromSupabase, isLoadingAllAnalyses]);

  // Call initialLoad on mount
  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  // Load analysis data when ID changes or after initial load
  useEffect(() => {
    if (isLoading && !isChangingAnalysis) return; // Skip if already loading
    if (stableAnalysis && stableAnalysis.id === id) return; // Skip if we already have the analysis
    if (directlyFetchedAnalysis && directlyFetchedAnalysis.id === id) return; // Skip if already directly fetched
    
    const loadAnalysis = async () => {
      try {
        if (!forcedRefresh) {
          await refreshAnalysis();
          setForcedRefresh(true);
        }

        // If ID is provided, try to load that specific analysis
        if (id) {
          // Try setting current analysis first (from state)
          let foundAnalysis = null;
          try {
            foundAnalysis = await setCurrentAnalysis(id);
          } catch (error) {
            console.error("Error setting current analysis:", error);
          }
          
          if (foundAnalysis) {
            setStableAnalysis(foundAnalysis);
            return;
          }

          // Try getting by ID next (from memory)
          try {
            const directAnalysis = await getAnalysisById(id);
            if (directAnalysis) {
              setStableAnalysis(directAnalysis);
              return;
            }
          } catch (error) {
            console.error("Error getting analysis by ID:", error);
          }

          // Try direct fetch from Supabase as last resort
          try {
            const supabaseDirectFetch = await fetchAnalysisById(id);
            if (supabaseDirectFetch) {
              setDirectlyFetchedAnalysis(supabaseDirectFetch);
              return;
            }
          } catch (error) {
            console.error("Error fetching analysis directly from Supabase:", error);
          }

          // If we still don't have an analysis, try one final reload of all analyses
          if (!hasAttemptedToLoadAnalysis) {
            setHasAttemptedToLoadAnalysis(true);
            
            try {
              const allAnalyses = await loadAllAnalysesFromSupabase();
              
              if (allAnalyses && allAnalyses.length > 0) {
                console.log(`Loaded ${allAnalyses.length} analyses, trying to find ${id} again`);
                
                // Try to find the requested ID in the newly loaded analyses
                const requestedAnalysis = allAnalyses.find(a => a.id === id);
                if (requestedAnalysis) {
                  setStableAnalysis(requestedAnalysis);
                  return;
                }
                
                // If not found, redirect to the first analysis
                navigate(`/report/${allAnalyses[0].id}`, { replace: true });
                return;
              }
            } catch (error) {
              console.error("Error in final reload attempt:", error);
            }
            
            // If we reach here, no analysis was found
            toast.error("Could not find the requested analysis", {
              description: "Please try taking the assessment again or log in to access your saved analyses",
              duration: 5000
            });
          }
        } 
        // If no ID provided but we have analysis history, redirect to the first one
        else if (analysisHistory && analysisHistory.length > 0) {
          navigate(`/report/${analysisHistory[0].id}`, { replace: true });
        } 
        // Last resort: try to load all analyses and pick the first one
        else if (!hasAttemptedToLoadAnalysis) {
          try {
            const allAnalyses = await loadAllAnalysesFromSupabase();
            
            if (allAnalyses && allAnalyses.length > 0) {
              navigate(`/report/${allAnalyses[0].id}`, { replace: true });
              return;
            }
          } catch (error) {
            console.error("Error in fallback loading:", error);
          }
          
          setHasAttemptedToLoadAnalysis(true);
          toast.error("No analysis reports found", {
            description: "Please complete the assessment first to view your report",
            duration: 5000
          });
          navigate("/assessment", { replace: true });
        }
      } catch (error) {
        console.error("Error in loadAnalysis:", error);
        if (loadAttempts < 2) {
          setLoadAttempts(prev => prev + 1);
          const delay = Math.pow(2, loadAttempts) * 1000;
          setTimeout(loadAnalysis, delay);
        }
      }
    };
    
    loadAnalysis();
  }, [
    id, 
    isLoading, 
    setCurrentAnalysis, 
    navigate, 
    analysis, 
    stableAnalysis, 
    analysisHistory, 
    hasAttemptedToLoadAnalysis, 
    forcedRefresh, 
    refreshAnalysis, 
    getAnalysisById, 
    isChangingAnalysis, 
    loadAttempts, 
    loadAllAnalysesFromSupabase, 
    directlyFetchedAnalysis,
    fetchAnalysisById
  ]);

  // Update stable analysis when current analysis changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
      setIsChangingAnalysis(false);
    }
  }, [analysis, stableAnalysis]);

  return {
    analysis: directlyFetchedAnalysis || stableAnalysis || analysis,
    isLoading: isLoading || isLoadingAllAnalyses,
    isChangingAnalysis,
    hasAttemptedToLoadAnalysis,
    analysisHistory,
    loadAttempts
  };
}
