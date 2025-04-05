
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
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error("Error fetching analysis from Supabase:", error);
        return null;
      }
      
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
