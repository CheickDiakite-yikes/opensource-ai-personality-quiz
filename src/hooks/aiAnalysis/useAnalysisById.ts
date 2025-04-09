
import { useState } from 'react';
import { PersonalityAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { convertToPersonalityAnalysis } from './utils';

// Cache for shared analyses to improve performance
const analysisCache = new Map<string, {data: PersonalityAnalysis, timestamp: number}>();

export const useAnalysisById = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get analysis by ID (for shared profiles)
  const getAnalysisById = async (id: string): Promise<PersonalityAnalysis | null> => {
    if (!id) {
      console.error("No analysis ID provided");
      setError("Missing analysis ID");
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching shared analysis with ID:", id);
      
      // Check cache first (valid for 5 minutes)
      const now = Date.now();
      const cachedEntry = analysisCache.get(id);
      if (cachedEntry && now - cachedEntry.timestamp < 5 * 60 * 1000) {
        console.log("Returning cached analysis");
        setIsLoading(false);
        return cachedEntry.data;
      }

      // First approach: try getting the analysis directly with no auth required
      // This table should have public RLS policies for viewing shared profiles
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!analysisError && analysisData) {
        console.log("Successfully retrieved analysis:", analysisData.id);
        const analysis = convertToPersonalityAnalysis(analysisData);
        
        if (analysis && analysis.id) {
          // Cache the result
          analysisCache.set(id, {data: analysis, timestamp: now});
          setIsLoading(false);
          return analysis;
        }
      }
      
      // Second approach: use get_analysis_by_id function which should be public
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_analysis_by_id', { analysis_id: id });
        
      if (!functionError && functionData) {
        console.log("Retrieved analysis via function:", id);
        const analysis = convertToPersonalityAnalysis(functionData);
        
        if (analysis && analysis.id) {
          // Cache the result
          analysisCache.set(id, {data: analysis, timestamp: now});
          setIsLoading(false);
          return analysis;
        }
      }
      
      // Last resort - try anonymous/public matching
      const { data, error: publicError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (!publicError && data) {
        console.log("Retrieved public analysis:", id);
        const analysis = convertToPersonalityAnalysis(data);
        
        if (analysis && analysis.id) {
          // Cache the result
          analysisCache.set(id, {data: analysis, timestamp: now});
          setIsLoading(false);
          return analysis;
        }
      }
      
      // If we reach here, log all errors to help diagnose
      if (analysisError) console.error("Direct query error:", analysisError);
      if (functionError) console.error("Function error:", functionError);
      if (publicError) console.error("Public query error:", publicError);
      
      throw new Error("Analysis data not found or not accessible");
      
    } catch (error) {
      console.error("Error fetching analysis by ID:", error);
      setError(error instanceof Error ? error.message : "Failed to retrieve analysis");
      setIsLoading(false);
      return null;
    }
  };

  return {
    getAnalysisById,
    isLoadingAnalysisById: isLoading,
    analysisError: error
  };
};
