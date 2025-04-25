
import { PersonalityAnalysis } from '@/utils/types';

/**
 * Converts a Supabase analysis record to the PersonalityAnalysis type
 */
export const convertToPersonalityAnalysis = (data: any): PersonalityAnalysis => {
  if (!data) return null as any;
  
  // Handle the relationship patterns being either an object or array
  let relationshipPatterns = data.relationship_patterns;
  
  // If relationship_patterns is a string, try to parse it
  if (typeof relationshipPatterns === 'string') {
    try {
      relationshipPatterns = JSON.parse(relationshipPatterns);
    } catch (e) {
      // If parsing fails, treat it as an array of strings
      relationshipPatterns = [relationshipPatterns];
    }
  }
  
  // If it's neither an object with the expected structure nor an array, default to an empty object
  if (!relationshipPatterns || 
      (typeof relationshipPatterns !== 'object' && !Array.isArray(relationshipPatterns))) {
    relationshipPatterns = {
      strengths: [],
      challenges: [],
      compatibleTypes: []
    };
  }
  
  // Ensure traits is an array
  const traits = Array.isArray(data.traits) ? data.traits : [];
  
  // Ensure value system is an array
  const valueSystem = Array.isArray(data.value_system) ? data.value_system : 
                     (data.value_system ? [data.value_system] : []);
  
  // Normalize array fields
  const ensureArray = (field: any) => Array.isArray(field) ? field : (field ? [field] : []);
  
  return {
    id: data.id,
    createdAt: data.created_at || new Date().toISOString(),
    userId: data.user_id,
    assessmentId: data.assessment_id,
    overview: data.overview || '',
    traits: traits,
    intelligence: data.intelligence || {
      type: 'General',
      score: 0.5,
      description: 'No intelligence data available',
      domains: []
    },
    intelligenceScore: data.intelligence_score || 50,
    emotionalIntelligenceScore: data.emotional_intelligence_score || 50,
    cognitiveStyle: data.cognitive_style || 'Balanced',
    valueSystem: valueSystem,
    motivators: ensureArray(data.motivators),
    inhibitors: ensureArray(data.inhibitors),
    weaknesses: ensureArray(data.weaknesses),
    shadowAspects: ensureArray(data.shadow_aspects),
    growthAreas: ensureArray(data.growth_areas),
    relationshipPatterns: relationshipPatterns,
    careerSuggestions: ensureArray(data.career_suggestions),
    learningPathways: ensureArray(data.learning_pathways),
    roadmap: data.roadmap || ''
  };
};
