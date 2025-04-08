
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
      console.log("[AnalysisRefresh] Starting manual refresh of analyses data");
      
      // If user is logged in, try to get data from Supabase
      if (user) {
        console.log("[AnalysisRefresh] User is logged in, fetching from Supabase");
        
        // First try the normal channel
        const { data: analysesData, error: analysesError } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1000); // Set very high limit to get all
          
        if (analysesError) {
          console.error("[AnalysisRefresh] Error fetching analyses:", analysesError);
          
          // If first attempt fails, try with fewer columns
          const { data: backupData, error: backupError } = await supabase
            .from('analyses')
            .select('id, assessment_id, created_at, result, traits')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1000);
            
          if (backupError) {
            console.error("[AnalysisRefresh] Backup fetch also failed:", backupError);
            throw new Error(`Failed to fetch analyses: ${backupError.message}`);
          }
          
          if (backupData && backupData.length > 0) {
            console.log(`[AnalysisRefresh] Found ${backupData.length} analyses with backup query`);
            const mappedAnalyses = backupData.map(convertToPersonalityAnalysis).filter(Boolean);
            
            toast.success(`Successfully loaded ${mappedAnalyses.length} analyses`, {
              description: "Your data has been refreshed"
            });
            
            return mappedAnalyses;
          }
        }
        
        if (analysesData && analysesData.length > 0) {
          console.log(`[AnalysisRefresh] Found ${analysesData.length} analyses in database`);
          
          // Map data and log trait counts for debugging
          const mappedAnalyses = analysesData.map(convertToPersonalityAnalysis).filter(Boolean);
          
          // Check for valid data
          const validAnalyses = mappedAnalyses.filter(a => a && a.id);
          
          console.log(`[AnalysisRefresh] Successfully converted ${validAnalyses.length} analyses`);
          
          toast.success(`Successfully loaded ${validAnalyses.length} analyses`, {
            description: "Your data has been refreshed"
          });
          
          return sortAnalysesByDate(validAnalyses);
        }
      }
      
      // If no Supabase data or no user, fall back to local storage
      const localAnalyses = loadAnalysisHistory();
      if (localAnalyses && localAnalyses.length > 0) {
        console.log(`[AnalysisRefresh] Found ${localAnalyses.length} analyses in local storage`);
        toast.success(`Loaded ${localAnalyses.length} analyses from local storage`);
        return sortAnalysesByDate(localAnalyses);
      }
      
      // No analyses found
      toast.error("No analyses found", {
        description: "Try completing the assessment"
      });
      return [];
      
    } catch (error) {
      console.error("[AnalysisRefresh] Error in forceAnalysisRefresh:", error);
      toast.error("Failed to refresh analyses", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      return [];
    }
  }, [user]);
  
  return { forceAnalysisRefresh };
};
