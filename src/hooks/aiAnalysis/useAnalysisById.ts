
import { useState } from 'react';
import { PersonalityAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { convertToPersonalityAnalysis } from './utils';
import { toast } from "sonner";

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

      // Try direct public query first (simplest approach)
      const { data, error: queryError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (queryError) {
        console.error("Public query error:", queryError);
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
      
      // If we get here, we couldn't retrieve the analysis
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
