
import { useState, useEffect, useCallback } from "react";
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

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Function to refresh analysis data from database
  const refreshAnalysis = useCallback(async () => {
    setIsLoading(true);
    console.log("useAIAnalysis: Refreshing analysis data");
    
    try {
      if (user) {
        console.log("useAIAnalysis: Fetching analysis from Supabase for user:", user.id);
        
        // Get the most recent analysis from Supabase
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error("Error fetching analysis from Supabase:", error);
          toast.error("Failed to load your analysis data");
          
          // Fallback to localStorage
          const history = loadAnalysisHistory();
          console.log("useAIAnalysis: Loaded history from localStorage:", history.length);
          setAnalysisHistory(history);
          
          if (history.length > 0 && !analysis) {
            console.log("useAIAnalysis: Setting first analysis from history:", history[0].id);
            setAnalysis(history[0]);
          }
        } else if (data && data.length > 0) {
          console.log("useAIAnalysis: Fetched analyses from Supabase:", data.length);
          
          // Transform the data into our PersonalityAnalysis type with proper type safety
          const analyses: PersonalityAnalysis[] = data.map(item => convertToPersonalityAnalysis(item));
          console.log("useAIAnalysis: Converted analyses:", analyses.map(a => a.id));
          
          // Save to history state
          setAnalysisHistory(analyses);
          
          // Set the most recent as current if no current selection
          if (!analysis) {
            console.log("useAIAnalysis: Setting first analysis:", analyses[0].id);
            setAnalysis(analyses[0]);
          }
          
          // Also update localStorage for offline access
          analyses.forEach(analysis => {
            saveAnalysisToHistory(analysis, analysisHistory);
          });
        } else {
          console.log("useAIAnalysis: No analyses found in Supabase, using localStorage");
          
          // Fallback to localStorage
          const history = loadAnalysisHistory();
          console.log("useAIAnalysis: Loaded history from localStorage:", history.length);
          setAnalysisHistory(history);
          
          if (history.length > 0 && !analysis) {
            console.log("useAIAnalysis: Setting first analysis from history:", history[0].id);
            setAnalysis(history[0]);
          }
        }
      } else {
        // No user, just use localStorage
        console.log("useAIAnalysis: No user, using localStorage");
        const history = loadAnalysisHistory();
        console.log("useAIAnalysis: Loaded history from localStorage:", history.length);
        setAnalysisHistory(history);
        
        if (history.length > 0 && !analysis) {
          console.log("useAIAnalysis: Setting first analysis from history:", history[0].id);
          setAnalysis(history[0]);
        }
      }
    } catch (error) {
      console.error("Error in refreshAnalysis:", error);
      
      // Fallback to localStorage
      const history = loadAnalysisHistory();
      console.log("useAIAnalysis: Loaded history from localStorage due to error:", history.length);
      setAnalysisHistory(history);
      
      if (history.length > 0 && !analysis) {
        console.log("useAIAnalysis: Setting first analysis from history after error:", history[0].id);
        setAnalysis(history[0]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, analysis, analysisHistory]);

  // Load analysis from Supabase if user is logged in, otherwise from localStorage
  useEffect(() => {
    refreshAnalysis();
  }, [refreshAnalysis]);

  // Function to save analysis to history
  const saveToHistory = (newAnalysis: PersonalityAnalysis) => {
    console.log("useAIAnalysis: Saving analysis to history:", newAnalysis.id);
    const savedAnalysis = saveAnalysisToHistory(newAnalysis, analysisHistory);
    // Update the history state
    setAnalysisHistory(prev => [savedAnalysis, ...prev.filter(a => a.id !== savedAnalysis.id)].slice(0, 10));
    return savedAnalysis;
  };

  // Use the analyze responses hook with the saveToHistory function
  const { isAnalyzing, analyzeResponses } = useAnalyzeResponses(saveToHistory, setAnalysis);

  // Utility functions for history management
  const getAnalysisHistory = () => {
    return analysisHistory;
  };

  const setCurrentAnalysis = (analysisId: string) => {
    console.log("useAIAnalysis: Setting current analysis to:", analysisId);
    console.log("useAIAnalysis: Available analyses:", analysisHistory.map(a => a.id));
    
    const selected = analysisHistory.find(item => item.id === analysisId);
    if (selected) {
      console.log("useAIAnalysis: Found matching analysis, setting as current");
      setAnalysis(selected);
      return true;
    }
    console.log("useAIAnalysis: No matching analysis found with ID:", analysisId);
    return false;
  };

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
