
import { useCallback } from 'react';
import { loadAnalysisHistory } from "../analysis/useLocalStorage";
import { sortAnalysesByDate } from './utils';
import { useSupabaseSync } from './useSupabaseSync';
import { AIAnalysisState, AIAnalysisActions } from './types';
import { PersonalityAnalysis } from '@/utils/types';
import { convertToPersonalityAnalysis } from './utils';

// This hook handles refreshing analysis data
export const useAnalysisRefresh = (
  state: AIAnalysisState,
  actions: AIAnalysisActions
) => {
  const { 
    analysis, 
    analysisHistory,
    setAnalysis, 
    setAnalysisHistory, 
    setIsLoading, 
    setLastRefresh 
  } = { ...state, ...actions };
  
  const { 
    fetchAnalysesFromSupabase, 
    syncInProgress, 
    setSyncInProgress,
    user 
  } = useSupabaseSync();

  // Function to refresh analysis data from database with debounce and locking
  const refreshAnalysis = useCallback(async () => {
    // Prevent concurrent refresh operations
    if (syncInProgress) return;
    
    // Only refresh if it's been at least 5 seconds since the last refresh
    const now = new Date();
    const timeSinceLastRefresh = now.getTime() - state.lastRefresh.getTime();
    
    if (timeSinceLastRefresh < 5000 && state.analysisHistory.length > 0) {
      // Skip refresh if it's been less than 5 seconds and we have data
      return;
    }
    
    setSyncInProgress(true);
    setIsLoading(true);
    setLastRefresh(now);
    
    try {
      if (user) {
        // Get analyses from Supabase
        const data = await fetchAnalysesFromSupabase();
          
        if (!data) {
          // Fallback to localStorage without updating state if we already have data
          if (analysisHistory.length === 0) {
            const history = loadAnalysisHistory();
            const sortedHistory = sortAnalysesByDate(history);
            setAnalysisHistory(sortedHistory);
            
            if (sortedHistory.length > 0 && !analysis) {
              setAnalysis(sortedHistory[0]);
            }
          }
        } else if (data.length > 0) {
          // Transform the data into our PersonalityAnalysis type
          const analyses: PersonalityAnalysis[] = data.map(item => convertToPersonalityAnalysis(item));
          
          // Ensure analyses are sorted by date (newest first)
          const sortedAnalyses = sortAnalysesByDate(analyses);
          
          // Save to history state if changed
          if (JSON.stringify(sortedAnalyses) !== JSON.stringify(analysisHistory)) {
            setAnalysisHistory(sortedAnalyses);
          
            // Set the most recent as current if no current selection
            if (!analysis) {
              setAnalysis(sortedAnalyses[0]);
            }
          
            // Also update localStorage for offline access
            sortedAnalyses.forEach(analysis => {
              import('../analysis/useLocalStorage').then(module => {
                module.saveAnalysisToHistory(analysis, sortedAnalyses);
              });
            });
          }
        } else if (analysisHistory.length === 0) {
          // Fallback to localStorage only if we don't have data yet
          const history = loadAnalysisHistory();
          const sortedHistory = sortAnalysesByDate(history);
          setAnalysisHistory(sortedHistory);
          
          if (sortedHistory.length > 0 && !analysis) {
            setAnalysis(sortedHistory[0]);
          }
        }
      } else if (analysisHistory.length === 0) {
        // No user and no data, use localStorage
        const history = loadAnalysisHistory();
        const sortedHistory = sortAnalysesByDate(history);
        setAnalysisHistory(sortedHistory);
        
        if (sortedHistory.length > 0 && !analysis) {
          setAnalysis(sortedHistory[0]);
        }
      }
    } catch (error) {
      console.error("Error in refreshAnalysis:", error);
      
      // Fallback to localStorage only if we don't have data yet
      if (analysisHistory.length === 0) {
        const history = loadAnalysisHistory();
        const sortedHistory = sortAnalysesByDate(history);
        setAnalysisHistory(sortedHistory);
        
        if (sortedHistory.length > 0 && !analysis) {
          setAnalysis(sortedHistory[0]);
        }
      }
    } finally {
      setIsLoading(false);
      setSyncInProgress(false);
    }
  }, [user, analysis, analysisHistory, state.lastRefresh, syncInProgress]);

  return { refreshAnalysis };
};
