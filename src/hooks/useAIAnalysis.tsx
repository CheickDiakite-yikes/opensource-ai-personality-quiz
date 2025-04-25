
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { useAnalysisById } from './aiAnalysis/useAnalysisById';
import { PersonalityAnalysis } from '@/utils/types';
import { useState, useEffect, useRef } from 'react';
import { useAnalysisRefresh } from './useAnalysisRefresh';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track last total count for debugging
  const [lastHistoryCount, setLastHistoryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryRef = useRef<boolean>(false); // Use ref to avoid stale closures
  const maxRetries = useRef<number>(3); // Maximum number of retries
  
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

  // Fix for navigating to /report without ID
  useEffect(() => {
    if (location.pathname === '/report' && !isLoading && analysisHistory && analysisHistory.length > 0) {
      console.log("[useAIAnalysis] On /report route without ID, redirecting to first analysis");
      navigate(`/report/${analysisHistory[0].id}`, { replace: true });
    } else if (location.pathname === '/report' && !isLoading && analysisHistory && analysisHistory.length === 0) {
      // If there are no analyses but we're on /report, load them
      if (!isRetrying) {
        console.log("[useAIAnalysis] On /report route without analyses, attempting to load analyses");
        setIsRetrying(true);
        loadAllAnalysesFromSupabase().then(analyses => {
          if (analyses && analyses.length > 0) {
            navigate(`/report/${analyses[0].id}`, { replace: true });
          } else {
            // No analyses found, redirect to assessment
            toast.info("No analysis reports found", {
              description: "Please complete the assessment first to view your report"
            });
            navigate("/assessment", { replace: true });
          }
          setIsRetrying(false);
        }).catch(error => {
          console.error("[useAIAnalysis] Error loading analyses for redirect:", error);
          setIsRetrying(false);
        });
      }
    }
  }, [location.pathname, isLoading, analysisHistory, navigate, isRetrying, loadAllAnalysesFromSupabase]);

  // Track when this hook is mounted/unmounted to prevent stale state
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle initial loading and periodic refreshes
  useEffect(() => {
    // Only load if the component is still mounted
    if (isMounted.current && !isRetrying) {
      console.log("[useAIAnalysis] Initial load or forced refresh triggered");
      
      // Avoid unnecessary loading if we already have data
      if (!analysis && !isLoading && analysisHistory.length === 0) {
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
    }
  }, [analysis, isLoading, loadAllAnalysesFromSupabase, analysisHistory.length, isRetrying]);

  // Add the forceFetchAllAnalyses method
  const forceFetchAllAnalyses = async (): Promise<PersonalityAnalysis[]> => {
    try {
      console.log("[useAIAnalysis] Force fetching all analyses");
      toast.loading("Fetching all analyses...", { id: "force-fetch" });
      
      // Try to get analyses from Supabase with direct fetch
      let allAnalyses = await fetchAnalysesFromSupabase(true);
      
      if (allAnalyses && allAnalyses.length > 0) {
        console.log(`[useAIAnalysis] Direct fetch successful, found ${allAnalyses.length} analyses`);
        toast.success(`Found ${allAnalyses.length} analyses`, { id: "force-fetch" });
        console.log(`[useAIAnalysis] Analysis IDs: ${allAnalyses.map(a => a.id).join(', ')}`);
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
  };

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
    fetchAnalysisById,
    getAnalysisById,
    isLoadingAnalysisById,
    fetchError,
    forceAnalysisRefresh,
    forceFetchAllAnalyses
  };
};
