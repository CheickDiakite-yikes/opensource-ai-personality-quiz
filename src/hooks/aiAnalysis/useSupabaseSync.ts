
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { convertToPersonalityAnalysis } from "./utils";
import { loadAnalysisHistory } from "../analysis/useLocalStorage";
import { toast } from "sonner";

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const MAX_RETRY_ATTEMPTS = 3;

  // Helper function for retrying failed requests with exponential backoff
  const retryWithBackoff = async <T,>(operation: () => Promise<T>, maxRetries = MAX_RETRY_ATTEMPTS): Promise<T> => {
    let attempt = 0;
    
    while (attempt <= maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          throw error;
        }
        
        const delay = Math.pow(2, attempt) * 500; // 1s, 2s, 4s
        console.log(`Retry attempt ${attempt} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // This should never be reached because of the throw above,
    // but TypeScript needs this to ensure a return value
    throw new Error("Max retries exceeded");
  };

  // Fetch analyses from Supabase with improved error handling and logging
  const fetchAnalysesFromSupabase = useCallback(async () => {
    if (!user) return null;
    
    try {
      console.log("Fetching all analyses for user:", user.id);
      
      // First attempt: try to fetch with pagination to get ALL analyses
      let allData = [];
      let page = 0;
      const PAGE_SIZE = 100;
      let hasMoreData = true;
      
      while (hasMoreData) {
        console.log(`Fetching analyses page ${page} (offset: ${page * PAGE_SIZE})`);
        
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
        
        if (error) {
          console.error(`Error fetching analyses page ${page}:`, error);
          break;
        }
        
        if (data && data.length > 0) {
          allData = [...allData, ...data];
          console.log(`Retrieved ${data.length} analyses for page ${page}`);
          
          if (data.length < PAGE_SIZE) {
            hasMoreData = false;
          }
        } else {
          hasMoreData = false;
        }
        
        page++;
      }
      
      if (allData.length === 0) {
        // Fallback to direct query without pagination as last resort
        console.log("No data found with pagination, trying direct query");
        
        const { data: directData, error: directError } = await supabase
          .from('analyses')
          .select('id, created_at, user_id, assessment_id, result, traits')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (directError) {
          console.error("Direct query also failed:", directError);
          throw new Error(`Failed to fetch analyses: ${directError.message}`);
        }
        
        if (directData && directData.length > 0) {
          console.log(`Retrieved ${directData.length} analyses with direct query`);
          return directData;
        } else {
          console.log("No analyses found for user with any query method");
          return [];
        }
      }
      
      console.log(`Successfully retrieved ${allData.length} total analyses`);
      return allData;
    } catch (error) {
      console.error("Error in fetchAnalysesFromSupabase:", error);
      
      // Try one last fallback approach focusing only on ID and assessment_id
      try {
        console.log("Trying minimal fields fallback query");
        const { data: minimalData, error: minimalError } = await supabase
          .from('analyses')
          .select('id, assessment_id, created_at, user_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (minimalError) {
          console.error("Minimal fields query also failed:", minimalError);
          throw error; // Re-throw the original error
        }
        
        if (minimalData && minimalData.length > 0) {
          console.log(`Retrieved ${minimalData.length} minimal analyses records`);
          
          // Now fetch each analysis individually to work around potential data size issues
          const fullAnalyses = [];
          
          for (const item of minimalData) {
            try {
              const { data: singleAnalysis, error: singleError } = await supabase
                .from('analyses')
                .select('*')
                .eq('id', item.id)
                .single();
              
              if (!singleError && singleAnalysis) {
                fullAnalyses.push(singleAnalysis);
              } else {
                console.warn(`Could not fetch full data for analysis ${item.id}:`, singleError);
              }
            } catch (e) {
              console.error(`Exception fetching analysis ${item.id}:`, e);
            }
          }
          
          console.log(`Retrieved ${fullAnalyses.length} full analyses from individual queries`);
          return fullAnalyses;
        }
      } catch (fallbackError) {
        console.error("All fallback approaches failed:", fallbackError);
      }
      
      toast.error("Failed to load your analyses", {
        description: "Please check your connection and try again"
      });
      
      if (retryAttempts < MAX_RETRY_ATTEMPTS) {
        setRetryAttempts(prev => prev + 1);
        const delay = Math.pow(2, retryAttempts) * 1000;
        console.log(`Will retry fetching analyses in ${delay}ms (attempt ${retryAttempts + 1})`);
        
        // We'll return null here instead of retrying immediately to prevent UI blocking
        // The caller should handle retries
        return null;
      }
      
      return null;
    }
  }, [user, retryAttempts]);

  // New function to force fetch a specific analysis by ID
  const fetchAnalysisById = useCallback(async (analysisId: string): Promise<PersonalityAnalysis | null> => {
    if (!analysisId) return null;
    
    try {
      console.log(`Directly fetching analysis with ID: ${analysisId}`);
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .maybeSingle();
      
      if (error) {
        console.error(`Error fetching analysis ${analysisId}:`, error);
        return null;
      }
      
      if (!data) {
        console.log(`No analysis found with ID: ${analysisId}`);
        return null;
      }
      
      return convertToPersonalityAnalysis(data);
    } catch (error) {
      console.error(`Exception fetching analysis ${analysisId}:`, error);
      return null;
    }
  }, []);

  return {
    fetchAnalysesFromSupabase,
    fetchAnalysisById,
    syncInProgress, 
    setSyncInProgress,
    user
  };
};
