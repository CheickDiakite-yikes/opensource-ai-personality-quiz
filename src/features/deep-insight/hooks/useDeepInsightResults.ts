
import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDeepInsightStorage } from "./useDeepInsightStorage";
import { generateAnalysisFromResponses } from "../utils/analysisGenerator";
import { AnalysisData, toJsonObject } from "../utils/analysis/types";
import { useAnalysisState } from "./analysis/useAnalysisState";
import { useAnalysisCache } from "./analysis/useAnalysisCache";
import { useAnalysisFetch } from "./analysis/useAnalysisFetch";
import { ensureAnalysisStructure } from "../utils/analysis/ensureAnalysisStructure";
import { useAuth } from "@/contexts/AuthContext";
import { DeepInsightResponses } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const useDeepInsightResults = () => {
  const { getResponses, clearSavedProgress } = useDeepInsightStorage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  const navigate = useNavigate();
  const maxRetries = 1;
  const retryDelay = 3000;
  const isRetrying = useRef(false);
  const hasAutoRetried = useRef(false);

  const {
    analysis,
    setAnalysis,
    isLoading,
    setIsLoading,
    error,
    setError,
    loadedFromCache,
    setLoadedFromCache,
    retryCount,
    setRetryCount
  } = useAnalysisState();

  const { cacheAnalysis, loadCachedAnalysis } = useAnalysisCache();
  const { fetchAnalysisById, ensureValidUUID, isLegacyId } = useAnalysisFetch();
  
  // Always check for the fresh parameter to force new analysis generation
  const forceNewAnalysis = searchParams.get('fresh') === 'true';

  useEffect(() => {
    const fetchOrGenerateAnalysis = async () => {
      if (isRetrying.current) {
        console.log("Already in retry process, skipping redundant fetch");
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        // Only attempt to load by ID if we have an ID parameter and aren't forcing fresh
        if (analysisId && !forceNewAnalysis) {
          console.log(`Attempting to load analysis with ID: ${analysisId}`);
          
          if (isLegacyId(analysisId)) {
            console.log(`Legacy analysis ID format detected: ${analysisId}`);
            
            try {
              const { data, error } = await supabase.functions.invoke('get-public-analysis', {
                body: { id: analysisId },
              });
              
              if (error) {
                console.error(`Error fetching legacy analysis: ${error.message || error}`);
                throw new Error(`Error fetching legacy analysis: ${error.message || error}`);
              }
              
              if (data) {
                console.log(`Successfully loaded legacy analysis`);
                const analysisData = data as AnalysisData;
                ensureAnalysisStructure(analysisData);
                setAnalysis(analysisData);
                cacheAnalysis(analysisData);
                setIsLoading(false);
                return;
              }
            } catch (legacyErr) {
              console.error("Failed to fetch legacy analysis:", legacyErr);
            }
          } else {
            const { data, error } = await supabase
              .from("deep_insight_analyses")
              .select("*")
              .eq("id", analysisId)
              .maybeSingle();

            if (error) {
              console.error(`Error fetching analysis: ${error.message}`);
              throw new Error(`Error fetching analysis: ${error.message}`);
            }

            if (data) {
              console.log(`Successfully loaded analysis: ${data.id}`);
              const convertedAnalysis = data.complete_analysis as unknown as AnalysisData;
              ensureAnalysisStructure(convertedAnalysis);
              setAnalysis(convertedAnalysis);
              cacheAnalysis(convertedAnalysis);
              setIsLoading(false);
              return;
            } else {
              console.log(`No analysis found with ID: ${analysisId}`);
              toast.error("Analysis not found", {
                description: "The requested analysis could not be found"
              });
            }
          }
        }

        // Only check cache if we're not forcing a fresh analysis
        if (!forceNewAnalysis) {
          console.log("Checking for cached analysis");
          const cachedAnalysis = loadCachedAnalysis();
          if (cachedAnalysis) {
            console.log("Using cached analysis");
            ensureAnalysisStructure(cachedAnalysis);
            setAnalysis(cachedAnalysis);
            setLoadedFromCache(true);
            setIsLoading(false);
            return;
          }
        } else {
          console.log("Forcing new analysis generation, bypassing cache");
        }

        console.log("Getting responses from storage");
        const responses = await getResponses();
        console.log("Retrieved responses from storage:", responses);
        console.log("Response count:", Object.keys(responses).length);
        
        const expectedQuestionCount = 100;
        if (!responses || Object.keys(responses).length === 0) {
          console.log("No responses found");
          toast.error("No assessment responses found", {
            description: "Please complete the assessment first before viewing results"
          });
          navigate("/deep-insight/quiz");
          throw new Error("No responses found. Please complete the assessment first.");
        }
        
        if (Object.keys(responses).length < expectedQuestionCount) {
          console.warn(`Incomplete responses: ${Object.keys(responses).length}/${expectedQuestionCount}`);
          toast.error("Incomplete assessment", {
            description: `You've only completed ${Object.keys(responses).length} out of ${expectedQuestionCount} questions. Please complete all questions for a comprehensive analysis.`
          });
          navigate("/deep-insight/quiz");
          throw new Error(`Incomplete responses: ${Object.keys(responses).length}/${expectedQuestionCount}. Please complete all questions.`);
        }

        console.log("Generating analysis from responses...");
        const result = await generateAnalysis(responses);
        console.log("Analysis generation complete");
        
        if (!result) {
          throw new Error("Failed to generate analysis");
        }
        
        result.rawResponses = responses;
        
        setAnalysis(result);
        cacheAnalysis(result);
      } catch (err) {
        console.error("Error generating results:", err);
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        
        if (retryCount < maxRetries && !hasAutoRetried.current) {
          const nextRetryCount = retryCount + 1;
          console.log(`Auto-retrying analysis generation (${nextRetryCount}/${maxRetries}) in ${retryDelay}ms`);
          
          toast.loading(`Retrying analysis generation (${nextRetryCount}/${maxRetries})...`);
          
          setRetryCount(nextRetryCount);
          hasAutoRetried.current = true;
          
          setTimeout(() => {
            if (isRetrying.current) return;
            fetchOrGenerateAnalysis();
          }, retryDelay);
          return;
        } else if (retryCount >= maxRetries) {
          toast.error("Failed to generate analysis after multiple attempts", {
            description: "Please try again using the retry button below"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateAnalysis();
  }, [analysisId, getResponses, navigate, retryCount, forceNewAnalysis]);

  const saveAnalysis = async () => {
    if (!analysis || !user) {
      toast.error("No analysis data to save or user not logged in");
      return;
    }
    
    try {
      if (user) {
        try {
          console.log("Saving analysis to database...");
          
          const validId = ensureValidUUID(analysis.id);
          
          if (validId !== analysis.id) {
            analysis.id = validId;
          }
          
          const jsonAnalysis = toJsonObject(analysis);
          
          const analysisData = {
            id: validId,
            user_id: user.id,
            complete_analysis: jsonAnalysis,
            raw_responses: JSON.parse(JSON.stringify(analysis.rawResponses)),
            overview: analysis.overview,
            core_traits: JSON.parse(JSON.stringify(analysis.coreTraits)),
            cognitive_patterning: JSON.parse(JSON.stringify(analysis.cognitivePatterning)),
            emotional_architecture: JSON.parse(JSON.stringify(analysis.emotionalArchitecture)),
            interpersonal_dynamics: JSON.parse(JSON.stringify(analysis.interpersonalDynamics)),
            intelligence_score: analysis.intelligenceScore,
            emotional_intelligence_score: analysis.emotionalIntelligenceScore,
            response_patterns: JSON.parse(JSON.stringify(analysis.responsePatterns)),
            growth_potential: JSON.parse(JSON.stringify(analysis.growthPotential)),
            created_at: new Date().toISOString(),
          };
          
          const { data, error } = await supabase
            .from("deep_insight_analyses")
            .insert(analysisData)
            .select("id")
            .single();
          
          if (error) {
            console.error("Error saving analysis to database:", error);
          } else {
            console.log("Analysis saved to database with ID:", data.id);
          }
        } catch (err) {
          console.error("Exception while saving analysis:", err);
        }
      }
      
      toast.success("Analysis saved successfully");
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("Failed to save analysis", { 
        description: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    }
  };

  const retryAnalysis = async () => {
    if (isRetrying.current) {
      console.warn("Already retrying analysis, ignoring duplicate request");
      toast.error("Retry already in progress", {
        description: "Please wait for the current retry attempt to complete"
      });
      return;
    }
    
    setRetryCount(0);
    setError(null);
    setIsLoading(true);
    isRetrying.current = true;
    
    toast.loading("Retrying analysis generation...", {
      duration: 10000
    });
    
    try {
      const responses = await getResponses();
      if (responses && Object.keys(responses).length === 100) {
        const result = await generateAnalysis(responses);
        if (result) {
          result.rawResponses = responses;
          setAnalysis(result);
          cacheAnalysis(result);
          toast.success("Analysis generated successfully!");
        } else {
          throw new Error("Failed to generate analysis");
        }
      } else {
        throw new Error("Incomplete responses");
      }
    } catch (err) {
      console.error("Error in manual retry:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred during retry"));
      toast.error("Failed to generate analysis", {
        description: "Please try again or restart the assessment"
      });
    } finally {
      setIsLoading(false);
      isRetrying.current = false;
    }
  };

  const generateAnalysis = async (responses: DeepInsightResponses): Promise<AnalysisData | null> => {
    try {
      console.log(`Generating analysis from ${Object.keys(responses).length} responses`);
      const result = await generateAnalysisFromResponses(responses);
      
      if (!result) {
        throw new Error("Failed to generate analysis result");
      }

      ensureAnalysisStructure(result);

      if (user) {
        try {
          const validId = ensureValidUUID(result.id);
          if (validId !== result.id) {
            result.id = validId;
          }
          
          const jsonAnalysis = toJsonObject(result);
          
          const analysisData = {
            id: validId,
            user_id: user.id,
            complete_analysis: jsonAnalysis,
            raw_responses: responses,
            overview: result.overview,
            core_traits: JSON.parse(JSON.stringify(result.coreTraits)),
            cognitive_patterning: JSON.parse(JSON.stringify(result.cognitivePatterning)),
            emotional_architecture: JSON.parse(JSON.stringify(result.emotionalArchitecture)),
            interpersonal_dynamics: JSON.parse(JSON.stringify(result.interpersonalDynamics)),
            intelligence_score: result.intelligenceScore,
            emotional_intelligence_score: result.emotionalIntelligenceScore,
            response_patterns: JSON.parse(JSON.stringify(result.responsePatterns)),
            growth_potential: JSON.parse(JSON.stringify(result.growthPotential)),
            created_at: new Date().toISOString(),
          };
          
          const { data, error } = await supabase
            .from("deep_insight_analyses")
            .insert(analysisData)
            .select("id")
            .single();
          
          if (error) {
            console.error("Error saving analysis to database:", error);
          }
        } catch (err) {
          console.error("Exception while saving analysis:", err);
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      throw error;
    }
  };

  return { 
    analysis, 
    isLoading, 
    error, 
    saveAnalysis, 
    retryAnalysis,
    fetchAnalysisById,
    loadedFromCache
  };
};
