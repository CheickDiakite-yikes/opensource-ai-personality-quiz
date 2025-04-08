
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { PersonalityAnalysis } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { convertToPersonalityAnalysis } from './aiAnalysis/utils';
import { toast } from 'sonner';

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
      
      // Using a timeout promise to prevent hanging requests
      const fetchTimeout = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn("Analysis fetch timed out after 15 seconds");
          resolve(null);
        }, 15000);
      });
      
      // Fetch analysis directly from Supabase without requiring authentication
      const fetchPromise = new Promise<PersonalityAnalysis | null>(async (resolve) => {
        try {
          const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (error) {
            console.error("Error fetching shared analysis:", error);
            resolve(null);
            return;
          }
          
          if (!data) {
            console.log("No data found for analysis ID:", id);
            resolve(null);
            return;
          }
          
          console.log("Successfully retrieved analysis data:", data);
          
          // Use the utility function to safely convert Supabase data to PersonalityAnalysis
          const result = convertToPersonalityAnalysis(data);
          
          // Additional validation to make sure we have the critical data needed for display
          if (!result.traits || !result.intelligence) {
            console.error("Converted analysis is missing critical data:", result);
            resolve(null);
            return;
          }
          
          // Store in cache to prevent redundant fetches
          analysisCache[id] = result;
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
      
      return result;
    } catch (error) {
      console.error("Exception in getAnalysisById:", error);
      toast.error("Error retrieving analysis", {
        description: error.message || "Unknown error"
      });
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
