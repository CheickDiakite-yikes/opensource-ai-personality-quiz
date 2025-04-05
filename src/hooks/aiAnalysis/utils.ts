import { PersonalityAnalysis } from "@/utils/types";

// Helper function to safely convert Supabase data to PersonalityAnalysis
export const convertToPersonalityAnalysis = (item: any): PersonalityAnalysis => {
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
export const sortAnalysesByDate = (analyses: PersonalityAnalysis[]): PersonalityAnalysis[] => {
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
