
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ComprehensiveAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useReportFetching = (id: string | undefined) => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Enhanced function to fetch comprehensive analysis with better error handling
  const fetchComprehensiveAnalysis = useCallback(async (analysisId: string) => {
    if (!analysisId) {
      setError("No analysis ID provided");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo(null);
      
      console.log(`Fetching comprehensive analysis with ID: ${analysisId}`);
      
      // Call the edge function to get the comprehensive analysis
      const { data, error: functionError } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          body: { id: analysisId },
        }
      );

      if (functionError) {
        console.error("Function error:", functionError);
        throw new Error(`Edge function error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error("No analysis data returned from edge function");
      }

      console.log("Comprehensive analysis data:", data);
      
      // Check for message indicating fallback to most recent analysis
      if (data.message) {
        toast.info(data.message);
      }
      
      return data as ComprehensiveAnalysis;
    } catch (err) {
      console.error("Error fetching comprehensive analysis:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load analysis";
      setError(errorMessage);
      setDebugInfo(JSON.stringify(err, null, 2));
      
      toast.error("Failed to load analysis", {
        description: "There was a problem retrieving your comprehensive analysis"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch comprehensive analysis
  useEffect(() => {
    async function loadAnalysis() {
      if (!id) {
        setIsLoading(false);
        setError("No analysis ID provided");
        return;
      }

      const data = await fetchComprehensiveAnalysis(id);
      if (data) {
        setAnalysis(data);
      }
    }

    loadAnalysis();
  }, [id, retryCount, fetchComprehensiveAnalysis]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    toast.loading("Retrying analysis load...");
  }, []);
  
  const handleGoBack = useCallback(() => {
    navigate('/comprehensive-report');
  }, [navigate]);

  return {
    analysis,
    isLoading,
    error,
    debugInfo,
    handleRetry,
    handleGoBack
  };
};
