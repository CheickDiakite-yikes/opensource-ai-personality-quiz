
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { convertToPersonalityAnalysis } from "./utils";
import { loadAnalysisHistory } from "../analysis/useLocalStorage";

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Fetch analyses from Supabase
  const fetchAnalysesFromSupabase = useCallback(async () => {
    if (!user) return null;
    
    try {
      console.log("Fetching all analyses for user:", user.id);
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        // Removed the limit to ensure we get all analyses
        
      if (error) {
        console.error("Error fetching analysis from Supabase:", error);
        return null;
      }
      
      console.log(`Retrieved ${data?.length || 0} analyses from Supabase`);
      return data;
    } catch (error) {
      console.error("Error in fetchAnalysesFromSupabase:", error);
      return null;
    }
  }, [user]);

  return {
    fetchAnalysesFromSupabase,
    syncInProgress, 
    setSyncInProgress,
    user
  };
};
