
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DeepInsightAnalysis } from "../types/deepInsight";
import { toast } from "sonner";

export const useAnalysisFetching = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<DeepInsightAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  const fetchAnalysis = useCallback(async () => {
    if (!user) {
      setError("You must be logged in to view your analysis");
      setLoading(false);
      return;
    }
    
    // Prevent excessive API calls (throttle to once per 2 seconds)
    const now = Date.now();
    if (now - lastFetchTime < 2000 && !loading) {
      console.log("Throttling API calls - waiting before fetching again");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setLastFetchTime(now);
      
      console.log("Fetching Deep Insight analysis for user:", user.id);
      
      const { data: analyses, error } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Supabase error fetching analysis:", error);
        throw error;
      }
      
      if (analyses && analyses.length > 0) {
        console.log("Analysis data found:", analyses[0].id);
        
        // Check if there are processing errors stored in the complete_analysis field
        const analysisData = analyses[0] as DeepInsightAnalysis;
        
        // Validate response content to ensure we have quality data
        const isDataComplete = analysisData.core_traits && 
                              analysisData.cognitive_patterning && 
                              analysisData.emotional_architecture &&
                              analysisData.interpersonal_dynamics &&
                              analysisData.growth_potential;
                              
        if (!isDataComplete) {
          console.warn("Analysis data is incomplete or missing key sections");
        }
        
        if (analysisData.complete_analysis && 
            analysisData.complete_analysis.error_occurred === true) {
          // Set error message from the complete_analysis field
          setError(`Analysis processing incomplete: ${analysisData.complete_analysis.error_message || "Unknown error"}`);
        } else if (!analysisData.overview || analysisData.overview.length < 30) {
          setError("Analysis results appear to be incomplete. The system may still be processing your data.");
        } else {
          setError(null);
        }
        
        setAnalysis(analysisData);
      } else {
        console.log("No analysis found for user");
        setError("No analysis found. Please complete the assessment first.");
        setAnalysis(null);
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError("Failed to load analysis. Please try again later.");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [user, lastFetchTime, loading]);

  // Fetch analysis on initial load
  useEffect(() => {
    if (user?.id) {
      fetchAnalysis();
    }
  }, [user?.id, fetchAnalysis]);

  // Poll for updates if there was an error or incomplete data
  useEffect(() => {
    let pollingInterval: number | undefined;
    
    if ((error || (analysis?.complete_analysis?.status === 'processing')) && user?.id) {
      // Poll every 10 seconds if we're waiting for processing to complete
      pollingInterval = window.setInterval(() => {
        console.log("Polling for updated analysis results...");
        fetchAnalysis();
      }, 10000) as unknown as number;
    }
    
    return () => {
      if (pollingInterval) {
        window.clearInterval(pollingInterval);
      }
    };
  }, [error, analysis, user?.id, fetchAnalysis]);

  return { analysis, loading, error, fetchAnalysis };
};
