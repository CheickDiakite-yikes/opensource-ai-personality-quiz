
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback, useRef } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { convertToPersonalityAnalysis } from "./utils";
import { loadAnalysisHistory } from "../analysis/useLocalStorage";
import { toast } from "sonner";

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const MAX_RETRY_ATTEMPTS = 5; // Increased from 3 to 5
  const MAX_PAGE_SIZE = 25; // Optimized page size for better reliability
  const totalAnalysesCountRef = useRef<number | null>(null);
  const lastFetchTimeRef = useRef<Date | null>(null);
  
  // Helper function to log detailed fetch information
  const logFetch = (message: string, data?: any) => {
    console.log(`[SupabaseSync] ${message}`, data || '');
  };

  // Fetch analyses from Supabase with improved pagination and error handling
  const fetchAnalysesFromSupabase = useCallback(async (forceRefresh = false) => {
    if (!user) {
      logFetch("No user found, cannot fetch analyses");
      return null;
    }
    
    // Prevent concurrent fetches
    if (syncInProgress && !forceRefresh) {
      logFetch("Sync already in progress, skipping");
      return null;
    }
    
    // Check if we've fetched recently (within 5 seconds) and it's not a force refresh
    if (lastFetchTimeRef.current && !forceRefresh) {
      const now = new Date();
      const timeSinceLastFetch = now.getTime() - lastFetchTimeRef.current.getTime();
      if (timeSinceLastFetch < 5000) { // 5 seconds cooldown
        logFetch(`Skipping fetch, last fetch was ${timeSinceLastFetch}ms ago`);
        return null;
      }
    }
    
    // Set a flag to prevent concurrent fetches
    setSyncInProgress(true);
    lastFetchTimeRef.current = new Date();
    
    try {
      logFetch(`Fetching all analyses for user: ${user.id}`);
      
      // First get a count of total analyses to fetch
      const { count, error: countError } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (countError) {
        console.error("Error getting analyses count:", countError);
      } else {
        totalAnalysesCountRef.current = count || 0;
        logFetch(`Found approximately ${count} analyses to fetch`);
      }

      // Fetch all analyses in batches with pagination
      let allData = [];
      let page = 0;
      let hasMoreData = true;
      const maxPages = 20; // Safety limit to prevent infinite loop
      
      while (hasMoreData && page < maxPages) {
        logFetch(`Fetching analyses page ${page + 1} (offset: ${page * MAX_PAGE_SIZE})`);
        
        try {
          const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(page * MAX_PAGE_SIZE, (page + 1) * MAX_PAGE_SIZE - 1);
          
          if (error) {
            console.error(`Error fetching analyses page ${page + 1}:`, error);
            // Don't break, try next page
          }
          
          if (data && data.length > 0) {
            // Filter out invalid records
            const validRecords = data.filter(record => 
              record && typeof record === 'object' && record.id
            );
            
            if (validRecords.length > 0) {
              allData = [...allData, ...validRecords];
              logFetch(`Retrieved ${validRecords.length} valid analyses for page ${page + 1}`);
            }
            
            if (data.length < MAX_PAGE_SIZE) {
              hasMoreData = false;
              logFetch("No more pages to fetch");
            }
          } else {
            hasMoreData = false;
            logFetch("No data found in this page");
          }
        } catch (pageError) {
          console.error(`Exception fetching page ${page + 1}:`, pageError);
          // Don't break, try next page
        }
        
        page++;
      }
      
      if (allData.length === 0) {
        // Fall back to a direct query with minimal filtering
        logFetch("No analyses found with pagination, trying direct query");
        
        const { data: directData, error: directError } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .limit(1000); // High limit to try to get everything
        
        if (directError) {
          console.error("Direct query failed:", directError);
        } else if (directData && directData.length > 0) {
          logFetch(`Found ${directData.length} analyses with direct query`);
          allData = directData;
        }
      }
      
      // Last resort: try to get just the IDs if all else fails
      if (allData.length === 0) {
        logFetch("Trying to get just analysis IDs as last resort");
        
        const { data: idData, error: idError } = await supabase
          .from('analyses')
          .select('id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1000);
          
        if (idError) {
          console.error("ID-only query failed:", idError);
        } else if (idData && idData.length > 0) {
          logFetch(`Found ${idData.length} analysis IDs, fetching full data individually`);
          
          // For each ID, try to fetch the full data individually
          for (const item of idData.slice(0, 50)) { // Limit to first 50 to avoid overwhelming
            try {
              const { data: fullData } = await supabase
                .from('analyses')
                .select('*')
                .eq('id', item.id)
                .maybeSingle();
                
              if (fullData) {
                allData.push(fullData);
              }
            } catch (e) {
              // Continue with next ID
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      }
      
      // Compare retrieved count with expected count
      if (totalAnalysesCountRef.current !== null && allData.length < totalAnalysesCountRef.current) {
        logFetch(`Warning: Retrieved only ${allData.length} out of ${totalAnalysesCountRef.current} expected analyses`);
      }
      
      logFetch(`Successfully retrieved ${allData.length} total analyses`);
      setRetryAttempts(0); // Reset retry counter on success
      return allData;
    } catch (error) {
      console.error("Error in fetchAnalysesFromSupabase:", error);
      
      // Implement aggressive retry mechanism
      if (retryAttempts < MAX_RETRY_ATTEMPTS) {
        const newRetryCount = retryAttempts + 1;
        setRetryAttempts(newRetryCount);
        const delay = Math.min(Math.pow(2, newRetryCount) * 500, 10000); // Max 10 second delay
        
        logFetch(`Will retry fetching analyses in ${delay}ms (attempt ${newRetryCount}/${MAX_RETRY_ATTEMPTS})`);
        setSyncInProgress(false);
        
        // Automatic retry after delay
        setTimeout(() => {
          fetchAnalysesFromSupabase(true).catch(console.error);
        }, delay);
      }
      
      return null;
    } finally {
      setSyncInProgress(false);
    }
  }, [user, retryAttempts, MAX_RETRY_ATTEMPTS, syncInProgress]);

  // Function to force fetch a specific analysis by ID
  const fetchAnalysisById = useCallback(async (analysisId: string): Promise<PersonalityAnalysis | null> => {
    if (!analysisId) return null;
    
    try {
      logFetch(`Directly fetching analysis with ID: ${analysisId}`);
      
      // Try with exact ID match first
      let { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .maybeSingle();
      
      // If not found, try with assessment_id
      if (!data && !error) {
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('analyses')
          .select('*')
          .eq('assessment_id', analysisId)
          .maybeSingle();
        
        if (!assessmentError) {
          data = assessmentData;
        }
      }
      
      if (error) {
        console.error(`Error fetching analysis ${analysisId}:`, error);
        return null;
      }
      
      if (!data) {
        logFetch(`No analysis found with ID: ${analysisId}`);
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
