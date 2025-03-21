import { PersonalityAnalysis, Json, PersonalityTrait, IntelligenceType, RelationshipPatterns } from "@/utils/types";
import { isValueSystemObject, isRelationshipObject, isCognitiveStyleObject } from "./typeGuards";

// Safely convert JSON arrays to string arrays
const safeJsonToStringArray = (json: Json | null | undefined): string[] => {
  if (!json) return [];
  if (Array.isArray(json)) {
    return json.filter(item => typeof item === 'string').map(item => String(item));
  }
  return [];
};

// Safely convert JSON to PersonalityTrait array
const safeJsonToTraits = (json: Json | null | undefined): PersonalityTrait[] => {
  if (!json) return [];
  if (Array.isArray(json)) {
    return json.filter(item => 
      typeof item === 'object' && 
      item !== null && 
      'trait' in item && 
      'score' in item && 
      'description' in item
    ).map(item => ({
      trait: String(item.trait || ''),
      score: Number(item.score || 0),
      description: String(item.description || ''),
      strengths: Array.isArray(item.strengths) ? item.strengths.map(s => String(s)) : [],
      challenges: Array.isArray(item.challenges) ? item.challenges.map(c => String(c)) : [],
      growthSuggestions: Array.isArray(item.growthSuggestions) ? item.growthSuggestions.map(g => String(g)) : []
    }));
  }
  return [];
};

// Safely convert JSON to IntelligenceType
const safeJsonToIntelligence = (json: Json | null | undefined): IntelligenceType => {
  if (!json || typeof json !== 'object' || json === null) {
    return { 
      type: '',
      score: 0, 
      description: '', 
      domains: []
    };
  }
  
  const obj = json as Record<string, any>;
  
  return {
    type: String(obj.type || ''),
    score: Number(obj.score || 0),
    description: String(obj.description || ''),
    domains: Array.isArray(obj.domains) 
      ? obj.domains.map((domain: any) => ({
          name: String(domain.name || ''),
          score: Number(domain.score || 0),
          description: String(domain.description || '')
        }))
      : []
  };
};

// Safely convert JSON to RelationshipPatterns
const safeJsonToRelationships = (json: Json | null | undefined): RelationshipPatterns | string[] => {
  if (!json) return [];
  
  if (Array.isArray(json)) {
    return json.map(item => String(item));
  }
  
  if (typeof json === 'object' && json !== null) {
    const obj = json as Record<string, any>;
    if ('strengths' in obj && 'challenges' in obj && 'compatibleTypes' in obj) {
      return {
        strengths: Array.isArray(obj.strengths) ? obj.strengths.map((s: any) => String(s)) : [],
        challenges: Array.isArray(obj.challenges) ? obj.challenges.map((c: any) => String(c)) : [],
        compatibleTypes: Array.isArray(obj.compatibleTypes) ? obj.compatibleTypes.map((t: any) => String(t)) : []
      };
    }
  }
  
  return [];
};

// Helper function to safely convert Supabase data to PersonalityAnalysis
export const convertToPersonalityAnalysis = (item: any): PersonalityAnalysis => {
  try {
    // Handle the case where result contains the full analysis
    if (item.result && typeof item.result === 'object') {
      // If we have a complete result object, use it as the base but ensure we convert the types correctly
      const result = item.result;
      
      return {
        id: String(item.id || result.id || ''),
        createdAt: String(item.created_at || result.createdAt || new Date().toISOString()),
        userId: String(item.user_id || result.userId || ''),
        assessmentId: String(item.assessment_id || result.assessmentId || ''),
        overview: String(result.overview || item.overview || ''),
        traits: safeJsonToTraits(result.traits || item.traits),
        intelligence: safeJsonToIntelligence(result.intelligence || item.intelligence),
        intelligenceScore: Number(result.intelligenceScore || item.intelligence_score || 0),
        emotionalIntelligenceScore: Number(result.emotionalIntelligenceScore || item.emotional_intelligence_score || 0),
        cognitiveStyle: typeof result.cognitiveStyle === 'string' 
          ? result.cognitiveStyle 
          : isCognitiveStyleObject(result.cognitiveStyle) 
            ? result.cognitiveStyle 
            : typeof item.cognitive_style === 'string'
              ? item.cognitive_style
              : '',
        valueSystem: isValueSystemObject(result.valueSystem) 
          ? result.valueSystem 
          : Array.isArray(result.valueSystem)
            ? result.valueSystem
            : safeJsonToStringArray(item.value_system),
        motivators: safeJsonToStringArray(result.motivators || item.motivators),
        inhibitors: safeJsonToStringArray(result.inhibitors || item.inhibitors),
        weaknesses: safeJsonToStringArray(result.weaknesses || item.weaknesses),
        growthAreas: safeJsonToStringArray(result.growthAreas || item.growth_areas),
        relationshipPatterns: isRelationshipObject(result.relationshipPatterns)
          ? result.relationshipPatterns
          : safeJsonToRelationships(item.relationship_patterns),
        careerSuggestions: safeJsonToStringArray(result.careerSuggestions || item.career_suggestions),
        learningPathways: safeJsonToStringArray(result.learningPathways || item.learning_pathways),
        roadmap: String(result.roadmap || item.roadmap || '')
      };
    }
    
    // Otherwise construct from individual fields with type safety
    return {
      id: String(item.id || ''),
      createdAt: String(item.created_at || new Date().toISOString()),
      overview: String(item.overview || ''),
      traits: safeJsonToTraits(item.traits),
      intelligence: safeJsonToIntelligence(item.intelligence),
      intelligenceScore: Number(item.intelligence_score || 0),
      emotionalIntelligenceScore: Number(item.emotional_intelligence_score || 0),
      cognitiveStyle: typeof item.cognitive_style === 'string' ? item.cognitive_style : '',
      valueSystem: Array.isArray(item.value_system) ? item.value_system : [],
      motivators: safeJsonToStringArray(item.motivators),
      inhibitors: safeJsonToStringArray(item.inhibitors),
      weaknesses: safeJsonToStringArray(item.weaknesses),
      growthAreas: safeJsonToStringArray(item.growth_areas),
      relationshipPatterns: safeJsonToRelationships(item.relationship_patterns),
      careerSuggestions: safeJsonToStringArray(item.career_suggestions),
      learningPathways: safeJsonToStringArray(item.learning_pathways),
      roadmap: String(item.roadmap || ''),
      userId: String(item.user_id || ''),
      assessmentId: String(item.assessment_id || '')
    };
  } catch (err) {
    console.error("Error converting analysis:", err, item);
    // Return a minimal valid object to prevent crashes
    return {
      id: String(item.id || ''),
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
      userId: String(item.user_id || ''),
      assessmentId: String(item.assessment_id || '')
    };
  }
};
