
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertToPersonalityAnalysis } from './aiAnalysis/utils';
import { loadAnalysisHistory } from './analysis/useLocalStorage';
import { PersonalityAnalysis } from '@/utils/types';

// Function to sort analyses by date, with newest first
const sortAnalysesByDate = (analyses: PersonalityAnalysis[]): PersonalityAnalysis[] => {
  if (!analyses || !Array.isArray(analyses)) return [];
  
  return [...analyses].sort((a, b) => {
    const dateA = new Date(a.createdAt || '');
    const dateB = new Date(b.createdAt || '');
    return dateB.getTime() - dateA.getTime(); // Newest first
  });
};

// Create a simplified version of the refreshAnalysis function for debugging
export const useAnalysisRefresh = () => {
  const { user } = useAuth();
  
  const forceAnalysisRefresh = useCallback(async (): Promise<PersonalityAnalysis[] | null> => {
    try {
      toast.info("Manually refreshing analyses data...");
      console.log("[AnalysisRefresh] Starting manual refresh of analyses data");
      
      // If user is logged in, try to get data from Supabase
      if (user) {
        console.log("[AnalysisRefresh] User is logged in, fetching from Supabase");
        console.log("[AnalysisRefresh] User ID:", user.id);
        
        // Try several approaches to maximize chances of success
        
        // First try: Get all analyses with a high limit
        const { data: allAnalysesData, error: allAnalysesError } = await supabase
          .from('analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500); // Set very high limit to get everything
          
        if (allAnalysesError) {
          console.error("[AnalysisRefresh] Error fetching all analyses:", allAnalysesError);
        } else if (allAnalysesData && allAnalysesData.length > 0) {
          console.log(`[AnalysisRefresh] Found ${allAnalysesData.length} analyses with all query`);
          
          // Get user's analyses if possible
          const userAnalyses = allAnalysesData.filter(a => a.user_id === user.id);
          console.log(`[AnalysisRefresh] ${userAnalyses.length} analyses belong to current user`);
          
          // Use all analyses if needed, but prioritize user's own analyses
          const analysesToUse = userAnalyses.length > 0 ? userAnalyses : allAnalysesData;
          const mappedAnalyses = analysesToUse.map(convertToPersonalityAnalysis).filter(Boolean);
          
          toast.success(`Successfully loaded ${mappedAnalyses.length} analyses`, {
            description: userAnalyses.length > 0 ? 
              "Your personal analyses are available" : 
              "Some analyses may not be linked to your account"
          });
          
          return sortAnalysesByDate(mappedAnalyses);
        }
        
        // Second try: the normal channel with user filtering
        const { data: analysesData, error: analysesError } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(500); // Set very high limit to get all
          
        if (analysesError) {
          console.error("[AnalysisRefresh] Error fetching analyses:", analysesError);
          
          // If first attempt fails, try with fewer columns
          const { data: backupData, error: backupError } = await supabase
            .from('analyses')
            .select('id, assessment_id, created_at, result, traits')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(500);
            
          if (backupError) {
            console.error("[AnalysisRefresh] Backup fetch also failed:", backupError);
            
            // Last try: get public analyses without filtering by user
            const { data: publicData, error: publicError } = await supabase
              .from('analyses')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(100);
              
            if (publicError || !publicData || publicData.length === 0) {
              console.error("[AnalysisRefresh] Public fetch failed too:", publicError);
              throw new Error(`Failed to fetch analyses: ${publicError?.message || backupError?.message}`);
            }
            
            console.log(`[AnalysisRefresh] Found ${publicData.length} public analyses`);
            const mappedPublicAnalyses = publicData.map(convertToPersonalityAnalysis).filter(Boolean);
            
            toast.success(`Loaded ${mappedPublicAnalyses.length} analyses`, {
              description: "Some analyses may not be linked to your account"
            });
            
            return sortAnalysesByDate(mappedPublicAnalyses);
          }
          
          if (backupData && backupData.length > 0) {
            console.log(`[AnalysisRefresh] Found ${backupData.length} analyses with backup query`);
            const mappedAnalyses = backupData.map(convertToPersonalityAnalysis).filter(Boolean);
            
            toast.success(`Successfully loaded ${mappedAnalyses.length} analyses`, {
              description: "Your data has been refreshed"
            });
            
            return sortAnalysesByDate(mappedAnalyses);
          }
        }
        
        if (analysesData && analysesData.length > 0) {
          console.log(`[AnalysisRefresh] Found ${analysesData.length} analyses in database`);
          
          // Log all analysis IDs for debugging
          console.log(`[AnalysisRefresh] Analysis IDs: ${analysesData.map(a => a.id).join(', ')}`);
          
          // Map data and log trait counts for debugging
          const mappedAnalyses = analysesData.map(convertToPersonalityAnalysis).filter(Boolean);
          
          // Check for valid data
          const validAnalyses = mappedAnalyses.filter(a => a && a.id);
          
          console.log(`[AnalysisRefresh] Successfully converted ${validAnalyses.length} analyses`);
          
          toast.success(`Successfully loaded ${validAnalyses.length} analyses`, {
            description: "Your data has been refreshed"
          });
          
          return sortAnalysesByDate(validAnalyses);
        } else {
          console.log(`[AnalysisRefresh] No analyses found for user ID: ${user.id}`);
          
          // Try without user filtering as a last resort
          const { data: publicData } = await supabase
            .from('analyses')
            .select('*')
            .limit(100);
            
          if (publicData && publicData.length > 0) {
            console.log(`[AnalysisRefresh] Found ${publicData.length} public analyses`);
            const mappedAnalyses = publicData.map(convertToPersonalityAnalysis).filter(Boolean);
            
            toast.success(`Loaded ${mappedAnalyses.length} public analyses`, {
              description: "These analyses are not filtered by user"
            });
            
            return sortAnalysesByDate(mappedAnalyses);
          }
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
        description: "Try completing the assessment again"
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
