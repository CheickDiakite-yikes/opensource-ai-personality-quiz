import { PersonalityAnalysis } from "@/utils/types";

// Helper function to safely convert Supabase data to PersonalityAnalysis
export const convertToPersonalityAnalysis = (item: any): PersonalityAnalysis => {
  try {
    // Handle the case where result contains the full analysis
    if (item.result && typeof item.result === 'object') {
      // Create a base object with required fields
      const baseAnalysis = {
        id: item.id || item.result.id || '',
        createdAt: item.created_at || item.result.createdAt || new Date().toISOString(),
        userId: item.user_id || item.result.userId || '',
        assessmentId: item.assessment_id || item.result.assessmentId || ''
      };
      
      // If traits exist, normalize their scores
      let normalizedTraits = item.result.traits;
      if (normalizedTraits && Array.isArray(normalizedTraits)) {
        normalizedTraits = normalizedTraits.map(trait => ({
          ...trait,
          score: normalizeScore(trait.score)
        }));
      }
      
      // Merge with the result, but keep the base values if they're more reliable
      return {
        ...item.result,
        ...baseAnalysis,
        traits: normalizedTraits || item.result.traits
      } as PersonalityAnalysis;
    }
    
    // Otherwise construct from individual fields with type safety and fallbacks
    // Normalize traits scores if they exist
    let normalizedTraits = item.traits;
    if (normalizedTraits && Array.isArray(normalizedTraits) && normalizedTraits.length > 0) {
      normalizedTraits = normalizedTraits.map(trait => ({
        ...trait,
        score: normalizeScore(trait.score)
      }));
    } else {
      normalizedTraits = [{
        trait: "Analysis Incomplete", 
        score: 0.5, 
        description: "This analysis didn't generate enough trait data.",
        strengths: ["Not available"],
        challenges: ["Not available"],
        growthSuggestions: ["Consider retaking the assessment"]
      }];
    }
    
    return {
      id: item.id || '',
      createdAt: item.created_at || new Date().toISOString(),
      overview: item.overview || 'No overview available for this analysis.',
      traits: normalizedTraits,
      intelligence: item.intelligence || { 
        type: 'General Intelligence', 
        score: 0.5, 
        description: 'Intelligence data was not fully processed.',
        domains: [{
          name: "General Intelligence",
          score: 0.5,
          description: "Intelligence data was incomplete in this analysis."
        }]
      },
      intelligenceScore: normalizeScore(item.intelligence_score) * 100,
      emotionalIntelligenceScore: normalizeScore(item.emotional_intelligence_score) * 100,
      cognitiveStyle: item.cognitive_style || 'Not determined',
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
  } catch (error) {
    console.error("Error converting Supabase data to PersonalityAnalysis:", error);
    console.error("Problematic data:", item);
    
    // Return a minimal valid object as fallback
    return {
      id: item?.id || `error-${Date.now()}`,
      createdAt: new Date().toISOString(),
      overview: "Error processing analysis data. Please try again.",
      traits: [{
        trait: "Error Processing Data", 
        score: 0.5, 
        description: "There was an error processing your analysis data.",
        strengths: ["Not available due to error"],
        challenges: ["Not available due to error"],
        growthSuggestions: ["Please try taking the assessment again"]
      }],
      intelligence: { 
        type: 'Error', 
        score: 0.5, 
        description: 'Error processing intelligence data',
        domains: []
      },
      intelligenceScore: 50,
      emotionalIntelligenceScore: 50,
      userId: item?.user_id || '',
      assessmentId: item?.assessment_id || ''
    } as PersonalityAnalysis;
  }
};

// Helper to normalize scores to ensure they're always in the 0-1 range
export const normalizeScore = (score: any): number => {
  // If the score is already between 0 and 1, return it
  if (typeof score === 'number' && score >= 0 && score <= 1) {
    return score;
  }
  
  // If the score is a number greater than 1 but less than or equal to 100, normalize to 0-1
  if (typeof score === 'number' && score > 1 && score <= 100) {
    return score / 100;
  }
  
  // If the score is a number greater than 100, cap at 1
  if (typeof score === 'number' && score > 100) {
    return 1;
  }
  
  // If the score is a string, try to parse and normalize
  if (typeof score === 'string') {
    try {
      const parsedScore = parseFloat(score);
      if (!isNaN(parsedScore)) {
        return normalizeScore(parsedScore);
      }
    } catch (e) {
      // Parsing failed, fallback to default
    }
  }
  
  // Default fallback
  return 0.5;
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
      console.warn("Error sorting dates:", e);
      return 0; // Keep order if dates can't be parsed
    }
  });
};
