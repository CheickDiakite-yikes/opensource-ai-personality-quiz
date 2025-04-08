
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
  const MAX_PAGE_SIZE = 50; // Reduced slightly from 100 to avoid potential payload issues

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
    if (!user) {
      console.log("No user found, cannot fetch analyses");
      return null;
    }
    
    // Set a flag to prevent concurrent fetches
    setSyncInProgress(true);
    
    try {
      console.log("Fetching all analyses for user:", user.id);
      
      // First attempt: try to get a count of total analyses to fetch
      const { count, error: countError } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (countError) {
        console.error("Error getting analyses count:", countError);
      } else {
        console.log(`Found approximately ${count} analyses to fetch`);
      }
      
      // Try to fetch all analyses in separate small batches to avoid payload size issues
      let allData = [];
      let page = 0;
      let hasMoreData = true;
      
      while (hasMoreData) {
        console.log(`Fetching analyses page ${page + 1} (offset: ${page * MAX_PAGE_SIZE})`);
        
        try {
          const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(page * MAX_PAGE_SIZE, (page + 1) * MAX_PAGE_SIZE - 1);
          
          if (error) {
            console.error(`Error fetching analyses page ${page + 1}:`, error);
            break;
          }
          
          if (data && data.length > 0) {
            // Check if we have valid data before adding to result
            const validRecords = data.filter(record => 
              record && record.id && record.result // Only include records with required fields
            );
            
            if (validRecords.length > 0) {
              allData = [...allData, ...validRecords];
              console.log(`Retrieved ${validRecords.length} valid analyses for page ${page + 1}`);
            }
            
            if (data.length < MAX_PAGE_SIZE) {
              hasMoreData = false;
              console.log("No more pages to fetch");
            }
          } else {
            hasMoreData = false;
            console.log("No data found in this page");
          }
        } catch (pageError) {
          console.error(`Exception fetching page ${page + 1}:`, pageError);
          break;
        }
        
        page++;
        
        // Safety check to prevent infinite loops
        if (page > 10) {
          console.warn("Reached maximum page limit of 10, stopping fetch");
          hasMoreData = false;
        }
      }
      
      if (allData.length === 0) {
        // No analyses found with pagination, try a direct query with minimal fields
        console.log("No analyses found with pagination, trying direct query with minimal fields");
        
        const { data: minimalData, error: minimalError } = await supabase
          .from('analyses')
          .select('id, created_at, user_id, assessment_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (minimalError) {
          console.error("Minimal fields query also failed:", minimalError);
        } else if (minimalData && minimalData.length > 0) {
          console.log(`Found ${minimalData.length} analyses with minimal fields query`);
          
          // For each minimal record, try to fetch the full data individually
          const fullRecords = [];
          
          for (const item of minimalData) {
            try {
              console.log(`Fetching full data for analysis ${item.id}`);
              const { data: fullRecord, error: recordError } = await supabase
                .from('analyses')
                .select('*')
                .eq('id', item.id)
                .maybeSingle();
                
              if (recordError) {
                console.error(`Error fetching full data for analysis ${item.id}:`, recordError);
              } else if (fullRecord) {
                fullRecords.push(fullRecord);
                console.log(`Successfully fetched full data for analysis ${item.id}`);
              }
            } catch (e) {
              console.error(`Exception fetching analysis ${item.id}:`, e);
            }
            
            // Add a small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          if (fullRecords.length > 0) {
            console.log(`Retrieved ${fullRecords.length} full analyses with individual requests`);
            return fullRecords;
          }
          
          // If we couldn't get full records, return the minimal data as a last resort
          return minimalData;
        }
      }
      
      console.log(`Successfully retrieved ${allData.length} total analyses`);
      return allData;
    } catch (error) {
      console.error("Error in fetchAnalysesFromSupabase:", error);
      
      // Final fallback: try the simplest possible query
      try {
        console.log("Trying simplest possible query as last resort");
        const { data: simpleData } = await supabase
          .from('analyses')
          .select('id, assessment_id, created_at')
          .eq('user_id', user.id)
          .limit(1000);
          
        if (simpleData && simpleData.length > 0) {
          console.log(`Found ${simpleData.length} analyses with simplest query`);
          return simpleData;
        }
      } catch (fallbackError) {
        console.error("Even simplest query failed:", fallbackError);
      }
      
      if (retryAttempts < MAX_RETRY_ATTEMPTS) {
        setRetryAttempts(prev => prev + 1);
        const delay = Math.pow(2, retryAttempts) * 1000;
        console.log(`Will retry fetching analyses in ${delay}ms (attempt ${retryAttempts + 1})`);
        
        // We'll return null here instead of retrying immediately to prevent UI blocking
        return null;
      }
      
      return null;
    } finally {
      setSyncInProgress(false);
    }
  }, [user, retryAttempts, MAX_PAGE_SIZE]);

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
