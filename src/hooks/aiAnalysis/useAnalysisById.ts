
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

      // MAIN APPROACH: Use the publicly available get_analysis_by_id function
      // This is specifically designed to work without authentication
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_analysis_by_id', { analysis_id: id })
        .single();
        
      if (!functionError && functionData) {
        console.log("Retrieved analysis via public function:", id);
        const analysis = convertToPersonalityAnalysis(functionData);
        
        if (analysis && analysis.id) {
          // Cache the result
          analysisCache.set(id, {data: analysis, timestamp: now});
          setIsLoading(false);
          return analysis;
        }
      } else if (functionError) {
        console.error("Public function error:", functionError);
      }
      
      // FALLBACK APPROACH: Direct table access with anonymous user
      // This should work if proper RLS policies are in place
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (!analysisError && analysisData) {
        console.log("Successfully retrieved analysis via direct table access:", analysisData.id);
        const analysis = convertToPersonalityAnalysis(analysisData);
        
        if (analysis && analysis.id) {
          // Cache the result
          analysisCache.set(id, {data: analysis, timestamp: now});
          setIsLoading(false);
          return analysis;
        }
      } else if (analysisError) {
        console.error("Direct table access error:", analysisError);
      }
      
      // EMERGENCY APPROACH: Try anonymous viewing endpoint
      // This is a last resort if other methods fail
      try {
        // Make a direct REST API call as a last resort
        // Instead of using protected properties, use environment variables or public URL
        const url = `${window.location.origin}/.supabase/functions/get-public-analysis`;
        const response = await fetch(`${url}?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data) {
            console.log("Retrieved analysis via emergency API access:", id);
            const analysis = convertToPersonalityAnalysis(data);
            
            if (analysis && analysis.id) {
              // Cache the result
              analysisCache.set(id, {data: analysis, timestamp: now});
              setIsLoading(false);
              return analysis;
            }
          }
        }
      } catch (restError) {
        console.error("Emergency REST API error:", restError);
      }
      
      throw new Error("Analysis data not found or not publicly accessible");
      
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
