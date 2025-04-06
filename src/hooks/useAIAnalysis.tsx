
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { PersonalityAnalysis, PersonalityTrait, IntelligenceType, RelationshipPatterns } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { convertToPersonalityAnalysis } from './aiAnalysis/utils';

// Cache for shared analysis to prevent redundant fetches
const analysisCache: Record<string, PersonalityAnalysis> = {};

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const {
    analysis,
    isLoading,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis
  } = useAIAnalysisCore();

  // Add function to get analysis by ID (for shared profiles)
  const getAnalysisById = async (id: string): Promise<PersonalityAnalysis | null> => {
    // Check cache first to prevent redundant fetches
    if (analysisCache[id]) {
      console.log("Returning cached analysis for ID:", id);
      return analysisCache[id];
    }
    
    try {
      console.log("Fetching analysis from Supabase with ID:", id);
      
      // Fetch analysis directly from Supabase without requiring authentication
      // This works because we have a policy allowing public SELECT access
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();  // Changed from .single() to avoid not_found errors
      
      if (error) {
        console.error("Error fetching shared analysis:", error);
        return null;
      }
      
      if (!data) {
        console.log("No data found for analysis ID:", id);
        return null;
      }
      
      console.log("Successfully retrieved analysis data:", data);
      
      // Use the utility function to safely convert Supabase data to PersonalityAnalysis
      const result = convertToPersonalityAnalysis(data);
      
      // Additional validation to make sure we have the critical data needed for display
      if (!result.traits || !result.intelligence) {
        console.error("Converted analysis is missing critical data:", result);
      } else {
        // Store in cache to prevent redundant fetches
        analysisCache[id] = result;
      }
      
      return result;
    } catch (error) {
      console.error("Exception in getAnalysisById:", error);
      return null;
    }
  };

  return {
    analysis,
    isLoading,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    getAnalysisById
  };
};
