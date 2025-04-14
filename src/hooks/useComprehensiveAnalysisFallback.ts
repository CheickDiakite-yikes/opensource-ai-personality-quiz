
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis, DbComprehensiveAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { mapDbArrayToComprehensiveAnalyses, mapDbToComprehensiveAnalysis } from '@/utils/dataMappers';

export const useComprehensiveAnalysisFallback = (assessmentId: string | undefined) => {
  const { user } = useAuth();
  const [isPolling, setIsPolling] = useState(false);
  const [foundAnalysis, setFoundAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [hasAttemptedPolling, setHasAttemptedPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  const [reportHistory, setReportHistory] = useState<ComprehensiveAnalysis[]>([]);
  
  // Function to fetch user's report history
  const fetchReportHistory = useCallback(async () => {
    if (!user) return [];
    
    try {
      console.log("Fetching user report history");
      const { data, error } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching report history:", error);
        return [];
      }
      
      console.log(`Fetched ${data?.length || 0} historical reports for user`);
      // CRITICAL FIX: Ensure we map the database data to our application model
      const mappedData = mapDbArrayToComprehensiveAnalyses(data as DbComprehensiveAnalysis[] || []);
      setReportHistory(mappedData);
      return mappedData;
    } catch (err) {
      console.error("Error in fetchReportHistory:", err);
      return [];
    }
  }, [user]);
  
  // Call this on initial load
  useEffect(() => {
    if (user) {
      fetchReportHistory();
    }
  }, [user, fetchReportHistory]);
  
  // Function to poll for analysis completion
  const pollForAnalysis = useCallback(async (id: string, maxAttempts = 15) => {
    if (!id) {
      console.warn("No ID provided for polling");
      return null;
    }
    
    if (hasAttemptedPolling && foundAnalysis) {
      console.log("Already found analysis, not polling again");
      return foundAnalysis;
    }
    
    setIsPolling(true);
    setHasAttemptedPolling(true);
    
    try {
      console.log(`Starting to poll for analysis with ID: ${id}`);
      
      // CRITICAL FIX: First, check if analysis already exists using flexible query
      const { data: existingAnalysis, error: existingError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .or(`id.eq.${id},assessment_id.eq.${id}`)
        .maybeSingle();
      
      if (existingError) {
        console.log("Error checking for existing analysis:", existingError);
      }
      
      if (existingAnalysis) {
        console.log("Found existing analysis directly in database");
        const mappedAnalysis = mapDbToComprehensiveAnalysis(existingAnalysis as DbComprehensiveAnalysis);
        setFoundAnalysis(mappedAnalysis);
        setSavedAnalysisId(existingAnalysis.id);
        setIsPolling(false);
        toast.success("Analysis found!");
        
        // Refresh report history after finding an analysis
        fetchReportHistory();
        return mappedAnalysis;
      }
      
      // If not found immediately, try to trigger analysis and poll for results
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
        
        if (attempts === 1 || attempts % 3 === 0) {
          // On first attempt and every 3rd attempt, try to trigger the analysis
          try {
            // Get the assessment data to pass to the analysis function
            const { data: assessmentData } = await supabase
              .from('comprehensive_assessments')
              .select('*')
              .eq('id', id)
              .maybeSingle();
              
            if (assessmentData?.responses) {
              toast.loading("Analyzing your responses...", { id: `poll-analysis-${id}` });
              
              // Try to analyze the responses with explicit parameters
              const { data: analysisResult, error: analysisError } = await supabase.functions.invoke(
                "analyze-comprehensive-responses",
                {
                  body: { 
                    assessmentId: id,
                    userId: user?.id,
                    responses: assessmentData.responses,
                    useMockData: false, // Explicitly prevent mock data usage
                    forceAssociation: true, // Ensure the analysis is associated with the user
                    retry: true // Indicate this is a retry attempt
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
        
        // CRITICAL FIX: Check different possible ID formats
        const possibleIds = [id];
        if (savedAnalysisId && savedAnalysisId !== id) {
          possibleIds.push(savedAnalysisId);
        }
        
        console.log("Checking for analysis with possible IDs:", possibleIds);
        
        // Try with each possible ID
        let analysisFound = false;
        for (const possibleId of possibleIds) {
          if (analysisFound) break;
          
          try {
            // Try exact ID match
            const { data: analysis } = await supabase
              .from('comprehensive_analyses')
              .select('*')
              .eq('id', possibleId)
              .maybeSingle();
              
            if (analysis) {
              console.log(`Found analysis with ID: ${possibleId}`);
              toast.success("Analysis completed!", { id: `poll-analysis-${id}` });
              const mappedAnalysis = mapDbToComprehensiveAnalysis(analysis as DbComprehensiveAnalysis);
              setFoundAnalysis(mappedAnalysis);
              setIsPolling(false);
              
              // Refresh report history after finding an analysis
              fetchReportHistory();
              analysisFound = true;
              return;
            }
            
            // Try as assessment ID
            const { data: analysisByAssessment } = await supabase
              .from('comprehensive_analyses')
              .select('*')
              .eq('assessment_id', possibleId)
              .maybeSingle();
              
            if (analysisByAssessment) {
              console.log(`Found analysis with assessment ID: ${possibleId}`);
              toast.success("Analysis completed!", { id: `poll-analysis-${id}` });
              const mappedAnalysis = mapDbToComprehensiveAnalysis(analysisByAssessment as DbComprehensiveAnalysis);
              setFoundAnalysis(mappedAnalysis);
              setIsPolling(false);
              
              // Refresh report history after finding an analysis
              fetchReportHistory();
              analysisFound = true;
              return;
            }
            
            // CRITICAL FIX: Try with UUID conversion patterns
            const { data: analysisByVariant } = await supabase
              .rpc('get_comprehensive_analysis_by_id', { analysis_id: possibleId });
              
            if (analysisByVariant) {
              console.log(`Found analysis using RPC function with ID: ${possibleId}`);
              toast.success("Analysis retrieved!", { id: `poll-analysis-${id}` });
              const mappedAnalysis = mapDbToComprehensiveAnalysis(analysisByVariant as any);
              setFoundAnalysis(mappedAnalysis);
              setIsPolling(false);
              fetchReportHistory();
              analysisFound = true;
              return;
            }
          } catch (error) {
            console.error(`Error checking ID ${possibleId}:`, error);
          }
        }
        
        if (!analysisFound) {
          toast.loading(`Processing your assessment (${attempts}/${maxAttempts})...`, { id: `poll-analysis-${id}` });
          
          // Wait before next polling attempt with exponential backoff
          const delay = Math.min(2000 * Math.pow(1.5, attempts - 1), 10000); // Max 10 seconds
          setTimeout(() => {
            poll();
          }, delay);
        }
      };
      
      // Start polling
      poll();
      
    } catch (error) {
      console.error("Error in pollForAnalysis:", error);
      toast.error("Error retrieving analysis");
      setIsPolling(false);
      return null;
    }
  }, [hasAttemptedPolling, user, savedAnalysisId, fetchReportHistory, foundAnalysis]);
  
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
    savedAnalysisId,
    reportHistory,
    fetchReportHistory
  };
};
