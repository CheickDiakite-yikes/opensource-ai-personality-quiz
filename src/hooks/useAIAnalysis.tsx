
import { useAIAnalysisCore } from './aiAnalysis/useAIAnalysisCore';
import { PersonalityAnalysis, PersonalityTrait, IntelligenceType, RelationshipPatterns } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { convertToPersonalityAnalysis } from './aiAnalysis/utils';

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
      
      // Use the utility function to safely convert Supabase data to PersonalityAnalysis
      return convertToPersonalityAnalysis(data);
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
