
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { PersonalityAnalysis } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';

// Main hook for accessing AI analysis functionality
export const useAIAnalysis = () => {
  const {
    analysis,
    isLoading,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis
  } = useAIAnalysisCore();

  // Add function to get analysis by ID (for shared profiles)
  const getAnalysisById = async (id: string): Promise<PersonalityAnalysis | null> => {
    try {
      // Fetch analysis directly from Supabase
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching analysis:", error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Transform the database result to match PersonalityAnalysis structure
      return {
        id: data.id,
        createdAt: data.created_at,
        overview: data.overview || '',
        traits: data.traits || [],
        intelligence: data.intelligence || { type: '', score: 0, description: '', domains: [] },
        intelligenceScore: data.intelligence_score || 0,
        emotionalIntelligenceScore: data.emotional_intelligence_score || 0,
        cognitiveStyle: data.cognitive_style || '',
        valueSystem: data.value_system || [],
        motivators: data.motivators || [],
        inhibitors: data.inhibitors || [],
        weaknesses: data.weaknesses || [],
        growthAreas: data.growth_areas || [],
        relationshipPatterns: data.relationship_patterns || [],
        careerSuggestions: data.career_suggestions || [],
        learningPathways: data.learning_pathways || [],
        roadmap: data.roadmap || '',
        userId: data.user_id,
        assessmentId: data.assessment_id
      };
    } catch (error) {
      console.error("Error in getAnalysisById:", error);
      return null;
    }
  };

  return {
    analysis,
    isLoading,
    isAnalyzing,
    analyzeResponses,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis,
    getAnalysisById
  };
};
