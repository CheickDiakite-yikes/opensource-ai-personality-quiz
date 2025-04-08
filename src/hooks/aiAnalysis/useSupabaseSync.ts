
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

  // Fetch analyses from Supabase
  const fetchAnalysesFromSupabase = useCallback(async () => {
    if (!user) return null;
    
    try {
      console.log("Fetching all analyses for user:", user.id);
      
      // Try to fetch with retries for better reliability
      const { data, error } = await retryWithBackoff(async () => 
        supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      );
        
      if (error) {
        console.error("Error fetching analysis from Supabase:", error);
        
        // Try alternate approach focusing only on essential fields
        console.log("Trying alternative fetch approach for analyses");
        const { data: altData, error: altError } = await supabase
          .from('analyses')
          .select('id, created_at, user_id, assessment_id, result')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (altError) {
          console.error("Alternative fetch also failed:", altError);
          return null;
        }
        
        if (!altData || altData.length === 0) {
          console.log("No analyses found with alternative fetch method");
          return null;
        }
        
        console.log(`Retrieved ${altData.length} analyses with alternative method`);
        return altData;
      }
      
      if (!data || data.length === 0) {
        console.log("No analyses found for user");
        return null;
      }
      
      setRetryAttempts(0); // Reset retry counter on success
      console.log(`Retrieved ${data.length} analyses from Supabase`);
      return data;
    } catch (error) {
      console.error("Error in fetchAnalysesFromSupabase:", error);
      
      // Implement retry mechanism
      if (retryAttempts < MAX_RETRY_ATTEMPTS) {
        setRetryAttempts(prev => prev + 1);
        toast.error("Connection issue, retrying...", {
          description: `Attempt ${retryAttempts + 1} of ${MAX_RETRY_ATTEMPTS}`
        });
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await fetchAnalysesFromSupabase(); // Recursive retry
      }
      
      toast.error("Could not fetch analyses after multiple attempts", {
        description: "Please check your connection and try again later"
      });
      return null;
    }
  }, [user, retryAttempts]);

  return {
    fetchAnalysesFromSupabase,
    syncInProgress, 
    setSyncInProgress,
    user
  };
};
