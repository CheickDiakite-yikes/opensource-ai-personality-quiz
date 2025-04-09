
import { useState } from 'react';
import { PersonalityAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { convertToPersonalityAnalysis } from './utils';
import { toast } from "sonner";

// Cache for shared analysis to prevent redundant fetches
// Using a Map for better memory management with object keys
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

  // Function to get analysis by ID (for shared profiles)
  const getAnalysisById = async (id: string): Promise<PersonalityAnalysis | null> => {
    setIsLoading(true);
    
    try {
      // Clean up old cache entries periodically
      cleanupCache();
      
      // Check cache first to prevent redundant fetches
      if (analysisCache.has(id)) {
        console.log("Returning cached analysis for ID:", id);
        setIsLoading(false);
        return analysisCache.get(id)?.data || null;
      }
      
      console.log("Fetching analysis from Supabase with ID:", id);
      
      // Using a timeout promise to prevent hanging requests
      const fetchTimeout = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn("Analysis fetch timed out after 30 seconds");
          resolve(null);
        }, 30000); // 30 second timeout
      });
      
      // Fetch analysis directly from Supabase without requiring authentication
      const fetchPromise = new Promise<PersonalityAnalysis | null>(async (resolve) => {
        try {
          // First try the RPC function approach - most reliable for public access
          console.log("Trying RPC function first for better public access");
          const { data: rpcData, error: rpcError } = await supabase
            .rpc<any, { analysis_id: string }>('get_analysis_by_id', { analysis_id: id });
          
          if (!rpcError && rpcData) {
            console.log("Successfully retrieved analysis via RPC:", rpcData.id || id);
            const convertedAnalysis = convertToPersonalityAnalysis(rpcData);
            resolve(convertedAnalysis);
            return;
          }
          
          console.log("RPC approach failed, trying direct table query");
          
          // Try getting data directly from the analyses table
          const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (error) {
            console.error("Error fetching shared analysis:", error);
            
            // If there's an error, try a second approach with the raw result field
            const { data: rawData, error: rawError } = await supabase
              .from('analyses')
              .select('id, created_at, user_id, assessment_id, result')
              .eq('id', id)
              .maybeSingle();
              
            if (rawError) {
              console.error("Failed with second approach too:", rawError);
              resolve(null);
              return;
            }
            
            if (rawData && rawData.result) {
              console.log("Retrieved analysis using raw result field");
              // Convert raw data to PersonalityAnalysis
              const convertedAnalysis = convertToPersonalityAnalysis(rawData);
              resolve(convertedAnalysis);
              return;
            } else {
              resolve(null);
              return;
            }
          }
          
          if (!data) {
            console.log("No data found for analysis ID:", id);
            resolve(null);
            return;
          }
          
          console.log("Successfully retrieved analysis data:", data.id);
          
          // Use the utility function to safely convert Supabase data to PersonalityAnalysis
          const result = convertToPersonalityAnalysis(data);
          
          // Ensure all required fields exist with fallbacks
          result.overview = result.overview || "Analysis overview was not generated properly.";
          result.intelligenceScore = result.intelligenceScore || 50;
          result.emotionalIntelligenceScore = result.emotionalIntelligenceScore || 50;
          result.valueSystem = result.valueSystem || [];
          result.motivators = result.motivators || [];
          result.careerSuggestions = result.careerSuggestions || [];
          result.growthAreas = result.growthAreas || [];
          
          // Store in cache with timestamp to prevent redundant fetches
          analysisCache.set(id, {data: result, timestamp: Date.now()});
          resolve(result);
        } catch (error) {
          console.error("Exception in getAnalysisById fetch:", error);
          resolve(null);
        }
      });
      
      // Race between fetch and timeout
      const result = await Promise.race([fetchPromise, fetchTimeout]);
      
      if (!result) {
        toast.error("Could not retrieve analysis data", {
          description: "Please check your connection and try again"
        });
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error("Exception in getAnalysisById:", error);
      toast.error("Error retrieving analysis", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      setIsLoading(false);
      return null;
    }
  };

  return {
    getAnalysisById,
    isLoadingAnalysisById: isLoading
  };
};
