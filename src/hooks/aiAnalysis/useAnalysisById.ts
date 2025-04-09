
import { useState, useEffect } from 'react';
import { PersonalityAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { convertToPersonalityAnalysis } from './utils';
import { toast } from "sonner";

// Cache for shared analysis to prevent redundant fetches
const analysisCache = new Map<string, {data: PersonalityAnalysis, timestamp: number}>();

// Helper function to clear old cache entries
const cleanupCache = () => {
  const now = Date.now();
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  
  for (const [id, entry] of analysisCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      analysisCache.delete(id);
    }
  }
};

export const useAnalysisById = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get analysis by ID (for shared profiles)
  const getAnalysisById = async (id: string): Promise<PersonalityAnalysis | null> => {
    if (!id) {
      console.error("SHARED PROFILE: No ID provided");
      setError("Missing analysis ID");
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("SHARED PROFILE: Starting fetch for ID:", id);
      
      // Clean up old cache entries periodically
      cleanupCache();
      
      // Check cache first to prevent redundant fetches
      if (analysisCache.has(id)) {
        console.log("SHARED PROFILE: Returning cached analysis for ID:", id);
        setIsLoading(false);
        return analysisCache.get(id)?.data || null;
      }

      // APPROACH 1: Direct public query with no auth requirements
      console.log("SHARED PROFILE: Trying public direct query");
      const { data: publicData, error: publicError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (publicError) {
        console.error("SHARED PROFILE: Public direct query error:", publicError);
      } else if (publicData) {
        console.log("SHARED PROFILE: Public direct query success with data:", publicData.id);
        try {
          // Use the utility function to safely convert Supabase data
          const analysis = convertToPersonalityAnalysis(publicData);
          if (analysis && analysis.id) {
            console.log("SHARED PROFILE: Successfully converted public query data");
            analysisCache.set(id, {data: analysis, timestamp: Date.now()});
            setIsLoading(false);
            return analysis;
          }
        } catch (conversionError) {
          console.error("SHARED PROFILE: Error converting public query data:", conversionError);
        }
      }
      
      // APPROACH 2: Try with the public function approach as backup
      console.log("SHARED PROFILE: Trying public function approach");
      const { data: publicFnData, error: publicFnError } = await supabase
        .rpc('get_analysis_by_id', { analysis_id: id });
      
      if (publicFnError) {
        console.error("SHARED PROFILE: Public function error:", publicFnError);
      } else if (publicFnData && typeof publicFnData === 'object') {
        console.log("SHARED PROFILE: Public function success with data:", publicFnData);
        try {
          // Safe conversion with type checking
          const analysis = convertToPersonalityAnalysis(publicFnData);
          if (analysis && analysis.id) {
            console.log("SHARED PROFILE: Successfully converted public function data");
            analysisCache.set(id, {data: analysis, timestamp: Date.now()});
            setIsLoading(false);
            return analysis;
          }
        } catch (conversionError) {
          console.error("SHARED PROFILE: Error converting public function data:", conversionError);
        }
      }
      
      // APPROACH 3: Try with minimal fields as last resort
      console.log("SHARED PROFILE: Trying minimal fields approach");
      const { data: minimalData, error: minimalError } = await supabase
        .from('analyses')
        .select('id, created_at, result, traits, intelligence, intelligence_score')
        .eq('id', id)
        .maybeSingle();
      
      if (minimalError) {
        console.error("SHARED PROFILE: Minimal query error:", minimalError);
      } else if (minimalData) {
        console.log("SHARED PROFILE: Minimal query success with data:", minimalData.id);
        try {
          // For raw result data, we might need to modify the conversion
          const analysis = convertToPersonalityAnalysis(minimalData);
          if (analysis && analysis.id) {
            console.log("SHARED PROFILE: Successfully converted minimal query data");
            analysisCache.set(id, {data: analysis, timestamp: Date.now()});
            setIsLoading(false);
            return analysis;
          }
        } catch (conversionError) {
          console.error("SHARED PROFILE: Error converting minimal query data:", conversionError);
        }
      }
      
      // If all approaches fail, report the error
      console.log("SHARED PROFILE: All approaches failed for ID:", id);
      setError(`No analysis found with ID: ${id}`);
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error("SHARED PROFILE: Exception in getAnalysisById:", error);
      setError("Failed to retrieve analysis data");
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
