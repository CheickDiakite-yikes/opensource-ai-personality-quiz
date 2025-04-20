
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
      
      const { data, error } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setAnalysis(data[0] as unknown as DeepInsightAnalysis);
        
        const analysisData = data[0];
        
        // Check if the analysis is still processing or incomplete
        const isProcessing = 
          (typeof analysisData.complete_analysis === 'object' && 
          analysisData.complete_analysis !== null &&
          'status' in analysisData.complete_analysis && 
          analysisData.complete_analysis.status === 'processing') ||
          !analysisData.overview || 
          analysisData.overview.includes("processing");
          
        // Check for core traits availability
        const hasValidCoreTraits = 
          analysisData.core_traits && 
          typeof analysisData.core_traits === 'object' && 
          analysisData.core_traits !== null &&
          'primary' in analysisData.core_traits && 
          analysisData.core_traits.primary;
          
        if (isProcessing || !hasValidCoreTraits) {
          const errorMessage = isProcessing 
            ? "Your analysis is still being processed. Please check back in a few minutes." 
            : "Your analysis is incomplete. We're working to finalize your results.";
          
          setError(errorMessage);
          console.log("Analysis status:", { 
            isProcessing, 
            hasValidCoreTraits,
            hasOverview: !!analysisData.overview,
            overview: analysisData.overview?.substring(0, 50) + "..."
          });
        }
      } else {
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
