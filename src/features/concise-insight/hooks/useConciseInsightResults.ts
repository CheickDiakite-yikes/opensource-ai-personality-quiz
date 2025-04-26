
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
  
  const fetchAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!analysisId) {
        setError("No analysis ID provided");
        setLoading(false);
        return;
      }
      
      if (!user) {
        setError("You must be signed in to view results");
        navigate("/auth");
        return;
      }
      
      console.log(`[useConciseInsightResults] Fetching analysis for ID: ${analysisId}`);
      let result;

      // Try to fetch by direct UUID first
      if (isUUID(analysisId)) {
        try {
          result = await fetchAnalysisByDirectId(analysisId);
        } catch (err) {
          console.log("[useConciseInsightResults] Not found by direct ID, trying assessment ID");
        }
      }

      // If not found by UUID, try assessment ID
      if (!result) {
        result = await fetchAnalysisByAssessmentId(analysisId, user.id);
      }

      // If still not found, generate new analysis
      if (!result) {
        console.log(`[useConciseInsightResults] Generating new analysis for assessment: ${analysisId}`);
        result = await generateNewAnalysis(analysisId, user.id);
        
        // Save the newly generated analysis
        await saveAnalysisToDatabase(result, analysisId, user.id);
      }

      setAnalysis(result);
      
    } catch (err: any) {
      console.error("[useConciseInsightResults] Error in fetchAnalysis:", err);
      setError(err.message || "An error occurred while fetching analysis");
    } finally {
      setLoading(false);
    }
  }, [analysisId, navigate, user, setAnalysis, setError, setLoading]);
  
  // Add a refreshAnalysis function that re-fetches the analysis
  const refreshAnalysis = useCallback(() => {
    return fetchAnalysis();
  }, [fetchAnalysis]);
  
  useEffect(() => {
    if (analysisId) {
      fetchAnalysis();
    } else {
      setLoading(false);
    }
  }, [analysisId, fetchAnalysis, setLoading]);
  
  return { 
    analysis, 
    loading, 
    error, 
    saveAnalysis: async () => {
      if (user) {
        await saveAnalysis(analysis!, user.id);
      }
    },
    refreshAnalysis
  };
};
