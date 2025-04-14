
import { ComprehensiveAnalysis, DbComprehensiveAnalysis } from "./types";

/**
 * Maps database fields to application model fields for ComprehensiveAnalysis
 * Enhanced to handle all types of database responses and data structures
 */
export function mapDbToComprehensiveAnalysis(dbData: DbComprehensiveAnalysis): ComprehensiveAnalysis {
  // Handle case when data is null or undefined
  if (!dbData) return null;
  
  // CRITICAL FIX: More robust handling of nested data
  // Handle nested result field if present
  const resultData = dbData.result || {};
  
  // Extract data with fallbacks from both the root level and result field 
  const getFieldWithFallback = (field: string, fallback: any = null) => {
    // Try root level object first
    if (dbData[field] !== undefined && dbData[field] !== null) {
      return dbData[field];
    }
    
    // Then try camelCase variant at root level (for fields like intelligence_score vs intelligenceScore)
    const camelField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    if (dbData[camelField] !== undefined && dbData[camelField] !== null) {
      return dbData[camelField];
    }
    
    // Then check in result object with snake_case
    if (resultData[field] !== undefined && resultData[field] !== null) {
      return resultData[field];
    }
    
    // Then check in result object with camelCase
    if (resultData[camelField] !== undefined && resultData[camelField] !== null) {
      return resultData[camelField];
    }
    
    // Finally return fallback value
    return fallback;
  };
  
  // CRITICAL FIX: Handle array fields more robustly, by ensuring we always get an array
  const getArrayField = (field: string): any[] => {
    const value = getFieldWithFallback(field, []);
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [];
      } catch (e) {
        return [value]; // Convert string to single-item array
      }
    }
    return [];
  };
  
  // CRITICAL FIX: Handle object fields more robustly
  const getObjectField = (field: string): any => {
    const value = getFieldWithFallback(field, {});
    if (typeof value === 'object' && value !== null) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return {};
      }
    }
    return {};
  };
  
  // CRITICAL FIX: Ensure all fields are properly mapped from snake_case to camelCase with robust fallbacks
  return {
    id: dbData.id,
    created_at: dbData.created_at || new Date().toISOString(),
    user_id: dbData.user_id || resultData.user_id || null,
    assessment_id: dbData.assessment_id || resultData.assessment_id || null,
    overview: getFieldWithFallback('overview', ''),
    traits: getArrayField('traits'),
    intelligence: getObjectField('intelligence'),
    intelligenceScore: getFieldWithFallback('intelligence_score', 0),
    emotionalIntelligenceScore: getFieldWithFallback('emotional_intelligence_score', 0),
    motivators: getArrayField('motivators'),
    inhibitors: getArrayField('inhibitors'),
    growthAreas: getArrayField('growth_areas'),
    weaknesses: getArrayField('weaknesses'),
    relationshipPatterns: getObjectField('relationship_patterns'),
    careerSuggestions: getArrayField('career_suggestions'),
    roadmap: getFieldWithFallback('roadmap', ''),
    learningPathways: getArrayField('learning_pathways')
  };
}

/**
 * Maps an array of database records to ComprehensiveAnalysis models
 * Enhanced with better error handling
 */
export function mapDbArrayToComprehensiveAnalyses(dbData: DbComprehensiveAnalysis[]): ComprehensiveAnalysis[] {
  if (!dbData || !Array.isArray(dbData)) return [];
  
  // CRITICAL FIX: Add filtering to remove invalid items and detailed logging
  const result = dbData
    .filter(item => !!item && typeof item === 'object')
    .map(item => {
      try {
        return mapDbToComprehensiveAnalysis(item);
      } catch (error) {
        console.error(`Error mapping analysis item:`, error, item);
        return null;
      }
    })
    .filter(Boolean);
    
  console.log(`Successfully mapped ${result.length} of ${dbData.length} analyses`);
  return result;
}
