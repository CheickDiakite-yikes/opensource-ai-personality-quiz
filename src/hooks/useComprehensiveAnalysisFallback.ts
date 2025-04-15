
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useComprehensiveAnalysisFallback = (assessmentId: string | undefined) => {
  const { user } = useAuth();
  const [isPolling, setIsPolling] = useState(false);
  const [foundAnalysis, setFoundAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [userAnalyses, setUserAnalyses] = useState<ComprehensiveAnalysis[]>([]);
  const [hasAttemptedPolling, setHasAttemptedPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [isLoadingUserAnalyses, setIsLoadingUserAnalyses] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Helper function to add logs
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}`;
    console.log(`useComprehensiveAnalysisFallback - ${logEntry}`);
    setDebugLogs(prev => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 logs
  }, []);
  
  // Enhanced function to safely convert database result to ComprehensiveAnalysis
  const convertToAnalysis = useCallback((data: any): ComprehensiveAnalysis | null => {
    if (!data) {
      addLog("Cannot convert null data to analysis");
      return null;
    }
    
    try {
      addLog(`Converting analysis data: ${JSON.stringify(data).substring(0, 200) + "..."}`);
      
      // First, attempt to extract any nested result data
      let resultData = data;
      
      // If the data is wrapped in a result property that's a string, parse it
      if (data.result && typeof data.result === 'string') {
        try {
          const parsedResult = JSON.parse(data.result);
          addLog("Successfully parsed string result into object");
          
          // If the parsed result has all the key fields we need, use it directly
          if (parsedResult.traits || parsedResult.overview || parsedResult.intelligence) {
            resultData = {
              ...data,
              ...parsedResult,
            };
          }
        } catch (parseErr) {
          addLog(`Error parsing result string: ${parseErr instanceof Error ? parseErr.message : String(parseErr)}`);
        }
      } 
      // If result is an object, merge it with the data
      else if (data.result && typeof data.result === 'object') {
        resultData = {
          ...data,
          ...data.result,
        };
      }
      
      // Extract different possible field structures
      // This handles fields that could be in different places based on how the data was saved
      const traits = ensureArray(resultData.traits || data.traits);
      const overview = resultData.overview || data.overview || "";
      const intelligence = resultData.intelligence || data.intelligence || {};
      const intelligenceScore = extractNumber(resultData.intelligence_score || resultData.intelligenceScore || data.intelligence_score || 0);
      const emotionalIntelligenceScore = extractNumber(resultData.emotional_intelligence_score || resultData.emotionalIntelligenceScore || data.emotional_intelligence_score || 0);
      const motivators = ensureArray(resultData.motivators || data.motivators);
      const inhibitors = ensureArray(resultData.inhibitors || data.inhibitors);
      const growthAreas = ensureArray(resultData.growth_areas || resultData.growthAreas || data.growth_areas);
      const weaknesses = ensureArray(resultData.weaknesses || data.weaknesses);
      const relationshipPatterns = resultData.relationship_patterns || resultData.relationshipPatterns || data.relationship_patterns || {};
      const careerSuggestions = ensureArray(resultData.career_suggestions || resultData.careerSuggestions || data.career_suggestions);
      const roadmap = resultData.roadmap || data.roadmap || "";
      const learningPathways = ensureArray(resultData.learning_pathways || resultData.learningPathways || data.learning_pathways);

      // Process traits to ensure they have proper structure
      const processedTraits = traits.map(trait => {
        // If trait is just a string, convert to object format
        if (typeof trait === 'string') {
          return {
            name: trait,
            trait: trait,
            score: 5,
            description: `You have a significant presence of the ${trait} trait.`,
            impact: [],
            recommendations: [],
            strengths: [`Related to your ${trait}`],
            challenges: [],
            growthSuggestions: []
          };
        }
        
        // If trait is an object but missing fields, fill them in
        const name = trait.name || trait.trait || "Unknown Trait";
        
        return {
          name: name,
          trait: trait.trait || name,
          score: extractNumber(trait.score !== undefined ? trait.score : 5),
          description: trait.description || `This trait reflects aspects of your personality relating to ${name}.`,
          impact: ensureArray(trait.impact),
          recommendations: ensureArray(trait.recommendations),
          strengths: ensureArray(trait.strengths),
          challenges: ensureArray(trait.challenges),
          growthSuggestions: ensureArray(trait.growthSuggestions)
        };
      });
      
      // Build the final analysis object
      const analysis: ComprehensiveAnalysis = {
        id: data.id || "",
        created_at: data.created_at || new Date().toISOString(),
        assessment_id: data.assessment_id || assessmentId || "",
        overview: typeof overview === 'string' ? overview : "No overview available",
        traits: processedTraits,
        intelligence: typeof intelligence === 'object' ? intelligence : {},
        intelligenceScore: intelligenceScore,
        emotionalIntelligenceScore: emotionalIntelligenceScore,
        motivators: motivators,
        inhibitors: inhibitors,
        growthAreas: growthAreas,
        weaknesses: weaknesses,
        relationshipPatterns: relationshipPatterns,
        careerSuggestions: careerSuggestions,
        roadmap: typeof roadmap === 'string' ? roadmap : "No roadmap available",
        learningPathways: learningPathways
      };
      
      addLog(`Conversion complete. Analysis has ${analysis.traits.length} traits and overview length: ${analysis.overview?.length || 0}`);
      
      return analysis;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown conversion error";
      addLog(`Error converting data to analysis: ${errMsg}`);
      
      if (err instanceof Error) {
        addLog(`Error stack: ${err.stack}`);
      }
      
      // Save detailed error information
      setConversionError(errMsg);
      
      // Try to extract useful parts even if full conversion fails
      try {
        return {
          id: data.id || "",
          created_at: data.created_at || new Date().toISOString(),
          assessment_id: data.assessment_id || assessmentId || "",
          overview: typeof data.overview === 'string' ? data.overview : "Error loading analysis data",
          traits: [],
          intelligence: {},
          intelligenceScore: 0,
          emotionalIntelligenceScore: 0,
          motivators: [],
          inhibitors: [],
          growthAreas: [],
          weaknesses: [],
          relationshipPatterns: {},
          careerSuggestions: [],
          roadmap: "Error loading analysis data",
          learningPathways: []
        };
      } catch {
        return null;
      }
    }
  }, [assessmentId, addLog]);
  
  // Helper function to ensure a value is an array
  const ensureArray = (value: any): any[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return [value];
  };
  
  // Helper function to extract a number safely
  const extractNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };
  
  // Function to fetch all analyses for the current user using the edge function
  const fetchAllUserAnalyses = useCallback(async (): Promise<ComprehensiveAnalysis[]> => {
    if (!user) {
      addLog("Cannot fetch analyses - no user logged in");
      return [];
    }
    
    setIsLoadingUserAnalyses(true);
    try {
      addLog(`Fetching all comprehensive analyses for user: ${user.id} via edge function`);
      
      const { data, error } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { 
            user_id: user.id,
            fetch_all: true
          }
        }
      );
      
      if (error) {
        addLog(`Edge function error fetching user analyses: ${JSON.stringify(error)}`);
        
        toast.error("Failed to fetch your analyses", {
          description: "Please try refreshing the page"
        });
        return [];
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        addLog("No analyses found for user via edge function");
        return [];
      }
      
      addLog(`Edge function found ${data.length} analyses for user ${user.id}`);
      
      // Convert all analyses to the proper format
      const analyses: ComprehensiveAnalysis[] = data
        .map(item => {
          const analysis = convertToAnalysis(item);
          if (!analysis) {
            addLog(`Failed to convert analysis item: ${item.id}`);
          }
          return analysis;
        })
        .filter(Boolean) as ComprehensiveAnalysis[];
      
      // Sort analyses by date (newest first)
      const sortedAnalyses = analyses.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setUserAnalyses(sortedAnalyses);
      return sortedAnalyses;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      addLog(`Error in fetchAllUserAnalyses: ${errMsg}`);
      
      if (error instanceof Error) {
        addLog(`Error stack: ${error.stack}`);
      }
      
      toast.error("Failed to fetch your analyses", {
        description: "Please try again later"
      });
      return [];
    } finally {
      setIsLoadingUserAnalyses(false);
    }
  }, [user, convertToAnalysis, addLog]);
  
  // Function to directly call the edge function for analysis retrieval
  const fetchWithEdgeFunction = useCallback(async (id: string): Promise<ComprehensiveAnalysis | null> => {
    if (!id) {
      addLog("Cannot fetch with edge function - no ID provided");
      return null;
    }
    
    try {
      addLog(`Directly calling get-comprehensive-analysis edge function for ID: ${id}`);
      
      const { data, error } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { id }
        }
      );
      
      if (error) {
        addLog(`Edge function error: ${JSON.stringify(error)}`);
        return null;
      }
      
      if (!data) {
        addLog("No data returned from edge function");
        return null;
      }
      
      addLog("Successfully retrieved analysis via edge function");
      
      // Convert the data to a ComprehensiveAnalysis object
      const analysis = convertToAnalysis(data);
      return analysis;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      addLog(`Error calling edge function: ${errMsg}`);
      
      if (err instanceof Error) {
        addLog(`Error stack: ${err.stack}`);
      }
      
      return null;
    }
  }, [convertToAnalysis, addLog]);
  
  // Function to poll for analysis completion with enhanced error handling and retries
  const pollForAnalysis = useCallback(async (id: string, maxAttempts = 5): Promise<ComprehensiveAnalysis | null> => {
    if (!id) {
      addLog("Cannot poll for analysis - no ID provided");
      return null;
    }
    
    setIsPolling(true);
    setHasAttemptedPolling(true);
    
    try {
      // First try: use the edge function directly (now our primary method)
      addLog(`Starting analysis polling for ID: ${id} using edge function`);
      const edgeFunctionResult = await fetchWithEdgeFunction(id);
      
      if (edgeFunctionResult) {
        addLog(`Edge function found analysis for ID: ${id}`);
        setFoundAnalysis(edgeFunctionResult);
        setIsPolling(false);
        toast.success("Analysis found!", { id: `poll-analysis-${id}` });
        return edgeFunctionResult;
      }
      
      // If edge function fails, continue with legacy polling methods
      addLog(`Edge function failed to find analysis for ID: ${id}, starting polling`);
      
      // Method 4: Try to trigger analysis if needed
      let attempts = 0;
      const poll = async () => {
        try {
          // Try edge function first on each poll attempt
          addLog(`Polling attempt ${attempts + 1}/${maxAttempts} for ID: ${id}`);
          const edgeResult = await fetchWithEdgeFunction(id);
          
          if (edgeResult) {
            addLog(`Edge function found analysis on polling attempt ${attempts}`);
            setFoundAnalysis(edgeResult);
            setIsPolling(false);
            toast.success("Analysis completed!", { id: `poll-analysis-${id}` });
            return;
          }
          
          addLog(`No analysis found on polling attempt ${attempts + 1}`);
        } catch (edgeErr) {
          const errMsg = edgeErr instanceof Error ? edgeErr.message : "Unknown error";
          addLog(`Error checking via edge function during polling: ${errMsg}`);
        }
        
        if (attempts >= maxAttempts) {
          addLog(`Polling complete - reached max attempts (${maxAttempts})`);
          setIsPolling(false);
          toast.error("Could not retrieve analysis after multiple attempts");
          return;
        }
        
        attempts++;
        setPollingAttempts(attempts);
        
        addLog(`Polling for analysis of assessment ${id} - attempt ${attempts}/${maxAttempts}`);
        
        if (attempts === 1) {
          // On first attempt, try to trigger the analysis
          try {
            addLog("Attempting to trigger analysis creation via edge function");
            const triggerResponse = await supabase.functions.invoke(
              "analyze-comprehensive-responses",
              {
                body: { 
                  assessmentId: id,
                  forceRun: true
                }
              }
            );
            
            if (triggerResponse.error) {
              addLog(`Error triggering analysis: ${JSON.stringify(triggerResponse.error)}`);
            } else {
              addLog("Successfully triggered analysis creation");
            }
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : "Unknown error";
            addLog(`Exception when triggering analysis: ${errMsg}`);
            
            if (err instanceof Error && err.stack) {
              addLog(`Error stack: ${err.stack}`);
            }
          }
        }
        
        // Wait before next polling attempt
        setTimeout(() => {
          poll();
        }, 5000);
      };
      
      // Start polling
      poll();
      
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      addLog(`Error in pollForAnalysis: ${errMsg}`);
      
      if (error instanceof Error && error.stack) {
        addLog(`Error stack: ${error.stack}`);
      }
      
      toast.error("Error retrieving analysis");
      setIsPolling(false);
      return null;
    }
    
    // Return null here since the real result comes through the state update
    return null;
  }, [fetchWithEdgeFunction, addLog]);
  
  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false);
    };
  }, []);

  // When user changes, attempt to fetch all of their analyses
  useEffect(() => {
    if (user && !isLoadingUserAnalyses && userAnalyses.length === 0) {
      fetchAllUserAnalyses().then(analyses => {
        addLog(`Initial user analyses fetch found ${analyses.length} analyses`);
      });
    }
  }, [user, isLoadingUserAnalyses, userAnalyses.length, fetchAllUserAnalyses, addLog]);

  return {
    pollForAnalysis,
    fetchWithEdgeFunction,
    fetchAllUserAnalyses,
    isPolling,
    isLoadingUserAnalyses,
    foundAnalysis,
    userAnalyses,
    hasAttemptedPolling,
    pollingAttempts,
    conversionError,
    debugLogs
  };
};
