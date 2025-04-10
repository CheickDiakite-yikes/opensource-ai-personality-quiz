
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

      // APPROACH 1: Try direct table access with anonymous user
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
      
      // APPROACH 2: Try the public Edge Function
      try {
        // Call the edge function using Supabase functions.invoke
        console.log("Calling Edge Function for analysis:", id);
        
        // Fix: Use params instead of query (which isn't in the type definition)
        const { data, error } = await supabase.functions.invoke('get-public-analysis', {
          method: 'GET',
          params: { id }
        });
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(`Edge function error: ${error.message || 'Unknown error'}`);
        }
        
        if (data) {
          console.log("Retrieved analysis via Edge Function:", id);
          const analysis = convertToPersonalityAnalysis(data);
          
          if (analysis && analysis.id) {
            // Cache the result
            analysisCache.set(id, {data: analysis, timestamp: now});
            setIsLoading(false);
            return analysis;
          }
        }
      } catch (restError) {
        console.error("Edge Function error:", restError);
      }
      
      throw new Error("Analysis data not found or not publicly accessible");
      
    } catch (error) {
      console.error("Error fetching analysis by ID:", error);
      setError(error instanceof Error ? error.message : "Failed to retrieve analysis");
      setIsLoading(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAnalysisById,
    isLoadingAnalysisById: isLoading,
    analysisError: error
  };
};
