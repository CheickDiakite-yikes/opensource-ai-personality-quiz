
import { PersonalityAnalysis } from '@/utils/types';

/**
 * Converts a Supabase analysis record to the PersonalityAnalysis type
 */
export const convertToPersonalityAnalysis = (data: any): PersonalityAnalysis => {
  if (!data) return null as any;
  
  console.log("Converting analysis data:", data.id);
  
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
    growthAreas: ensureArray(data.growth_areas),
    shadowAspects: ensureArray(data.shadow_aspects),
    relationshipPatterns: relationshipPatterns,
    careerSuggestions: ensureArray(data.career_suggestions),
    learningPathways: ensureArray(data.learning_pathways),
    roadmap: data.roadmap || ''
  };
};

/**
 * Sorts an array of analyses by date, with newest first
 */
export const sortAnalysesByDate = (analyses: PersonalityAnalysis[]): PersonalityAnalysis[] => {
  if (!analyses || !Array.isArray(analyses)) return [];
  
  return [...analyses].sort((a, b) => {
    const dateA = new Date(a.createdAt || '');
    const dateB = new Date(b.createdAt || '');
    return dateB.getTime() - dateA.getTime(); // Newest first
  });
};

/**
 * Converts a PersonalityAnalysis to a JSON-compatible format for Supabase
 */
export const toJsonObject = (analysis: any): Record<string, any> => {
  // First convert the entire object to a string and back to handle circular references
  const jsonString = JSON.stringify(analysis);
  const jsonObject = JSON.parse(jsonString);
  
  // Process specific fields that need conversion
  if (analysis.traits && Array.isArray(analysis.traits)) {
    jsonObject.traits = analysis.traits.map((trait: any) => {
      if (typeof trait === 'object') {
        return { ...trait };
      }
      return trait;
    });
  }
  
  // Ensure all fields are JSON compatible
  Object.keys(jsonObject).forEach(key => {
    const value = jsonObject[key];
    if (typeof value === 'undefined') {
      jsonObject[key] = null;
    }
  });
  
  return jsonObject;
};
