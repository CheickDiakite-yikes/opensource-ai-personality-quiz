
import { useCallback, useRef } from 'react';
import { AIAnalysisState, AIAnalysisActions } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { convertToPersonalityAnalysis } from './utils';
import { toast } from 'sonner';
import { loadAnalysisHistory } from '../analysis/useLocalStorage';
import { PersonalityAnalysis } from '@/utils/types';

// Function to sort analyses by date (newest first)
const sortAnalysesByDate = (analyses: PersonalityAnalysis[]): PersonalityAnalysis[] => {
  if (!analyses || !Array.isArray(analyses)) return [];
  
  return [...analyses].sort((a, b) => {
    const dateA = new Date(a.createdAt || '');
    const dateB = new Date(b.createdAt || '');
    return dateB.getTime() - dateA.getTime(); // Newest first
  });
};

// Hook for refreshing analysis data from local storage or Supabase
export const useAnalysisRefresh = (
  state: AIAnalysisState,
  actions: AIAnalysisActions
) => {
  const { user } = useAuth();
  const refreshInProgressRef = useRef(false);
  const lastRefreshAttemptRef = useRef<Date | null>(null);
  const refreshRetryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  const refreshAnalysis = useCallback(async () => {
    // Prevent concurrent or rapid successive refreshes
    if (refreshInProgressRef.current) {
      console.log("Refresh already in progress, skipping");
      return;
    }

    // Prevent rapid successive refreshes (limit to once every 2 seconds)
    const now = new Date();
    if (lastRefreshAttemptRef.current && 
        now.getTime() - lastRefreshAttemptRef.current.getTime() < 2000) {
      console.log("Refresh attempted too soon after last refresh, skipping");
      return;
    }
    lastRefreshAttemptRef.current = now;

    try {
      refreshInProgressRef.current = true;
      actions.setIsLoading(true);
      
      // First, try to get analyses from Supabase if user is logged in
      if (user) {
        try {
          console.log("Fetching all analyses for user:", user.id);
          
          // Use a more focused query to reduce data transfer
          // Increased limit to 100 to ensure we get all analyses
          let query = supabase
            .from('analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100); // Increased from default to 100
            
          const { data, error } = await query;
            
          if (error) {
            console.error("Error fetching analyses from Supabase:", error);
            
            // If there's an error, try a different approach focusing only on essential fields
            console.log("Trying alternative fetch approach");
            const { data: altData, error: altError } = await supabase
              .from('analyses')
              .select('id, created_at, user_id, assessment_id, result')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(100); // Increased limit here too
              
            if (altError) {
              console.error("Alternative fetch also failed:", altError);
              toast.error("Failed to load analysis data from cloud", {
                description: "Falling back to locally stored data"
              });
            } else if (altData && altData.length > 0) {
              console.log(`Loaded ${altData.length} analyses from Supabase using alternative method`);
              const analyses = altData
                .map(item => convertToPersonalityAnalysis(item))
                .filter(Boolean);
              
              if (analyses && analyses.length > 0) {
                const sortedAnalyses = sortAnalysesByDate(analyses);
                actions.setAnalysisHistory(sortedAnalyses);
                
                // Only update current analysis if not already set or if it's different
                if (!state.analysis || state.analysis.id !== sortedAnalyses[0].id) {
                  actions.setAnalysis(sortedAnalyses[0]);
                }
                
                actions.setLastRefresh(new Date());
                actions.setIsLoading(false);
                refreshInProgressRef.current = false;
                refreshRetryCountRef.current = 0; // Reset retry counter on success
                return;
              }
            }
          } else if (data && data.length > 0) {
            console.log(`Loaded ${data.length} analyses from Supabase`);
            
            // Convert Supabase data to PersonalityAnalysis objects
            const analyses = data.map(convertToPersonalityAnalysis).filter(Boolean);
            
            // Ensure we have valid data
            if (analyses.length === 0) {
              console.error("No valid analyses after conversion, falling back to local storage");
              throw new Error("No valid analyses after conversion");
            }
            
            // Validate critical data in analyses
            const validatedAnalyses = analyses.map(analysis => {
              // If an analysis has no traits, add a placeholder trait
              if (!analysis.traits || !Array.isArray(analysis.traits) || analysis.traits.length === 0) {
                console.warn(`Analysis ${analysis.id} has no traits, adding placeholder`);
                analysis.traits = [{
                  trait: "Analysis Incomplete", 
                  score: 5, 
                  description: "This analysis didn't generate enough trait data. You may want to retake the assessment.",
                  strengths: ["Not available"],
                  challenges: ["Not available"],
                  growthSuggestions: ["Consider retaking the assessment"]
                }];
              }
              
              // If traits array exists but is too small, add an informational trait
              if (Array.isArray(analysis.traits) && analysis.traits.length < 2) {
                console.warn(`Analysis ${analysis.id} has only ${analysis.traits.length} traits, adding informational trait`);
                analysis.traits.push({
                  trait: "Analysis Note", 
                  score: 0, 
                  description: "We expected 8-12 personality traits but only found " + analysis.traits.length + ". The analysis may be incomplete.",
                  strengths: ["Try the Fix Analysis button or retake the assessment"],
                  challenges: ["Analysis data is incomplete"],
                  growthSuggestions: ["Provide more detailed answers in your assessment"]
                });
              }
              
              // Ensure intelligence data is present
              if (!analysis.intelligence) {
                console.warn(`Analysis ${analysis.id} has no intelligence data, adding placeholder`);
                analysis.intelligence = {
                  type: "Analysis Incomplete",
                  score: 5,
                  description: "Intelligence analysis data was incomplete.",
                  domains: [{
                    name: "General Intelligence",
                    score: 5,
                    description: "Intelligence data was incomplete in this analysis."
                  }]
                };
              }
              
              return analysis;
            });
            
            // Sort by date (newest first) and update state
            const sortedAnalyses = sortAnalysesByDate(validatedAnalyses);
            actions.setAnalysisHistory(sortedAnalyses);
            console.log(`Setting ${sortedAnalyses.length} analyses in history state`);
            
            // Only update current analysis if not already set or if it's different
            if (!state.analysis || state.analysis.id !== sortedAnalyses[0].id) {
              actions.setAnalysis(sortedAnalyses[0]);
              
              // Only show toast on initial load or when analysis actually changes
              if (!state.lastRefresh || new Date().getTime() - state.lastRefresh.getTime() > 5000) {
                toast.success(`Loaded ${sortedAnalyses.length} analyses from cloud`);
              }
            }
            
            actions.setLastRefresh(new Date());
            actions.setIsLoading(false);
            refreshInProgressRef.current = false;
            refreshRetryCountRef.current = 0; // Reset retry counter on success
            return;
          } else {
            console.log("No analyses found in Supabase for user:", user.id);
          }
        } catch (fetchError) {
          console.error("Exception fetching analyses from Supabase:", fetchError);
          
          // Implement retry mechanism for better reliability
          if (refreshRetryCountRef.current < MAX_RETRIES) {
            refreshRetryCountRef.current++;
            console.log(`Retrying fetch (attempt ${refreshRetryCountRef.current}/${MAX_RETRIES})`);
            
            // Wait before retrying with exponential backoff
            const delay = Math.pow(2, refreshRetryCountRef.current) * 1000; // 2s, 4s, 8s
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Try again with the same function (recursive call)
            refreshInProgressRef.current = false;
            return await refreshAnalysis();
          }
          
          toast.error("Connection error while loading data", {
            description: "Check your internet connection"
          });
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
            toast.success(`Loaded ${sortedAnalyses.length} analyses from local storage`);
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
        console.log("Using local storage as fallback after error");
        const sortedAnalyses = sortAnalysesByDate(localAnalyses);
        actions.setAnalysisHistory(sortedAnalyses);
        actions.setAnalysis(sortedAnalyses[0]);
        toast.info(`Using ${sortedAnalyses.length} offline analyses as fallback`);
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
