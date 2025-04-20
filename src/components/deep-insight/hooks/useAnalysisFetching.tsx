
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DeepInsightAnalysis } from "../types/deepInsight";

export const useAnalysisFetching = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<DeepInsightAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchAnalysis = useCallback(async () => {
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
        const analysisData = data[0] as unknown as DeepInsightAnalysis;
        setAnalysis(analysisData);
        
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
          
        console.log("Analysis status:", { 
          isProcessing, 
          hasValidCoreTraits: hasValidCoreTraits || "Processing...",
          hasOverview: !!analysisData.overview,
          overview: analysisData.overview?.substring(0, 50) + "..."
        });
        
        if (isProcessing || !hasValidCoreTraits) {
          const errorMessage = isProcessing 
            ? "Your analysis is still being processed. Please check back in a few minutes." 
            : "Your analysis is incomplete. We're working to finalize your results.";
          
          setError(errorMessage);
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
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchAnalysis();
  }, [user, fetchAnalysis]);
  
  // Auto-retry logic for processing analyses
  useEffect(() => {
    let timeoutId: number | undefined;
    
    // Only set up auto-retry if:
    // 1. We have an analysis
    // 2. There's an error indicating "processing"
    // 3. We haven't exceeded 5 retries
    if (analysis && 
        error && 
        error.includes("processing") && 
        retryCount < 5) {
      
      const retryDelay = Math.min(10000 + (retryCount * 5000), 30000); // Progressive backoff
      
      console.log(`Setting up auto-retry #${retryCount + 1} in ${retryDelay/1000} seconds`);
      
      timeoutId = setTimeout(() => {
        console.log(`Executing auto-retry #${retryCount + 1}`);
        fetchAnalysis();
        setRetryCount(prev => prev + 1);
      }, retryDelay);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [analysis, error, retryCount, fetchAnalysis]);

  return { analysis, loading, error, fetchAnalysis };
};
