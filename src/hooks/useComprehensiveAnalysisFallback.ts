
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useComprehensiveAnalysisFallback = (assessmentId: string | undefined) => {
  const { user } = useAuth();
  const [isPolling, setIsPolling] = useState(false);
  const [foundAnalysis, setFoundAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [hasAttemptedPolling, setHasAttemptedPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  
  // Function to poll for analysis completion
  const pollForAnalysis = useCallback(async (id: string, maxAttempts = 5) => {
    if (!id || hasAttemptedPolling) return null;
    
    setIsPolling(true);
    setHasAttemptedPolling(true);
    
    try {
      // First, check if analysis already exists using flexible query
      const { data: existingAnalysis, error: existingError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .or(`id.eq.${id},assessment_id.eq.${id}`)
        .maybeSingle();
      
      if (existingError) {
        console.log("Error checking for existing analysis:", existingError);
      }
      
      if (existingAnalysis) {
        console.log("Found existing analysis for assessment:", id);
        setFoundAnalysis(existingAnalysis as unknown as ComprehensiveAnalysis);
        setSavedAnalysisId(existingAnalysis.id);
        setIsPolling(false);
        toast.success("Analysis found!");
        return existingAnalysis;
      }
      
      // If not found, try to trigger analysis
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
              
              // Try to analyze the responses - NEVER use mock data here
              const { data: analysisResult, error: analysisError } = await supabase.functions.invoke(
                "analyze-comprehensive-responses",
                {
                  body: { 
                    assessmentId: id,
                    userId: user?.id,
                    responses: assessmentData.responses,
                    useMockData: false // Explicitly prevent mock data usage
                  }
                }
              );

              if (analysisError) {
                console.error("Error invoking analysis function:", analysisError);
              } else if (analysisResult?.analysisId) {
                setSavedAnalysisId(analysisResult.analysisId);
                console.log("Analysis triggered successfully, ID:", analysisResult.analysisId);
              }
            }
          } catch (err) {
            console.error("Error triggering analysis:", err);
          }
        }
        
        // Check if analysis exists now, using more flexible query
        const { data: analysis } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .or(`id.eq.${id},assessment_id.eq.${id}${savedAnalysisId ? `,id.eq.${savedAnalysisId}` : ''}`)
          .maybeSingle();
        
        if (analysis) {
          console.log("Analysis completed for assessment:", id);
          toast.success("Analysis completed!", { id: `poll-analysis-${id}` });
          setFoundAnalysis(analysis as unknown as ComprehensiveAnalysis);
          setIsPolling(false);
          return;
        }
        
        toast.loading(`Processing your assessment (${attempts}/${maxAttempts})...`, { id: `poll-analysis-${id}` });
        
        // Wait before next polling attempt with exponential backoff
        const delay = Math.min(2000 * Math.pow(1.5, attempts - 1), 10000); // Max 10 seconds
        setTimeout(() => {
          poll();
        }, delay);
      };
      
      // Start polling
      poll();
      
    } catch (error) {
      console.error("Error in pollForAnalysis:", error);
      toast.error("Error retrieving analysis");
      setIsPolling(false);
      return null;
    }
  }, [hasAttemptedPolling, user, savedAnalysisId]);
  
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
    savedAnalysisId
  };
};
