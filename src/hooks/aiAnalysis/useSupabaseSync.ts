
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback, useRef, useEffect } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { convertToPersonalityAnalysis } from "./utils";
import { toast } from "sonner";

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const MAX_RETRY_ATTEMPTS = 5;
  const MAX_PAGE_SIZE = 50; // Increased for better retrieval
  const totalAnalysesCountRef = useRef<number | null>(null);
  const lastFetchTimeRef = useRef<Date | null>(null);
  
  // Add diagnostic effect to check user auth status
  useEffect(() => {
    console.log(`[SupabaseSync] User auth status: ${user ? 'Logged in' : 'Not logged in'}`);
    if (user) {
      console.log(`[SupabaseSync] User ID: ${user.id}`);
    }
  }, [user]);
  
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
      
      // Try direct approach - get all analyses at once with a high limit
      logFetch("Attempting direct fetch of all analyses");
      const { data: directData, error: directError } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200); // Very high limit to try to get everything
      
      if (directError) {
        console.error("[SupabaseSync] Direct fetch error:", directError);
      } else if (directData && directData.length > 0) {
        logFetch(`Direct fetch successful, found ${directData.length} analyses`);
        
        // Log all IDs for debugging
        logFetch(`Analysis IDs: ${directData.map(a => a.id).join(', ')}`);
        
        // Convert the data to our internal format
        const convertedData = directData.map(item => convertToPersonalityAnalysis(item));
        return convertedData;
      } else {
        logFetch("Direct fetch returned no data");
      }
      
      // Second attempt: First get a count of total analyses to fetch
      logFetch("Attempting to get analysis count");
      const { count, error: countError } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (countError) {
        console.error("[SupabaseSync] Error getting analyses count:", countError);
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
            console.error(`[SupabaseSync] Error fetching analyses page ${page + 1}:`, error);
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
          console.error(`[SupabaseSync] Exception fetching page ${page + 1}:`, pageError);
          // Don't break, try next page
        }
        
        page++;
      }
      
      // Third attempt: try with minimal columns for faster retrieval
      if (allData.length === 0) {
        logFetch("No analyses found with pagination, trying with minimal columns");
        
        const { data: minimalData, error: minimalError } = await supabase
          .from('analyses')
          .select('id, assessment_id, created_at, user_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(200);
        
        if (minimalError) {
          console.error("[SupabaseSync] Minimal query failed:", minimalError);
        } else if (minimalData && minimalData.length > 0) {
          logFetch(`Found ${minimalData.length} analyses with minimal query, fetching full data`);
          
          // For each ID, try to fetch the full data
          for (const item of minimalData) {
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
          }
        }
      }
      
      // Fourth attempt: Try public access with no user filter
      if (allData.length === 0) {
        logFetch("Trying public access with no user filter as last resort");
        
        try {
          const { data: publicData, error: publicError } = await supabase
            .from('analyses')
            .select('id, assessment_id, created_at')
            .order('created_at', { ascending: false })
            .limit(100);
            
          if (publicError) {
            console.error("[SupabaseSync] Public query failed:", publicError);
          } else if (publicData && publicData.length > 0) {
            logFetch(`Found ${publicData.length} analyses with public query`);
            logFetch(`Analysis IDs: ${publicData.map(a => a.id).join(', ')}`);
            
            // Check if the current route ID matches any of these
            const urlPath = window.location.pathname;
            const routeIdMatch = urlPath.match(/\/report\/([^\/]+)$/);
            const currentAnalysisId = routeIdMatch ? routeIdMatch[1] : null;
            
            if (currentAnalysisId) {
              logFetch(`Current route analysis ID: ${currentAnalysisId}`);
              
              // Try to fetch this specific analysis
              const { data: specificData } = await supabase
                .from('analyses')
                .select('*')
                .eq('id', currentAnalysisId)
                .maybeSingle();
                
              if (specificData) {
                logFetch(`Successfully retrieved current analysis: ${currentAnalysisId}`);
                allData = [specificData];
              }
            }
          }
        } catch (publicError) {
          console.error("[SupabaseSync] Error in public access attempt:", publicError);
        }
      }
      
      // Compare retrieved count with expected count
      if (totalAnalysesCountRef.current !== null && allData.length < totalAnalysesCountRef.current) {
        logFetch(`Warning: Retrieved only ${allData.length} out of ${totalAnalysesCountRef.current} expected analyses`);
      }
      
      logFetch(`Successfully retrieved ${allData.length} total analyses`);
      setRetryAttempts(0); // Reset retry counter on success
      
      // Convert the data to our internal format
      if (allData.length > 0) {
        return allData.map(item => convertToPersonalityAnalysis(item));
      }
      
      return allData;
    } catch (error) {
      console.error("[SupabaseSync] Error in fetchAnalysesFromSupabase:", error);
      
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
      
      // Try multiple ways to fetch the analysis
      
      // 1. Try with exact ID match
      let { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .maybeSingle();
      
      // 2. If not found, try with assessment_id
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
      
      // 3. Try public access without user filtering
      if (!data && !error) {
        logFetch(`No analysis found with ID or assessment_id, trying public access`);
        const { data: publicData, error: publicError } = await supabase
          .from('analyses')
          .select('*')
          .eq('id', analysisId)
          .limit(1);
          
        if (!publicError && publicData && publicData.length > 0) {
          data = publicData[0];
          logFetch(`Found analysis via public access: ${data.id}`);
        }
      }
      
      // 4. Try a broader search if all else fails
      if (!data && !error) {
        logFetch(`No analysis found with direct methods, trying partial match`);
        const { data: partialData, error: partialError } = await supabase
          .from('analyses')
          .select('*')
          .filter('id', 'ilike', `%${analysisId.slice(-10)}%`)
          .limit(1);
          
        if (!partialError && partialData && partialData.length > 0) {
          data = partialData[0];
          logFetch(`Found analysis via partial match: ${data.id}`);
        }
      }
      
      if (error) {
        console.error(`[SupabaseSync] Error fetching analysis ${analysisId}:`, error);
        return null;
      }
      
      if (!data) {
        logFetch(`No analysis found with ID: ${analysisId} after multiple attempts`);
        return null;
      }
      
      // Check if the data has expected fields
      logFetch(`Successfully found analysis: ${data.id}`);
      if (!data.traits || !Array.isArray(data.traits)) {
        logFetch(`Warning: Analysis ${data.id} has no traits or invalid traits data`);
      }
      
      return convertToPersonalityAnalysis(data);
    } catch (error) {
      console.error(`[SupabaseSync] Exception fetching analysis ${analysisId}:`, error);
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
