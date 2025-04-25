
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!isLoadingAllAnalyses && !forcedRefresh) {
      setIsLoadingAllAnalyses(true);
      loadAllAnalysesFromSupabase()
        .then(analyses => {
          console.log(`Loaded ${analyses.length} analyses on initial mount`);
        })
        .catch(error => {
          console.error("Error loading all analyses on mount:", error);
        })
        .finally(() => {
          setForcedRefresh(true);
          setIsLoadingAllAnalyses(false);
        });
    }
  }, [loadAllAnalysesFromSupabase, forcedRefresh, isLoadingAllAnalyses]);

  // Load analysis data
  useEffect(() => {
    if ((isLoading && !isChangingAnalysis) || stableAnalysis || directlyFetchedAnalysis) return;

    const loadAnalysis = async () => {
      try {
        if (!forcedRefresh) {
          await refreshAnalysis();
          setForcedRefresh(true);
        }

        if (id) {
          const foundAnalysis = await setCurrentAnalysis(id);
          
          if (foundAnalysis) {
            setStableAnalysis(foundAnalysis);
            return;
          }

          const directAnalysis = await getAnalysisById(id);
          if (directAnalysis) {
            setStableAnalysis(directAnalysis);
            return;
          }

          const supabaseDirectFetch = await fetchAnalysisById(id);
          if (supabaseDirectFetch) {
            setDirectlyFetchedAnalysis(supabaseDirectFetch);
            return;
          }

          if (!analysis && !stableAnalysis && !directlyFetchedAnalysis && !hasAttemptedToLoadAnalysis) {
            setHasAttemptedToLoadAnalysis(true);
            
            const allAnalyses = await loadAllAnalysesFromSupabase();
            
            if (allAnalyses && allAnalyses.length > 0) {
              console.log(`Loaded ${allAnalyses.length} analyses, trying to find ${id} again`);
              const secondAttemptResult = await setCurrentAnalysis(id);
              
              if (secondAttemptResult) {
                setStableAnalysis(secondAttemptResult);
                return;
              }
              
              navigate(`/report/${allAnalyses[0].id}`, { replace: true });
            } else {
              toast.error("Could not find the requested analysis", {
                description: "Please try taking the assessment again or log in to access your saved analyses",
                duration: 5000
              });
              
              navigate("/assessment", { replace: true });
            }
          }
        } else if (analysisHistory && analysisHistory.length > 0) {
          navigate(`/report/${analysisHistory[0].id}`, { replace: true });
        } else if (!hasAttemptedToLoadAnalysis) {
          const allAnalyses = await loadAllAnalysesFromSupabase();
          
          if (allAnalyses && allAnalyses.length > 0) {
            navigate(`/report/${allAnalyses[0].id}`, { replace: true });
            return;
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
        } else {
          toast.error("Failed to load analysis after multiple attempts", {
            description: "Please try refreshing the page",
            duration: 5000
          });
        }
      }
    };
    
    loadAnalysis();
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis, stableAnalysis, analysisHistory, hasAttemptedToLoadAnalysis, forcedRefresh, refreshAnalysis, getAnalysisById, isChangingAnalysis, loadAttempts, loadAllAnalysesFromSupabase, directlyFetchedAnalysis, fetchAnalysisById]);

  // Update stable analysis when current analysis changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
      setIsChangingAnalysis(false);
      
      if (id !== analysis.id) {
        navigate(`/report/${analysis.id}`, { replace: true });
      }
    }
  }, [analysis, stableAnalysis, navigate, id]);

  return {
    analysis: directlyFetchedAnalysis || stableAnalysis || analysis,
    isLoading,
    isChangingAnalysis,
    hasAttemptedToLoadAnalysis,
    analysisHistory,
    loadAttempts
  };
}
