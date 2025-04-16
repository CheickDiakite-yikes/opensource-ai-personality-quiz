
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
      const valueSystem = resultData.value_system || resultData.valueSystem || data.value_system || [];
      const cognitiveStyle = resultData.cognitive_style || resultData.cognitiveStyle || data.cognitive_style || {};

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
      
      // Build the final analysis object with both database and component naming conventions
      const analysis: ComprehensiveAnalysis = {
        id: data.id || "",
        created_at: data.created_at || new Date().toISOString(),
        assessment_id: data.assessment_id || assessmentId || "",
        user_id: data.user_id,
        overview: typeof overview === 'string' ? overview : "No overview available",
        traits: processedTraits,
        intelligence: typeof intelligence === 'object' ? intelligence : {},
        intelligence_score: intelligenceScore,
        intelligenceScore: intelligenceScore,
        emotional_intelligence_score: emotionalIntelligenceScore,
        emotionalIntelligenceScore: emotionalIntelligenceScore,
        value_system: valueSystem,
        valueSystem: valueSystem,
        motivators: motivators,
        inhibitors: inhibitors,
        growth_areas: growthAreas,
        growthAreas: growthAreas,
        weaknesses: weaknesses,
        relationship_patterns: relationshipPatterns,
        relationshipPatterns: relationshipPatterns,
        career_suggestions: careerSuggestions,
        careerSuggestions: careerSuggestions,
        roadmap: typeof roadmap === 'string' ? roadmap : "No roadmap available",
        learning_pathways: learningPathways,
        learningPathways: learningPathways,
        cognitive_style: cognitiveStyle,
        cognitiveStyle: cognitiveStyle,
        result: data.result
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
          value_system: [],
          valueSystem: [],
          motivators: [],
          inhibitors: [],
          growthAreas: [],
          growth_areas: [],
          weaknesses: [],
          relationshipPatterns: {},
          relationship_patterns: {},
          careerSuggestions: [],
          career_suggestions: [],
          roadmap: "Error loading analysis data",
          learningPathways: [],
          learning_pathways: []
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
      addLog(`Fetching all comprehensive analyses for user ${user.id}`);
      
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
        addLog(`Error fetching analyses: ${error.message}`);
        return [];
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        addLog("No analyses found for user");
        return [];
      }
      
      addLog(`Found ${data.length} analyses for user`);
      
      const convertedAnalyses = data.map(item => convertToAnalysis(item))
        .filter((analysis): analysis is ComprehensiveAnalysis => analysis !== null);
      
      setUserAnalyses(convertedAnalyses);
      return convertedAnalyses;
    } catch (err) {
      addLog(`Exception in fetchAllUserAnalyses: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    } finally {
      setIsLoadingUserAnalyses(false);
    }
  }, [user, convertToAnalysis, addLog]);
  
  // Function to fetch analysis using edge function
  const fetchWithEdgeFunction = useCallback(async (id: string): Promise<ComprehensiveAnalysis | null> => {
    try {
      addLog(`Fetching analysis with ID ${id} using edge function`);
      
      const { data, error } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { analysis_id: id }
        }
      );

      if (error) {
        addLog(`Edge function error: ${error.message}`);
        return null;
      }
      
      if (!data) {
        addLog("No data returned from edge function");
        return null;
      }
      
      addLog("Successfully received data from edge function");
      return convertToAnalysis(data);
    } catch (err) {
      addLog(`Exception in fetchWithEdgeFunction: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }, [convertToAnalysis, addLog]);
  
  // Function to poll for analysis completion
  const pollForAnalysis = useCallback(async (id: string): Promise<ComprehensiveAnalysis | null> => {
    addLog(`Starting polling for analysis with ID ${id}`);
    setIsPolling(true);
    setHasAttemptedPolling(true);
    setPollingAttempts(0);
    
    try {
      // Try to directly fetch the analysis first
      const directResult = await fetchWithEdgeFunction(id);
      if (directResult) {
        addLog("Successfully fetched analysis on first attempt");
        setFoundAnalysis(directResult);
        setIsPolling(false);
        return directResult;
      }
      
      // If not found, start polling
      let attempts = 0;
      const maxAttempts = 5;
      let foundResult: ComprehensiveAnalysis | null = null;
      
      while (attempts < maxAttempts) {
        attempts++;
        setPollingAttempts(attempts);
        
        addLog(`Polling attempt ${attempts}/${maxAttempts}`);
        
        // Wait 3 seconds between attempts (increasing with each attempt)
        await new Promise(resolve => setTimeout(resolve, 3000 * attempts));
        
        // Try to get the analysis
        const result = await fetchWithEdgeFunction(id);
        
        if (result) {
          addLog(`Found analysis on polling attempt ${attempts}`);
          foundResult = result;
          setFoundAnalysis(result);
          break;
        }
        
        addLog(`Analysis not found on attempt ${attempts}`);
      }
      
      if (!foundResult) {
        addLog(`Analysis not found after ${maxAttempts} attempts`);
      }
      
      return foundResult;
    } finally {
      setIsPolling(false);
    }
  }, [fetchWithEdgeFunction, addLog]);
  
  return {
    pollForAnalysis, 
    fetchWithEdgeFunction,
    fetchAllUserAnalyses, // Export the fetchAllUserAnalyses function
    isPolling,
    foundAnalysis,
    hasAttemptedPolling,
    pollingAttempts,
    conversionError,
    userAnalyses, // Export the userAnalyses state
    isLoadingUserAnalyses, // Export the isLoadingUserAnalyses state
    debugLogs
  };
};
