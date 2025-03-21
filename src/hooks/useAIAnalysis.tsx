
import { useState, useEffect, useCallback, useRef } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { loadAnalysisHistory, saveAnalysisToHistory } from "./analysis/useLocalStorage";
import { useAnalyzeResponses } from "./analysis/useAnalyzeResponses";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Helper function to safely convert Supabase data to PersonalityAnalysis
const convertToPersonalityAnalysis = (item: any): PersonalityAnalysis => {
  // Handle the case where result contains the full analysis
  if (item.result && typeof item.result === 'object') {
    return {
      ...item.result,
      id: item.id || item.result.id || '',
      createdAt: item.created_at || item.result.createdAt || new Date().toISOString(),
      userId: item.user_id || item.result.userId || '',
      assessmentId: item.assessment_id || item.result.assessmentId || ''
    } as PersonalityAnalysis;
  }
  
  // Otherwise construct from individual fields with type safety
  return {
    id: item.id || '',
    createdAt: item.created_at || new Date().toISOString(),
    overview: item.overview || '',
    traits: Array.isArray(item.traits) ? item.traits : [],
    intelligence: item.intelligence || { type: '', score: 0, description: '', domains: [] },
    intelligenceScore: typeof item.intelligence_score === 'number' ? item.intelligence_score : 0,
    emotionalIntelligenceScore: typeof item.emotional_intelligence_score === 'number' ? item.emotional_intelligence_score : 0,
    cognitiveStyle: item.cognitive_style || '',
    valueSystem: Array.isArray(item.value_system) ? item.value_system : [],
    motivators: Array.isArray(item.motivators) ? item.motivators : [],
    inhibitors: Array.isArray(item.inhibitors) ? item.inhibitors : [],
    weaknesses: Array.isArray(item.weaknesses) ? item.weaknesses : [],
    growthAreas: Array.isArray(item.growth_areas) ? item.growth_areas : [],
    relationshipPatterns: Array.isArray(item.relationship_patterns) ? item.relationship_patterns : [],
    careerSuggestions: Array.isArray(item.career_suggestions) ? item.career_suggestions : [],
    learningPathways: Array.isArray(item.learning_pathways) ? item.learning_pathways : [],
    roadmap: item.roadmap || '',
    userId: item.user_id || '',
    assessmentId: item.assessment_id || ''
  };
};

// Helper to sort analyses by creation date (newest first)
const sortAnalysesByDate = (analyses: PersonalityAnalysis[]): PersonalityAnalysis[] => {
  return [...analyses].sort((a, b) => {
    // Try to parse dates and compare them
    try {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Sort newest first
    } catch (e) {
      return 0; // Keep order if dates can't be parsed
    }
  });
};

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { user } = useAuth();
  const refreshInProgress = useRef(false);

  // Function to refresh analysis data from database with debounce and locking
  const refreshAnalysis = useCallback(async () => {
    // Prevent concurrent refresh operations
    if (refreshInProgress.current) return;
    
    // Only refresh if it's been at least 5 seconds since the last refresh
    const now = new Date();
    const timeSinceLastRefresh = now.getTime() - lastRefresh.getTime();
    
    if (timeSinceLastRefresh < 5000 && analysisHistory.length > 0) {
      // Skip refresh if it's been less than 5 seconds and we have data
      return;
    }
    
    refreshInProgress.current = true;
    setIsLoading(true);
    setLastRefresh(now);
    
    try {
      if (user) {
        // Get analyses from Supabase
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error("Error fetching analysis from Supabase:", error);
          
          // Fallback to localStorage without updating state if we already have data
          if (analysisHistory.length === 0) {
            const history = loadAnalysisHistory();
            const sortedHistory = sortAnalysesByDate(history);
            setAnalysisHistory(sortedHistory);
            
            if (sortedHistory.length > 0 && !analysis) {
              setAnalysis(sortedHistory[0]);
            }
          }
        } else if (data && data.length > 0) {
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
              saveAnalysisToHistory(analysis, sortedAnalyses);
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
      refreshInProgress.current = false;
    }
  }, [user, analysis, analysisHistory, lastRefresh]);

  // Load analysis once on mount
  useEffect(() => {
    refreshAnalysis();
  }, [refreshAnalysis]);

  // Function to save analysis to history
  const saveToHistory = (newAnalysis: PersonalityAnalysis) => {
    const savedAnalysis = saveAnalysisToHistory(newAnalysis, analysisHistory);
    // Update the history state - always keep sorted by date
    setAnalysisHistory(prev => sortAnalysesByDate([savedAnalysis, ...prev.filter(a => a.id !== savedAnalysis.id)]));
    return savedAnalysis;
  };

  // Use the analyze responses hook with the saveToHistory function
  const { isAnalyzing, analyzeResponses } = useAnalyzeResponses(saveToHistory, setAnalysis);

  // Utility functions for history management
  const getAnalysisHistory = useCallback(() => {
    return analysisHistory;
  }, [analysisHistory]);

  const setCurrentAnalysis = useCallback((analysisId: string) => {
    const selected = analysisHistory.find(item => item.id === analysisId);
    if (selected) {
      setAnalysis(selected);
      return true;
    }
    return false;
  }, [analysisHistory]);

  return {
    isAnalyzing,
    isLoading,
    analysis,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis
  };
};
