
import { useState, useEffect, useCallback } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { loadAnalysisHistory, saveAnalysisToHistory } from "./analysis/useLocalStorage";
import { useAnalyzeResponses } from "./analysis/useAnalyzeResponses";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Helper function to safely convert Supabase data to PersonalityAnalysis
const convertToPersonalityAnalysis = (item: any): PersonalityAnalysis => {
  try {
    // Handle the case where result contains the full analysis
    if (item.result && typeof item.result === 'object') {
      return {
        ...item.result,
        id: item.id || item.result.id || '',
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
  } catch (err) {
    console.error("Error converting analysis:", err, item);
    // Return a minimal valid object to prevent crashes
    return {
      id: item.id || '',
      createdAt: new Date().toISOString(),
      overview: 'Error loading analysis',
      traits: [],
      intelligence: { type: '', score: 0, description: '', domains: [] },
      intelligenceScore: 0,
      emotionalIntelligenceScore: 0,
      cognitiveStyle: '',
      valueSystem: [],
      motivators: [],
      inhibitors: [],
      weaknesses: [],
      growthAreas: [],
      relationshipPatterns: [],
      careerSuggestions: [],
      learningPathways: [],
      roadmap: '',
      userId: item.user_id || '',
      assessmentId: item.assessment_id || ''
    };
  }
};

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();

  // Load analysis from Supabase if user is logged in, otherwise from localStorage
  const fetchAnalysis = useCallback(async () => {
    console.log("fetchAnalysis called, user:", user?.id || "no user", "session:", session ? "exists" : "none");
    setIsLoading(true);
    setError(null);
    
    try {
      if (user && session) {
        console.log("Fetching analysis from Supabase for user:", user.id);
        
        // Get the most recent analysis from Supabase with debugging
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        console.log("Supabase query executed, data:", data ? `${data.length} items` : "none", "error:", error || "none");
          
        if (error) {
          console.error("Error fetching analysis from Supabase:", error);
          toast.error("Failed to load your analysis data", {
            description: error.message
          });
          setError("Failed to load analysis data: " + error.message);
          
          // Fallback to localStorage
          const history = loadAnalysisHistory();
          setAnalysisHistory(history);
          
          if (history.length > 0) {
            setAnalysis(history[0]);
            console.log("Using first item from localStorage history as fallback");
          }
        } else if (data && data.length > 0) {
          console.log("Fetched analyses from Supabase:", data.length, "items");
          
          // Transform the data into our PersonalityAnalysis type with proper type safety
          const analyses: PersonalityAnalysis[] = data.map(item => convertToPersonalityAnalysis(item));
          console.log("Converted analyses:", analyses.length);
          
          // Save to history state
          setAnalysisHistory(analyses);
          
          // Set the most recent as current
          if (analyses.length > 0) {
            setAnalysis(analyses[0]);
            console.log("Set current analysis to first item:", analyses[0].id);
          }
          
          // Also update localStorage for offline access
          analyses.forEach(analysis => {
            saveAnalysisToHistory(analysis);
          });
          console.log("Saved analyses to localStorage");
        } else {
          console.log("No analyses found in Supabase, using localStorage");
          
          // Fallback to localStorage
          const history = loadAnalysisHistory();
          setAnalysisHistory(history);
          
          if (history.length > 0) {
            setAnalysis(history[0]);
            console.log("Using first item from localStorage history");
          } else {
            console.log("No analyses found in localStorage either");
            setAnalysis(null);
          }
        }
      } else {
        console.log("No user session, using localStorage only");
        // No user, just use localStorage
        const history = loadAnalysisHistory();
        setAnalysisHistory(history);
        
        if (history.length > 0) {
          setAnalysis(history[0]);
          console.log("Using first item from localStorage history (no user)");
        } else {
          console.log("No analyses found in localStorage (no user)");
          setAnalysis(null);
        }
      }
    } catch (error: any) {
      console.error("Unexpected error in fetchAnalysis:", error);
      setError("Unexpected error: " + error.message);
      
      // Fallback to localStorage
      const history = loadAnalysisHistory();
      setAnalysisHistory(history);
      
      if (history.length > 0) {
        setAnalysis(history[0]);
        console.log("Using first item from localStorage history after error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);
  
  // Fetch analysis when component mounts, user changes, or session changes
  useEffect(() => {
    console.log("useEffect in useAIAnalysis triggered");
    if (user) {
      console.log("User exists, fetching analysis for:", user.id);
      fetchAnalysis();
    } else if (!isLoading) {
      console.log("No user, loading from localStorage only");
      const history = loadAnalysisHistory();
      setAnalysisHistory(history);
      
      if (history.length > 0) {
        setAnalysis(history[0]);
        console.log("Set analysis from localStorage history");
      } else {
        setAnalysis(null);
        console.log("No analysis in localStorage");
      }
      setIsLoading(false);
    }
  }, [user, fetchAnalysis, isLoading]);

  // Function to save analysis to history
  const saveToHistory = (newAnalysis: PersonalityAnalysis) => {
    console.log("Saving analysis to history:", newAnalysis.id);
    const savedAnalysis = saveAnalysisToHistory(newAnalysis);
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
    console.log("Setting current analysis to:", analysisId);
    const selected = analysisHistory.find(item => item.id === analysisId);
    if (selected) {
      console.log("Found matching analysis:", selected.id);
      setAnalysis(selected);
      return true;
    }
    console.log("No matching analysis found for id:", analysisId);
    return false;
  };

  // Function to manually refresh the data
  const refreshAnalysis = () => {
    console.log("Manual refresh of analysis requested");
    return fetchAnalysis();
  };

  return {
    isAnalyzing,
    isLoading,
    error,
    analysis,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis
  };
};
