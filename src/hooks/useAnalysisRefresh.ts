
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertToPersonalityAnalysis, sortAnalysesByDate } from './aiAnalysis/utils';
import { loadAnalysisHistory } from './analysis/useLocalStorage';

// Create a simplified version of the refreshAnalysis function for debugging
export const useAnalysisRefresh = () => {
  const { user } = useAuth();
  
  const forceAnalysisRefresh = useCallback(async () => {
    try {
      toast.info("Manually refreshing analyses data...");
      console.log("Starting manual refresh of analyses data");
      
      // If user is logged in, try to get data from Supabase
      if (user) {
        console.log("User is logged in, fetching from Supabase");
        
        // Get all analyses directly from database
        const { data: analysesData, error: analysesError } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (analysesError) {
          console.error("Error fetching analyses:", analysesError);
          throw new Error(`Failed to fetch analyses: ${analysesError.message}`);
        }
        
        console.log(`Found ${analysesData?.length || 0} analyses in database`);
        
        if (analysesData && analysesData.length > 0) {
          // Map data and log trait counts for debugging
          const mappedAnalyses = analysesData.map(convertToPersonalityAnalysis);
          console.log("Mapped analyses trait counts:", mappedAnalyses.map(a => ({
            id: a.id,
            traitCount: a.traits?.length || 0
          })));
          
          toast.success(`Successfully loaded ${mappedAnalyses.length} analyses`, {
            description: "Your data has been refreshed"
          });
          
          return mappedAnalyses;
        }
      }
      
      // If no Supabase data or no user, fall back to local storage
      const localAnalyses = loadAnalysisHistory();
      if (localAnalyses && localAnalyses.length > 0) {
        console.log(`Found ${localAnalyses.length} analyses in local storage`);
        toast.success(`Loaded ${localAnalyses.length} analyses from local storage`);
        return sortAnalysesByDate(localAnalyses);
      }
      
      // No analyses found
      toast.error("No analyses found", {
        description: "Try completing the assessment"
      });
      return [];
      
    } catch (error) {
      console.error("Error in forceAnalysisRefresh:", error);
      toast.error("Failed to refresh analyses", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      return [];
    }
  }, [user]);
  
  return { forceAnalysisRefresh };
};
