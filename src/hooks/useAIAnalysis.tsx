
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
          if (!result.traits || !result.traits.length || !result.intelligence) {
            console.error("Analysis has missing or incomplete critical data:", result);
            
            // If traits array exists but is empty or has fewer than expected items, initialize with placeholder
            if (!result.traits || result.traits.length < 1) {
              result.traits = [{
                trait: "Analysis Incomplete", 
                score: 5, 
                description: "The analysis process didn't generate enough trait data. Consider retaking the assessment.",
                strengths: ["Not available"],
                challenges: ["Not available"],
                growthSuggestions: ["Consider retaking the assessment"]
              }];
              console.log("Added placeholder trait for incomplete analysis");
            }
            
            // Ensure intelligence object exists
            if (!result.intelligence) {
              result.intelligence = {
                type: "Analysis Incomplete",
                score: 5,
                description: "The intelligence analysis was incomplete.",
                domains: [{
                  name: "General Intelligence",
                  score: 5,
                  description: "Intelligence data was incomplete in this analysis."
                }]
              };
              console.log("Added placeholder intelligence data for incomplete analysis");
            }
          }
          
          // Ensure all required fields exist
          result.overview = result.overview || "Analysis overview was not generated properly.";
          result.intelligenceScore = result.intelligenceScore || 50;
          result.emotionalIntelligenceScore = result.emotionalIntelligenceScore || 50;
          
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
        description: error instanceof Error ? error.message : "Unknown error"
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
