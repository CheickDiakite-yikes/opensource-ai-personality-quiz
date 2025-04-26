
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
import { useAnalysisSave } from "./useAnalysisSave";

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
  const { saveAnalysis } = useAnalysisSave(analysisId);
  
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

      // Try to fetch by direct UUID first
      if (isUUID(analysisId)) {
        try {
          result = await fetchAnalysisByDirectId(analysisId);
        } catch (err) {
          if (signal?.aborted) return;
          console.log("[useConciseInsightResults] Not found by direct ID, trying assessment ID");
        }
      }

      // If not found by UUID, try assessment ID
      if (!result && !signal?.aborted) {
        result = await fetchAnalysisByAssessmentId(analysisId, user.id);
      }

      // If still not found, generate new analysis
      if (!result && !signal?.aborted) {
        console.log(`[useConciseInsightResults] Generating new analysis for assessment: ${analysisId}`);
        result = await generateNewAnalysis(analysisId, user.id);
        
        // Save the newly generated analysis
        try {
          await saveAnalysisToDatabase(result, analysisId, user.id);
        } catch (err: any) {
          // If we get a unique constraint violation, it means another request already created the analysis
          // In this case, try to fetch it one last time
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
    refreshAnalysis, // Include the refresh function in the return object
    saveAnalysis: async () => {
      if (user && analysis) {
        await saveAnalysis(analysis, user.id);
      }
    }
  };
};
