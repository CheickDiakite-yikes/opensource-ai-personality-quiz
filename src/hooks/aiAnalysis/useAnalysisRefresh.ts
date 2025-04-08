
import { useCallback, useRef } from 'react';
import { AIAnalysisState, AIAnalysisActions } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { convertToPersonalityAnalysis, sortAnalysesByDate } from './utils';
import { toast } from 'sonner';
import { loadAnalysisHistory } from '../analysis/useLocalStorage';

// Hook for refreshing analysis data from local storage or Supabase
export const useAnalysisRefresh = (
  state: AIAnalysisState,
  actions: AIAnalysisActions
) => {
  const { user } = useAuth();
  const refreshInProgressRef = useRef(false);

  const refreshAnalysis = useCallback(async () => {
    // Prevent concurrent or rapid successive refreshes
    if (refreshInProgressRef.current) {
      return;
    }

    try {
      refreshInProgressRef.current = true;
      actions.setIsLoading(true);
      
      // First, try to get analyses from Supabase if user is logged in
      if (user) {
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching analyses from Supabase:", error);
          toast.error("Failed to load analysis data from cloud");
        } else if (data && data.length > 0) {
          console.log(`Loaded ${data.length} analyses from Supabase`);
          
          // Convert Supabase data to PersonalityAnalysis objects
          const analyses = data.map(convertToPersonalityAnalysis);
          
          // Sort by date (newest first) and update state
          const sortedAnalyses = sortAnalysesByDate(analyses);
          actions.setAnalysisHistory(sortedAnalyses);
          
          // Only update current analysis if not already set or if it's different
          if (!state.analysis || state.analysis.id !== sortedAnalyses[0].id) {
            actions.setAnalysis(sortedAnalyses[0]);
            // Only show toast on initial load or when analysis actually changes
            if (!state.lastRefresh || new Date().getTime() - state.lastRefresh.getTime() > 5000) {
              toast.success("Analysis data refreshed from cloud");
            }
          }
          
          actions.setLastRefresh(new Date());
          actions.setIsLoading(false);
          return;
        }
      }
      
      // If we don't have Supabase data, fall back to local storage
      const localAnalyses = loadAnalysisHistory();
      if (localAnalyses && localAnalyses.length > 0) {
        console.log(`Loaded ${localAnalyses.length} analyses from local storage`);
        const sortedAnalyses = sortAnalysesByDate(localAnalyses);
        actions.setAnalysisHistory(sortedAnalyses);
        
        // Only update if analysis is not already set or if it's different
        if (!state.analysis || state.analysis.id !== sortedAnalyses[0].id) {
          actions.setAnalysis(sortedAnalyses[0]);
          // Only show this toast on initial load
          if (!state.lastRefresh) {
            toast.success("Analysis data loaded from local storage");
          }
        }
      } else {
        // No analysis found in either source
        actions.setAnalysis(null);
        actions.setAnalysisHistory([]);
        console.log("No analysis data found");
      }
    } catch (err) {
      console.error("Error refreshing analysis:", err);
      toast.error("Failed to refresh analysis data");
      
      // Try to use local analysis as fallback
      const localAnalyses = loadAnalysisHistory();
      if (localAnalyses && localAnalyses.length > 0) {
        const mostRecentAnalysis = sortAnalysesByDate(localAnalyses)[0];
        actions.setAnalysis(mostRecentAnalysis);
        actions.setAnalysisHistory([mostRecentAnalysis]);
      }
    } finally {
      actions.setIsLoading(false);
      actions.setLastRefresh(new Date());
      // Reset the refresh flag after a small delay to prevent rapid successive calls
      setTimeout(() => {
        refreshInProgressRef.current = false;
      }, 1000);
    }
  }, [user, actions, state.analysis, state.lastRefresh]);

  return { refreshAnalysis };
};
