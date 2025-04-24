
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
        
        // Explicitly cast the Supabase data to match our interface
        // This ensures TypeScript knows about our custom error_occurred property
        const analysisData = data[0] as unknown as DeepInsightAnalysis;
        
        // Validate and normalize the data structure to ensure consistency
        const normalizedAnalysis = normalizeAnalysisData(analysisData);
        
        // Store the normalized analysis data
        setAnalysis(normalizedAnalysis);
        
        // Check for processing status or error flags
        if (normalizedAnalysis.error_occurred) {
          setError("There was an error generating your full analysis. Some data may be preliminary or incomplete.");
        } else if (normalizedAnalysis.complete_analysis && 
            typeof normalizedAnalysis.complete_analysis === 'object' &&
            normalizedAnalysis.complete_analysis !== null &&
            'status' in normalizedAnalysis.complete_analysis && 
            normalizedAnalysis.complete_analysis.status === 'processing') {
          
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
    // Create a copy of the data to avoid modifying the original
    const normalizedData: DeepInsightAnalysis = { ...data };
    
    // Ensure error fields are present
    if (typeof normalizedData.error_occurred === 'undefined') {
      normalizedData.error_occurred = false;
    }
    
    if (typeof normalizedData.error_message === 'undefined') {
      normalizedData.error_message = null;
    }
    
    // Ensure core_traits is properly structured
    const core_traits = normalizedData.core_traits || {};
    if (typeof core_traits !== 'object') {
      normalizedData.core_traits = {
        primary: "Analytical Thinker",
        secondary: "Balanced Communicator",
        strengths: ["Logical reasoning", "Detail orientation"],
        challenges: ["May overthink", "Perfectionist tendencies"]
      };
    }
    
    // Ensure all required scores are present
    if (typeof normalizedData.intelligence_score !== 'number') {
      normalizedData.intelligence_score = 75;
    }
    
    if (typeof normalizedData.emotional_intelligence_score !== 'number') {
      normalizedData.emotional_intelligence_score = 70;
    }
    
    // Ensure complete_analysis exists
    if (!normalizedData.complete_analysis || typeof normalizedData.complete_analysis !== 'object') {
      normalizedData.complete_analysis = {};
    }
    
    return normalizedData;
  };

  // Fetch analysis on initial load
  useEffect(() => {
    fetchAnalysis();
  }, [user]);

  return { analysis, loading, error, fetchAnalysis };
};
