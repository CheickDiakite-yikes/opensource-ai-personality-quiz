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
import { ConciseAnalysisResult } from "../types";

// Helper function to normalize and validate traits data
const normalizeTraitsData = (analysis: ConciseAnalysisResult | null): ConciseAnalysisResult | null => {
  if (!analysis) return null;
  
  // Deep clone to avoid mutating the original
  const normalizedAnalysis = JSON.parse(JSON.stringify(analysis));
  
  // Validate and normalize traits array
  if (!normalizedAnalysis.traits || !Array.isArray(normalizedAnalysis.traits)) {
    console.warn("Traits data is missing or invalid", normalizedAnalysis);
    normalizedAnalysis.traits = [];
  }
  
  // Validate growth potential data
  if (!normalizedAnalysis.growthPotential) {
    console.warn("Growth potential data is missing, initializing with default structure");
    normalizedAnalysis.growthPotential = {
      areasOfDevelopment: [],
      personalizedRecommendations: [],
      keyStrengthsToLeverage: [],
      developmentTimeline: {
        shortTerm: "",
        mediumTerm: "",
        longTerm: ""
      }
    };
  } else {
    // Ensure all required growth potential fields exist
    if (!Array.isArray(normalizedAnalysis.growthPotential.areasOfDevelopment)) {
      normalizedAnalysis.growthPotential.areasOfDevelopment = [];
    }
    if (!Array.isArray(normalizedAnalysis.growthPotential.personalizedRecommendations)) {
      normalizedAnalysis.growthPotential.personalizedRecommendations = [];
    }
    if (!Array.isArray(normalizedAnalysis.growthPotential.keyStrengthsToLeverage)) {
      normalizedAnalysis.growthPotential.keyStrengthsToLeverage = [];
    }
    if (!normalizedAnalysis.growthPotential.developmentTimeline) {
      normalizedAnalysis.growthPotential.developmentTimeline = {
        shortTerm: "",
        mediumTerm: "",
        longTerm: ""
      };
    }
  }

  return normalizedAnalysis;
};

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
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  
  const fetchAnalysis = useCallback(async (signal?: AbortSignal) => {
    if (!analysisId || !user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setIsProcessingComplete(false);
      
      console.log(`[useConciseInsightResults] Fetching analysis for ID: ${analysisId}`);
      let result;

      // First try: Get existing analysis by direct ID or assessment ID
      if (isUUID(analysisId)) {
        try {
          console.log(`[useConciseInsightResults] Fetching by direct UUID: ${analysisId}`);
          result = await fetchAnalysisByDirectId(analysisId);
          
          if (!signal?.aborted) {
            const normalizedResult = normalizeTraitsData(result);
            setAnalysis(normalizedResult);
            setIsProcessingComplete(true);
            console.log("[useConciseInsightResults] Successfully loaded existing analysis:", normalizedResult);
          }
          return;
        } catch (err) {
          if (signal?.aborted) return;
          console.error("[useConciseInsightResults] Error fetching by direct ID:", err);
        }
      }

      // Second try: Get by assessment ID
      try {
        console.log(`[useConciseInsightResults] Fetching by assessment ID: ${analysisId}`);
        result = await fetchAnalysisByAssessmentId(analysisId, user.id);
        
        if (result) {
          const normalizedResult = normalizeTraitsData(result);
          setAnalysis(normalizedResult);
          setIsProcessingComplete(true);
          console.log("[useConciseInsightResults] Successfully loaded existing analysis by assessment ID");
          return;
        }
      } catch (err) {
        console.error("[useConciseInsightResults] Error fetching by assessment ID:", err);
      }
      
      // If no existing analysis found, generate new one
      if (!result && !signal?.aborted) {
        console.log(`[useConciseInsightResults] No existing analysis found, generating new for assessment: ${analysisId}`);
        
        try {
          const toastId = toast.loading("Generating your personality analysis...");
          
          result = await generateNewAnalysis(analysisId, user.id);
          
          toast.dismiss(toastId);
          
          try {
            await saveAnalysisToDatabase(result, analysisId, user.id);
            toast.success("Analysis generated successfully!");
          } catch (err: any) {
            console.error("[useConciseInsightResults] Error saving to database:", err);
            // If we get a duplicate error, try fetching the existing analysis
            if (err.code === '23505' || err.message?.includes('unique_user_assessment_analysis')) {
              result = await fetchAnalysisByAssessmentId(analysisId, user.id);
              if (result) {
                toast.info("Using existing analysis");
              }
            } else {
              throw err;
            }
          }
        } catch (genErr: any) {
          console.error("[useConciseInsightResults] Error generating analysis:", genErr);
          
          if (retryAttempt < MAX_RETRIES) {
            setRetryAttempt(prev => prev + 1);
            
            const backoffDelay = Math.pow(2, retryAttempt) * 1000;
            console.log(`[useConciseInsightResults] Retrying in ${backoffDelay/1000} seconds (attempt ${retryAttempt + 1}/${MAX_RETRIES})`);
            
            toast.loading(`Analysis in progress, retrying in ${backoffDelay/1000} seconds...`);
            
            setTimeout(() => {
              if (!signal?.aborted) {
                fetchAnalysis(signal);
              }
            }, backoffDelay);
            
            return;
          }
          
          throw genErr;
        }
      }

      if (!signal?.aborted) {
        const normalizedResult = normalizeTraitsData(result);
        setAnalysis(normalizedResult);
        setRetryAttempt(0);
        setIsProcessingComplete(true);
      }
      
    } catch (err: any) {
      if (!signal?.aborted) {
        console.error("[useConciseInsightResults] Error in fetchAnalysis:", err);
        
        let errorMessage;
        
        if (err.message?.includes('timeout') || err.message?.includes('timed out')) {
          errorMessage = "The analysis is taking longer than expected. Please try again.";
        } else if (err.message?.includes('FunctionsHttpError')) {
          errorMessage = "There was an error with the edge function. Please try again in a few moments.";
        } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.message?.includes('parse') || err.message?.includes('JSON')) {
          errorMessage = "There was an error processing the analysis data. Please try again.";
          console.error("[useConciseInsightResults] JSON parsing error details:", err);
        } else {
          errorMessage = err.message || "An error occurred while fetching analysis";
        }
        
        setError(errorMessage);
        setIsProcessingComplete(true);
        
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
    maxRetries: MAX_RETRIES,
    isProcessingComplete
  };
};
