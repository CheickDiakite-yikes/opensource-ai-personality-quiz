
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
  
  const fetchAnalysis = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
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
        
        // Store the full analysis data
        setAnalysis(data[0] as unknown as DeepInsightAnalysis);
        
        // Check for processing status
        if (data[0].complete_analysis && 
            typeof data[0].complete_analysis === 'object' &&
            data[0].complete_analysis !== null &&
            'status' in data[0].complete_analysis && 
            data[0].complete_analysis.status === 'processing') {
          
          console.log("Analysis is still being processed");
          setError("Your analysis is still being processed. Please check back in a few minutes.");
        } 
        // Check for incomplete data
        else if (!data[0].overview || 
            data[0].overview.includes("processing") || 
            !data[0].core_traits || 
            (typeof data[0].core_traits === 'object' && 
             data[0].core_traits !== null &&
             (!('primary' in data[0].core_traits) || !data[0].core_traits.primary))) {
          
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

  useEffect(() => {
    fetchAnalysis();
  }, [user]);

  return { analysis, loading, error, fetchAnalysis };
};
