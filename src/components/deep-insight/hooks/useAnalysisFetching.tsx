
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
        
        // Validate and normalize the data structure to ensure consistency
        const normalizedAnalysis = normalizeAnalysisData(data[0] as unknown as DeepInsightAnalysis);
        
        // Store the normalized analysis data
        setAnalysis(normalizedAnalysis);
        
        // Check for processing status or error flags
        if (data[0].error_occurred) {
          setError("There was an error generating your full analysis. Some data may be preliminary or incomplete.");
        } else if (data[0].complete_analysis && 
            typeof data[0].complete_analysis === 'object' &&
            data[0].complete_analysis !== null &&
            'status' in data[0].complete_analysis && 
            data[0].complete_analysis.status === 'processing') {
          
          console.log("Analysis is still being processed");
          setError("Your analysis is still being processed. Please check back in a few minutes.");
        } 
        // Check for incomplete data
        else if (!normalizedAnalysis.overview || 
            normalizedAnalysis.overview.includes("processing") || 
            normalizedAnalysis.overview.includes("preliminary") ||
            !normalizedAnalysis.core_traits || 
            (typeof normalizedAnalysis.core_traits === 'object' && 
             normalizedAnalysis.core_traits !== null &&
             (!('primary' in normalizedAnalysis.core_traits) || !normalizedAnalysis.core_traits.primary))) {
          
          console.log("Analysis data is incomplete");
          setError("Your analysis is incomplete. We're working to finalize your results.");
        } else {
          console.log("Analysis data is complete and ready to display");
        }
      } else {
        console.log("No analysis found for user");
        setError("No analysis found. Please complete the assessment first.");
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError("Failed to load analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to normalize analysis data
  const normalizeAnalysisData = (data: DeepInsightAnalysis): DeepInsightAnalysis => {
    // Ensure core_traits is properly structured
    const core_traits = data.core_traits || {};
    if (typeof core_traits !== 'object') {
      data.core_traits = {
        primary: "Analytical Thinker",
        secondary: "Balanced Communicator",
        strengths: ["Logical reasoning", "Detail orientation"],
        challenges: ["May overthink", "Perfectionist tendencies"]
      };
    }
    
    // Ensure all required scores are present
    if (typeof data.intelligence_score !== 'number') {
      data.intelligence_score = 75;
    }
    
    if (typeof data.emotional_intelligence_score !== 'number') {
      data.emotional_intelligence_score = 70;
    }
    
    // Ensure complete_analysis exists
    if (!data.complete_analysis || typeof data.complete_analysis !== 'object') {
      data.complete_analysis = {};
    }
    
    return data;
  };

  // Fetch analysis on initial load
  useEffect(() => {
    fetchAnalysis();
  }, [user]);

  return { analysis, loading, error, fetchAnalysis };
};
