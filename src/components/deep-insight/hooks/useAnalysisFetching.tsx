
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DeepInsightAnalysis } from "../types/deepInsight";
import { Json } from "@/utils/types";

export const useAnalysisFetching = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<DeepInsightAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  const fetchAnalysis = async () => {
    if (!user) {
      setError("You must be logged in to view your analysis");
      setLoading(false);
      return;
    }
    
    // Prevent excessive API calls (throttle to once per 3 seconds)
    const now = Date.now();
    if (now - lastFetchTime < 3000 && !loading) {
      console.log("Throttling API calls - waiting before fetching again");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setLastFetchTime(now);
      
      console.log("Fetching Deep Insight analysis for user:", user.id);
      
      const { data, error } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Supabase error fetching analysis:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Analysis data found:", data[0].id);
        
        // Cast the Supabase data to match our interface
        const analysisData = data[0] as unknown as DeepInsightAnalysis;
        
        // Check if data is actually valid - don't provide defaults
        if (!analysisData.overview || !analysisData.core_traits || 
            analysisData.error_occurred || !analysisData.cognitive_patterning) {
          
          setAnalysis(analysisData); // Still set the analysis so we can show what we have
          setError("Analysis is incomplete or contains errors. We're showing the available data.");
          return;
        }
        
        // Store the analysis data
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
  };

  // Fetch analysis on initial load
  useEffect(() => {
    fetchAnalysis();
  }, [user?.id]); // Only refetch when user ID changes

  return { analysis, loading, error, fetchAnalysis };
};
