
import { ComprehensiveAnalysis, DbComprehensiveAnalysis } from "./types";

/**
 * Maps database fields to application model fields for ComprehensiveAnalysis
 */
export function mapDbToComprehensiveAnalysis(dbData: DbComprehensiveAnalysis): ComprehensiveAnalysis {
  // Handle nested result field if present
  const resultData = dbData.result || {};
  
  return {
    id: dbData.id,
    created_at: dbData.created_at,
    user_id: dbData.user_id,
    assessment_id: dbData.assessment_id,
    overview: dbData.overview || resultData.overview || "",
    traits: dbData.traits || resultData.traits || [],
    intelligence: dbData.intelligence || resultData.intelligence || {},
    intelligenceScore: dbData.intelligence_score || resultData.intelligenceScore || 0,
    emotionalIntelligenceScore: dbData.emotional_intelligence_score || resultData.emotionalIntelligenceScore || 0,
    motivators: dbData.motivators || resultData.motivators || [],
    inhibitors: dbData.inhibitors || resultData.inhibitors || [],
    growthAreas: dbData.growth_areas || resultData.growthAreas || [],
    weaknesses: dbData.weaknesses || resultData.weaknesses || [],
    relationshipPatterns: dbData.relationship_patterns || resultData.relationshipPatterns || {},
    careerSuggestions: dbData.career_suggestions || resultData.careerSuggestions || [],
    roadmap: dbData.roadmap || resultData.roadmap || "",
    learningPathways: dbData.learning_pathways || resultData.learningPathways || []
  };
}

/**
 * Maps an array of database records to ComprehensiveAnalysis models
 */
export function mapDbArrayToComprehensiveAnalyses(dbData: DbComprehensiveAnalysis[]): ComprehensiveAnalysis[] {
  return dbData.map(item => mapDbToComprehensiveAnalysis(item));
}
