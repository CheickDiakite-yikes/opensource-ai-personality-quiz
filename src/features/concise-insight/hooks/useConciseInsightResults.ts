import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  isUUID, 
  fetchAnalysisByDirectId, 
  fetchAnalysisByAssessmentId,
  generateNewAnalysis,
  saveAnalysisToDatabase
} from "../utils/analysisHelpers";
import { useAnalysisState } from "./useAnalysisState";

export const useConciseInsightResults = (analysisId?: string) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    analysis, 
    setAnalysis, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useAnalysisState();
  
  const fetchAnalysis = useCallback(async (signal?: AbortSignal) => {
    if (!analysisId || !user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useConciseInsightResults] Fetching analysis for ID: ${analysisId}`);
      let result;

      // Check if it's a UUID (direct analysis ID)
      if (isUUID(analysisId)) {
        try {
          result = await fetchAnalysisByDirectId(analysisId);
          if (!signal?.aborted) {
            setAnalysis(result);
          }
          return;
        } catch (err) {
          if (signal?.aborted) return;
          console.error("[useConciseInsightResults] Error fetching by direct ID:", err);
          throw err;
        }
      }

      // If not a UUID, treat as assessment ID
      result = await fetchAnalysisByAssessmentId(analysisId, user.id);
      
      // If not found by assessment ID, generate new analysis
      if (!result && !signal?.aborted) {
        console.log(`[useConciseInsightResults] Generating new analysis for assessment: ${analysisId}`);
        result = await generateNewAnalysis(analysisId, user.id);
        
        // Save the newly generated analysis
        try {
          await saveAnalysisToDatabase(result, analysisId, user.id);
        } catch (err: any) {
          if (err.message?.includes('unique_user_assessment_analysis')) {
            result = await fetchAnalysisByAssessmentId(analysisId, user.id);
          } else {
            throw err;
          }
        }
      }

      if (!signal?.aborted) {
        setAnalysis(result);
      }
      
    } catch (err: any) {
      if (!signal?.aborted) {
        console.error("[useConciseInsightResults] Error in fetchAnalysis:", err);
        setError(err.message || "An error occurred while fetching analysis");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [analysisId, user, setAnalysis, setError, setLoading]);

  // Add the refreshAnalysis function to manually trigger a re-fetch
  const refreshAnalysis = useCallback(() => {
    console.log("[useConciseInsightResults] Manually refreshing analysis");
    fetchAnalysis();
  }, [fetchAnalysis]);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    if (analysisId) {
      fetchAnalysis(abortController.signal);
    } else {
      setLoading(false);
    }
    
    return () => {
      abortController.abort();
    };
  }, [analysisId, fetchAnalysis, setLoading]);
  
  return { 
    analysis, 
    loading, 
    error, 
    refreshAnalysis
  };
};
