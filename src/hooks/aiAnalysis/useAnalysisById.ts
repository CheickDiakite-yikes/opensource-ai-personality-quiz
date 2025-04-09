
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

      // Try to get analysis directly from the analyses table
      // This table should have public RLS policies for viewing shared profiles
      const { data, error: queryError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (queryError) {
        console.error("Error fetching analysis:", queryError);
        throw queryError;
      }
      
      if (data) {
        console.log("Successfully retrieved analysis:", data.id);
        const analysis = convertToPersonalityAnalysis(data);
        
        if (analysis && analysis.id) {
          // Cache the result
          analysisCache.set(id, {data: analysis, timestamp: now});
          setIsLoading(false);
          return analysis;
        }
      }
      
      // If we reach here, try using the get_analysis_by_id function as fallback
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_analysis_by_id', { analysis_id: id });
        
      if (functionError) {
        console.error("Function error:", functionError);
        throw functionError;
      }
      
      if (functionData && typeof functionData === 'object') {
        console.log("Retrieved analysis via function:", id);
        const analysis = convertToPersonalityAnalysis(functionData);
        
        if (analysis && analysis.id) {
          // Cache the result
          analysisCache.set(id, {data: analysis, timestamp: now});
          setIsLoading(false);
          return analysis;
        }
      }
      
      throw new Error("Analysis data not found or invalid");
      
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
