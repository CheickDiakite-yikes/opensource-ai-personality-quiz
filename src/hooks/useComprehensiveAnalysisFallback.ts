
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
  
  // Function to safely convert database result to ComprehensiveAnalysis
  const convertToAnalysis = useCallback((data: any): ComprehensiveAnalysis | null => {
    if (!data) return null;
    
    try {
      // Handle different data structures that might be returned
      // If it's already in the right format, just return it
      if (data.id && (data.traits || data.overview)) {
        return data as unknown as ComprehensiveAnalysis;
      }
      
      // If the analysis is wrapped in a result property
      if (data.result) {
        const resultData = typeof data.result === 'string' 
          ? JSON.parse(data.result) 
          : data.result;
          
        return {
          id: data.id || resultData.id,
          created_at: data.created_at || resultData.created_at,
          assessment_id: data.assessment_id || resultData.assessment_id,
          overview: data.overview || resultData.overview || "",
          traits: data.traits || resultData.traits || [],
          intelligence: data.intelligence || resultData.intelligence || {},
          intelligenceScore: data.intelligence_score || resultData.intelligenceScore || 0,
          emotionalIntelligenceScore: data.emotional_intelligence_score || resultData.emotionalIntelligenceScore || 0,
          motivators: data.motivators || resultData.motivators || [],
          inhibitors: data.inhibitors || resultData.inhibitors || [],
          growthAreas: data.growth_areas || resultData.growthAreas || [],
          weaknesses: data.weaknesses || resultData.weaknesses || [],
          relationshipPatterns: data.relationship_patterns || resultData.relationshipPatterns || {},
          careerSuggestions: data.career_suggestions || resultData.careerSuggestions || [],
          roadmap: data.roadmap || resultData.roadmap || "",
          learningPathways: data.learning_pathways || resultData.learningPathways || []
        } as ComprehensiveAnalysis;
      }
      
      // Generic conversion as fallback
      return {
        id: data.id || "",
        created_at: data.created_at || new Date().toISOString(),
        assessment_id: data.assessment_id || assessmentId || "",
        overview: data.overview || "",
        traits: Array.isArray(data.traits) ? data.traits : [],
        intelligence: data.intelligence || {},
        intelligenceScore: Number(data.intelligence_score || 0),
        emotionalIntelligenceScore: Number(data.emotional_intelligence_score || 0),
        motivators: Array.isArray(data.motivators) ? data.motivators : [],
        inhibitors: Array.isArray(data.inhibitors) ? data.inhibitors : [],
        growthAreas: Array.isArray(data.growth_areas) ? data.growth_areas : [],
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
        relationshipPatterns: data.relationship_patterns || {},
        careerSuggestions: Array.isArray(data.career_suggestions) ? data.career_suggestions : [],
        roadmap: data.roadmap || "",
        learningPathways: Array.isArray(data.learning_pathways) ? data.learning_pathways : []
      } as ComprehensiveAnalysis;
    } catch (err) {
      console.error("Error converting data to analysis:", err);
      setConversionError(err instanceof Error ? err.message : "Unknown conversion error");
      return null;
    }
  }, [assessmentId]);
  
  // Function to poll for analysis completion
  const pollForAnalysis = useCallback(async (id: string, maxAttempts = 5) => {
    if (!id) return null;
    
    setIsPolling(true);
    setHasAttemptedPolling(true);
    
    try {
      // Comprehensive search for existing analysis using multiple methods
      
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
      
      // Method 2: Check if analysis exists with assessment ID
      const { data: byAssessmentId, error: assessmentError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('assessment_id', id)
        .maybeSingle();
      
      if (assessmentError) {
        console.log("Error checking for existing analysis by assessment ID:", assessmentError);
      }
      
      if (byAssessmentId) {
        console.log("Found existing analysis for assessment ID:", id);
        const analysis = convertToAnalysis(byAssessmentId);
        if (analysis) {
          setFoundAnalysis(analysis);
          setIsPolling(false);
          toast.success("Analysis found via assessment ID!");
          return analysis;
        }
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
        
        // Check by assessment ID
        const { data: checkByAssessment } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .eq('assessment_id', id)
          .maybeSingle();
          
        if (checkByAssessment) {
          console.log("Analysis found by assessment ID match on attempt", attempts);
          const analysis = convertToAnalysis(checkByAssessment);
          if (analysis) {
            setFoundAnalysis(analysis);
            setIsPolling(false);
            toast.success("Analysis completed!", { id: `poll-analysis-${id}` });
            return;
          }
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
