
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { PersonalityAnalysis } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { convertToPersonalityAnalysis } from './aiAnalysis/utils';
import { toast } from 'sonner';

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

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const {
    analysis,
    isLoading,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    fetchAnalysesFromSupabase,
    loadAllAnalysesFromSupabase
  } = useAIAnalysisCore();

  // Add function to get analysis by ID (for shared profiles)
  const getAnalysisById = async (id: string): Promise<PersonalityAnalysis | null> => {
    // Clean up old cache entries periodically
    cleanupCache();
    
    // Check cache first to prevent redundant fetches
    if (analysisCache.has(id)) {
      console.log("Returning cached analysis for ID:", id);
      return analysisCache.get(id)?.data || null;
    }
    
    try {
      console.log("Fetching analysis from Supabase with ID:", id);
      
      // Using a timeout promise to prevent hanging requests
      const fetchTimeout = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn("Analysis fetch timed out after 30 seconds");
          resolve(null);
        }, 30000); // Increased timeout from 15s to 30s
      });
      
      // Fetch analysis directly from Supabase without requiring authentication
      const fetchPromise = new Promise<PersonalityAnalysis | null>(async (resolve) => {
        try {
          // First try getting data directly from the analyses table
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
          
          // Safely check if traits exist and is an array before accessing length property
          if (data.traits && Array.isArray(data.traits)) {
            console.log("Analysis traits count:", data.traits.length);
          } else {
            console.log("Analysis traits are missing or not an array");
          }
          
          console.log("Intelligence data present:", !!data.intelligence);
          
          // Use the utility function to safely convert Supabase data to PersonalityAnalysis
          const result = convertToPersonalityAnalysis(data);
          
          // Additional validation to make sure we have the critical data needed for display
          // Add proper type checking for traits to ensure we safely access length property
          if (!result.traits || !Array.isArray(result.traits) || result.traits.length < 2 || !result.intelligence) {
            console.warn("Analysis has missing or incomplete critical data:", 
              `traits: ${Array.isArray(result.traits) ? result.traits.length : 'not an array'}, intelligence present: ${!!result.intelligence}`);
            
            // If traits array exists but has fewer than expected items, provide feedback about incomplete analysis
            if (!result.traits || !Array.isArray(result.traits) || result.traits.length < 2) {
              // Initialize traits as an empty array if it's not already an array
              result.traits = Array.isArray(result.traits) ? [...result.traits] : [];
              
              // If there's at least one trait, keep it
              if (result.traits.length === 0) {
                result.traits = [{
                  trait: "Analysis Incomplete", 
                  score: 5, 
                  description: "The analysis process didn't generate enough trait data. This typically happens when the AI model doesn't receive enough detailed responses.",
                  strengths: ["Not available - incomplete analysis"],
                  challenges: ["Not available - incomplete analysis"],
                  growthSuggestions: ["Consider retaking the assessment with more detailed answers"]
                }];
              }
              
              // Add a note about the analysis being incomplete
              result.traits.push({
                trait: "Analysis Note", 
                score: 0, 
                description: "We expected 8-12 personality traits but only found " + result.traits.length + ". The analysis may be incomplete.",
                strengths: ["Try the Fix Analysis button or retake the assessment"],
                challenges: ["Analysis data is incomplete"],
                growthSuggestions: ["Provide more detailed answers in your assessment"]
              });
              
              console.log("Added informational trait about incomplete analysis");
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
    getAnalysisById,
    fetchAnalysesFromSupabase,
    loadAllAnalysesFromSupabase
  };
};
