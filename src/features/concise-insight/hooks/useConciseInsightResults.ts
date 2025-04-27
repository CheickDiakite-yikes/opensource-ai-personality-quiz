
import { useEffect, useCallback, useState } from "react";
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
import { toast } from "sonner";

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
  
  const [retryAttempt, setRetryAttempt] = useState(0);
  const MAX_RETRIES = 3;
  
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
        
        try {
          // Add a timeout promise to handle edge function timeouts
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Analysis generation timed out")), 60000); // 60-second timeout
          });
          
          // Race between the actual operation and the timeout
          result = await Promise.race([
            generateNewAnalysis(analysisId, user.id),
            timeoutPromise
          ]);
          
          // Save the newly generated analysis
          try {
            await saveAnalysisToDatabase(result, analysisId, user.id);
          } catch (err: any) {
            if (err.message?.includes('unique_user_assessment_analysis')) {
              // Race condition - another process saved it first, fetch it
              result = await fetchAnalysisByAssessmentId(analysisId, user.id);
              toast.info("Using existing analysis");
            } else {
              throw err;
            }
          }
        } catch (genErr: any) {
          console.error("[useConciseInsightResults] Error generating analysis:", genErr);
          
          // Check if we should retry
          if (retryAttempt < MAX_RETRIES) {
            setRetryAttempt(prev => prev + 1);
            
            // Exponential backoff delay
            const backoffDelay = Math.pow(2, retryAttempt) * 1000;
            console.log(`[useConciseInsightResults] Retrying in ${backoffDelay/1000} seconds (attempt ${retryAttempt + 1}/${MAX_RETRIES})`);
            
            toast.loading(`Edge function error, retrying in ${backoffDelay/1000} seconds...`, {
              duration: backoffDelay + 1000
            });
            
            // Wait for backoff period then try again
            setTimeout(() => {
              if (!signal?.aborted) {
                fetchAnalysis(signal);
              }
            }, backoffDelay);
            
            // Don't continue with error handling
            return;
          } else {
            // Max retries reached, throw error to be handled below
            throw genErr;
          }
        }
      }

      if (!signal?.aborted) {
        setAnalysis(result);
        // Reset retry count on success
        setRetryAttempt(0);
      }
      
    } catch (err: any) {
      if (!signal?.aborted) {
        console.error("[useConciseInsightResults] Error in fetchAnalysis:", err);
        
        // Provide more detailed error messages based on the error type
        let errorMessage;
        
        if (err.message?.includes('timeout') || err.message?.includes('timed out')) {
          errorMessage = "The analysis is taking longer than expected. Please try again.";
        } else if (err.message?.includes('FunctionsHttpError')) {
          errorMessage = "There was an error with the edge function. Please try again in a few moments.";
        } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = err.message || "An error occurred while fetching analysis";
        }
        
        setError(errorMessage);
        
        // Show toast notification for the error
        toast.error("Analysis Error", {
          description: errorMessage
        });
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [analysisId, user, setAnalysis, setError, setLoading, retryAttempt]);

  // Add the refreshAnalysis function to manually trigger a re-fetch
  const refreshAnalysis = useCallback(() => {
    setRetryAttempt(0); // Reset retry count when manually refreshing
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
    refreshAnalysis,
    retryAttempt,
    maxRetries: MAX_RETRIES
  };
};
