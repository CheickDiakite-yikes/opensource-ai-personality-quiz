
import { PersonalityAnalysis, Json } from '@/utils/types';

// Convert Supabase row data to PersonalityAnalysis object
export const convertToPersonalityAnalysis = (data: any): PersonalityAnalysis | null => {
  if (!data) return null;

  try {
    // Handle case where result contains the full analysis
    if (data.result && typeof data.result === 'object') {
      const result = data.result;
      
      return {
        id: data.id || result.id,
        createdAt: data.created_at || result.createdAt || new Date().toISOString(),
        overview: data.overview || result.overview || '',
        traits: data.traits || result.traits || [],
        intelligence: data.intelligence || result.intelligence || {},
        intelligenceScore: data.intelligence_score || result.intelligenceScore || 0,
        emotionalIntelligenceScore: data.emotional_intelligence_score || result.emotionalIntelligenceScore || 0,
        cognitiveStyle: data.cognitive_style || result.cognitiveStyle || '',
        valueSystem: data.value_system || result.valueSystem || [],
        motivators: data.motivators || result.motivators || [],
        inhibitors: data.inhibitors || result.inhibitors || [],
        weaknesses: data.weaknesses || result.weaknesses || [],
        growthAreas: data.growth_areas || result.growthAreas || [],
        shadowAspects: data.shadow_aspects || result.shadowAspects || [],
        relationshipPatterns: data.relationship_patterns || result.relationshipPatterns || [],
        careerSuggestions: data.career_suggestions || result.careerSuggestions || [],
        learningPathways: data.learning_pathways || result.learningPathways || [],
        roadmap: data.roadmap || result.roadmap || '',
        userId: data.user_id || result.userId,
        assessmentId: data.assessment_id || result.assessmentId,
      };
    }

    // Handle direct data format
    return {
      id: data.id,
      createdAt: data.created_at || new Date().toISOString(),
      overview: data.overview || '',
      traits: data.traits || [],
      intelligence: data.intelligence || {},
      intelligenceScore: data.intelligence_score || 0,
      emotionalIntelligenceScore: data.emotional_intelligence_score || 0,
      cognitiveStyle: data.cognitive_style || '',
      valueSystem: data.value_system || [],
      motivators: data.motivators || [],
      inhibitors: data.inhibitors || [],
      weaknesses: data.weaknesses || [],
      growthAreas: data.growth_areas || [],
      shadowAspects: data.shadow_aspects || [],
      relationshipPatterns: data.relationship_patterns || [],
      careerSuggestions: data.career_suggestions || [],
      learningPathways: data.learning_pathways || [],
      roadmap: data.roadmap || '',
      userId: data.user_id,
      assessmentId: data.assessment_id,
    };
  } catch (error) {
    console.error("Error converting analysis data:", error, data);
    return null;
  }
};

// Function to sort analyses by date, with newest first
export const sortAnalysesByDate = (analyses: PersonalityAnalysis[]): PersonalityAnalysis[] => {
  if (!analyses || !Array.isArray(analyses)) return [];
  
  return [...analyses].sort((a, b) => {
    const dateA = new Date(a.createdAt || '');
    const dateB = new Date(b.createdAt || '');
    return dateB.getTime() - dateA.getTime(); // Newest first
  });
};

// Convert any object to JSON-compatible format for Supabase
export const toJsonObject = (obj: any): Json => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => toJsonObject(item)) as Json[];
  }
  
  // Handle objects
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, Json> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = toJsonObject(value);
    }
    return result;
  }
  
  // Handle primitive values
  return obj as Json;
};
