import { useState, useEffect } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { loadAnalysisHistory, saveAnalysisToHistory } from "./analysis/useLocalStorage";
import { useAnalyzeResponses } from "./analysis/useAnalyzeResponses";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load analysis from Supabase if user is logged in, otherwise from localStorage
  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          console.log("Fetching analysis from Supabase for user:", user.id);
          
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
            setAnalysisHistory(history);
            
            if (history.length > 0) {
              setAnalysis(history[0]);
            }
          } else if (data && data.length > 0) {
            console.log("Fetched analyses from Supabase:", data);
            
            // Transform the data into our PersonalityAnalysis type
            const analyses: PersonalityAnalysis[] = data.map(item => {
              // If result contains the full analysis, use that
              if (item.result && typeof item.result === 'object') {
                return item.result as PersonalityAnalysis;
              }
              
              // Otherwise construct from individual fields
              return {
                id: item.id,
                createdAt: item.created_at,
                overview: item.overview || "",
                traits: item.traits || [],
                intelligence: item.intelligence || { type: "", score: 0, description: "", domains: [] },
                intelligenceScore: item.intelligence_score || 0,
                emotionalIntelligenceScore: item.emotional_intelligence_score || 0,
                cognitiveStyle: item.cognitive_style || "",
                valueSystem: item.value_system || [],
                motivators: item.motivators || [],
                inhibitors: item.inhibitors || [],
                weaknesses: item.weaknesses || [],
                growthAreas: item.growth_areas || [],
                relationshipPatterns: item.relationship_patterns || [],
                careerSuggestions: item.career_suggestions || [],
                learningPathways: item.learning_pathways || [],
                roadmap: item.roadmap || "",
                userId: item.user_id,
                assessmentId: item.assessment_id
              };
            });
            
            // Save to history state
            setAnalysisHistory(analyses);
            
            // Set the most recent as current
            if (analyses.length > 0) {
              setAnalysis(analyses[0]);
            }
            
            // Also update localStorage for offline access
            analyses.forEach(analysis => {
              saveAnalysisToHistory(analysis, analysisHistory);
            });
          } else {
            console.log("No analyses found in Supabase, using localStorage");
            
            // Fallback to localStorage
            const history = loadAnalysisHistory();
            setAnalysisHistory(history);
            
            if (history.length > 0) {
              setAnalysis(history[0]);
            }
          }
        } else {
          // No user, just use localStorage
          const history = loadAnalysisHistory();
          setAnalysisHistory(history);
          
          if (history.length > 0) {
            setAnalysis(history[0]);
          }
        }
      } catch (error) {
        console.error("Error in fetchAnalysis:", error);
        
        // Fallback to localStorage
        const history = loadAnalysisHistory();
        setAnalysisHistory(history);
        
        if (history.length > 0) {
          setAnalysis(history[0]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [user]);

  // Function to save analysis to history
  const saveToHistory = (newAnalysis: PersonalityAnalysis) => {
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
    const selected = analysisHistory.find(item => item.id === analysisId);
    if (selected) {
      setAnalysis(selected);
      return true;
    }
    return false;
  };

  return {
    isAnalyzing,
    isLoading,
    analysis,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis
  };
};
