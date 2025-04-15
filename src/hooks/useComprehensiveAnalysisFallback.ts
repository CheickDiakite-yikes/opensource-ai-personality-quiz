
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis } from "@/utils/types";
import { toast } from "sonner";

export const useComprehensiveAnalysisFallback = (assessmentId: string | undefined) => {
  const [isPolling, setIsPolling] = useState(false);
  const [foundAnalysis, setFoundAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [hasAttemptedPolling, setHasAttemptedPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [conversionError, setConversionError] = useState<string | null>(null);
  
  // Enhanced function to safely convert database result to ComprehensiveAnalysis
  const convertToAnalysis = useCallback((data: any): ComprehensiveAnalysis | null => {
    if (!data) return null;
    
    try {
      console.log("Converting analysis data:", JSON.stringify(data).substring(0, 200) + "...");
      
      // First, attempt to extract any nested result data
      let resultData = data;
      
      // If the data is wrapped in a result property that's a string, parse it
      if (data.result && typeof data.result === 'string') {
        try {
          const parsedResult = JSON.parse(data.result);
          console.log("Successfully parsed string result into object");
          
          // If the parsed result has all the key fields we need, use it directly
          if (parsedResult.traits || parsedResult.overview || parsedResult.intelligence) {
            resultData = {
              ...data,
              ...parsedResult,
            };
          }
        } catch (parseErr) {
          console.error("Error parsing result string:", parseErr);
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
      
      console.log(`Conversion complete. Analysis has ${analysis.traits.length} traits and overview length: ${analysis.overview?.length || 0}`);
      
      return analysis;
    } catch (err) {
      console.error("Error converting data to analysis:", err);
      setConversionError(err instanceof Error ? err.message : "Unknown conversion error");
      return null;
    }
  }, [assessmentId]);
  
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
  
  // Function to poll for analysis completion with enhanced error handling and retries
  const pollForAnalysis = useCallback(async (id: string, maxAttempts = 5) => {
    if (!id) return null;
    
    setIsPolling(true);
    setHasAttemptedPolling(true);
    
    try {
      // Comprehensive search for existing analysis using multiple methods
      console.log(`Starting comprehensive analysis polling for ID: ${id}`);
      
      // Method 1: Check if analysis already exists with exact ID match
      const { data: existingAnalysis, error: existingError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (existingError) {
        console.log("Error checking for existing analysis by ID:", existingError);
      }
      
      if (existingAnalysis) {
        console.log("Found existing analysis with ID:", id);
        const analysis = convertToAnalysis(existingAnalysis);
        if (analysis) {
          setFoundAnalysis(analysis);
          setIsPolling(false);
          toast.success("Analysis found!");
          return analysis;
        }
      }
      
      // Method 2: Check if analysis exists with assessment ID (fix: use select() instead of maybeSingle())
      const { data: byAssessmentId, error: assessmentError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('assessment_id', id);
      
      if (assessmentError) {
        console.log("Error checking for existing analysis by assessment ID:", assessmentError);
      }
      
      if (byAssessmentId && byAssessmentId.length > 0) {
        console.log(`Found ${byAssessmentId.length} existing analyses for assessment ID:`, id);
        
        // Use the most recent analysis if there are multiple
        const mostRecent = byAssessmentId.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })[0];
        
        const analysis = convertToAnalysis(mostRecent);
        if (analysis) {
          setFoundAnalysis(analysis);
          setIsPolling(false);
          toast.success("Analysis found via assessment ID!");
          return analysis;
        }
      }
      
      // Method 3: Try using the Supabase RPC function
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_comprehensive_analysis_by_id', { analysis_id: id });
        
        if (rpcError) {
          console.error("Error calling RPC function:", rpcError);
        } else if (rpcData) {
          console.log("Found analysis via RPC function:", typeof rpcData);
          const analysis = convertToAnalysis(rpcData);
          if (analysis) {
            setFoundAnalysis(analysis);
            setIsPolling(false);
            toast.success("Analysis found via database function!");
            return analysis;
          }
        }
      } catch (rpcErr) {
        console.error("Exception calling RPC function:", rpcErr);
      }
      
      // Method 4: Check for any recent analyses that might match our criteria
      try {
        const { data: recentAnalyses, error: recentError } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (!recentError && recentAnalyses && recentAnalyses.length > 0) {
          console.log(`Checking ${recentAnalyses.length} recent analyses for potential matches`);
          
          // Look for a match by timestamp (created within the last 15 minutes)
          const potentialMatch = recentAnalyses.find(a => 
            (Date.now() - new Date(a.created_at).getTime()) < 900000 // 15 minutes
          );
          
          if (potentialMatch) {
            console.log("Found recent analysis that might match:", potentialMatch.id);
            const analysis = convertToAnalysis(potentialMatch);
            if (analysis) {
              setFoundAnalysis(analysis);
              setIsPolling(false);
              toast.success("Recent analysis found!");
              return analysis;
            }
          }
        }
      } catch (recentErr) {
        console.error("Error checking recent analyses:", recentErr);
      }
      
      // If no existing analysis found yet, start polling
      let attempts = 0;
      const poll = async () => {
        if (attempts >= maxAttempts) {
          console.log(`Polling complete - reached max attempts (${maxAttempts})`);
          setIsPolling(false);
          toast.error("Could not retrieve analysis after multiple attempts");
          return;
        }
        
        attempts++;
        setPollingAttempts(attempts);
        
        console.log(`Polling for analysis of assessment ${id} - attempt ${attempts}/${maxAttempts}`);
        
        if (attempts === 1) {
          // On first attempt, try to trigger the analysis
          try {
            // Get the assessment data to pass to the analysis function
            const { data: assessmentData } = await supabase
              .from('comprehensive_assessments')
              .select('*')
              .eq('id', id)
              .maybeSingle();
              
            if (assessmentData?.responses) {
              toast.loading("Analyzing your responses...", { id: `poll-analysis-${id}` });
              
              // Try to analyze the responses
              await supabase.functions.invoke(
                "analyze-comprehensive-responses",
                {
                  body: { 
                    assessmentId: id,
                    responses: assessmentData.responses,
                    useMockData: false // Explicitly prevent mock data usage
                  }
                }
              ).catch(err => {
                console.error("Error triggering analysis:", err);
                // Even if invoke fails, continue polling as analysis might be triggered by other means
              });
            }
          } catch (err) {
            console.error("Error triggering analysis:", err);
          }
        }
        
        // Always check all possible methods to find the analysis
        
        // Check by direct ID
        const { data: checkById } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (checkById) {
          console.log("Analysis found by ID match on attempt", attempts);
          const analysis = convertToAnalysis(checkById);
          if (analysis) {
            setFoundAnalysis(analysis);
            setIsPolling(false);
            toast.success("Analysis completed!", { id: `poll-analysis-${id}` });
            return;
          }
        }
        
        // Check by assessment ID (fixed to handle multiple analyses)
        const { data: checkByAssessment } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .eq('assessment_id', id);
          
        if (checkByAssessment && checkByAssessment.length > 0) {
          console.log(`Found ${checkByAssessment.length} analyses by assessment ID match on attempt ${attempts}`);
          // Use the most recent analysis
          const mostRecent = checkByAssessment.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })[0];
          
          const analysis = convertToAnalysis(mostRecent);
          if (analysis) {
            setFoundAnalysis(analysis);
            setIsPolling(false);
            toast.success("Analysis completed!", { id: `poll-analysis-${id}` });
            return;
          }
        }
        
        // Try RPC function again
        try {
          const { data: rpcData } = await supabase
            .rpc('get_comprehensive_analysis_by_id', { analysis_id: id });
            
          if (rpcData) {
            console.log("Analysis found via RPC on attempt", attempts);
            const analysis = convertToAnalysis(rpcData);
            if (analysis) {
              setFoundAnalysis(analysis);
              setIsPolling(false);
              toast.success("Analysis completed via database function!", { id: `poll-analysis-${id}` });
              return;
            }
          }
        } catch (rpcErr) {
          // Continue to next check
        }
        
        // Check recent analyses (might be missing assessment_id link)
        const { data: recentAnalyses } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentAnalyses && recentAnalyses.length > 0) {
          // Check if any recent analysis might match our criteria
          const matchingAnalysis = recentAnalyses.find(a => 
            (Date.now() - new Date(a.created_at).getTime()) < 300000 // Created in last 5 minutes
          );
          
          if (matchingAnalysis) {
            console.log("Found recent analysis that might match our request", matchingAnalysis.id);
            const analysis = convertToAnalysis(matchingAnalysis);
            if (analysis) {
              setFoundAnalysis(analysis);
              setIsPolling(false);
              toast.success("Recent analysis found!", { id: `poll-analysis-${id}` });
              return;
            }
          }
        }
        
        toast.loading(`Processing your assessment (${attempts}/${maxAttempts})...`, { id: `poll-analysis-${id}` });
        
        // Wait before next polling attempt
        setTimeout(() => {
          poll();
        }, 5000);
      };
      
      // Start polling
      poll();
      
    } catch (error) {
      console.error("Error in pollForAnalysis:", error);
      toast.error("Error retrieving analysis");
      setIsPolling(false);
      return null;
    }
  }, [convertToAnalysis]);
  
  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false);
    };
  }, []);

  return {
    pollForAnalysis,
    isPolling,
    foundAnalysis,
    hasAttemptedPolling,
    pollingAttempts,
    conversionError
  };
};
