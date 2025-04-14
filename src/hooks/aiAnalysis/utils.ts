import { PersonalityAnalysis, PersonalityTrait, Intelligence, ValueSystem, CognitiveStyle } from "@/utils/types";

// Helper function to safely convert Supabase data to PersonalityAnalysis
export const convertToPersonalityAnalysis = (item: any): PersonalityAnalysis => {
  try {
    // Handle the case where result contains the full analysis
    if (item.result && typeof item.result === 'object') {
      // Create a base object with required fields
      const baseAnalysis = {
        id: item.id || item.result.id || '',
        createdAt: item.created_at || item.result.createdAt || new Date().toISOString(),
        // Optional fields for compatibility
        userId: item.user_id || item.result.userId,
        assessmentId: item.assessment_id || item.result.assessmentId
      };
      
      // If traits exist, ensure their scores are properly formatted and have all required properties
      let normalizedTraits: PersonalityTrait[] = [];
      if (item.result.traits && Array.isArray(item.result.traits)) {
        normalizedTraits = item.result.traits.map((trait: any) => ({
          // Add required fields if they don't exist
          name: trait.name || trait.trait || "Unknown trait",
          trait: trait.trait || trait.name || "Unknown trait", // Keep backwards compatibility
          score: trait.score || 0,
          description: trait.description || "No description available",
          impact: trait.impact || [],
          recommendations: trait.recommendations || [],
          strengths: trait.strengths || [],
          challenges: trait.challenges || [],
          growthSuggestions: trait.growthSuggestions || []
        }));
      }
      
      // Ensure intelligence has all required fields
      const normalizedIntelligence: Intelligence = {
        ...item.result.intelligence,
        type: item.result.intelligence?.type || "General Intelligence",
        score: item.result.intelligence?.score || 50,
        description: item.result.intelligence?.description || "No description available",
        // Add required fields if they don't exist
        strengths: item.result.intelligence?.strengths || [],
        areas_for_development: item.result.intelligence?.areas_for_development || [],
        learning_style: item.result.intelligence?.learning_style || "Visual",
        cognitive_preferences: item.result.intelligence?.cognitive_preferences || []
      };
      
      // Normalize cognitive style
      let cogStyle: CognitiveStyle;
      if (typeof item.result.cognitiveStyle === 'string') {
        cogStyle = {
          primary: item.result.cognitiveStyle,
          secondary: "Balanced",
          description: "Default cognitive style"
        };
      } else {
        cogStyle = {
          primary: item.result.cognitiveStyle?.primary || "Analytical",
          secondary: item.result.cognitiveStyle?.secondary || "Balanced",
          description: item.result.cognitiveStyle?.description || "Default cognitive style"
        };
      }
      
      // Normalize value system
      let valSystem: ValueSystem;
      if (Array.isArray(item.result.valueSystem)) {
        valSystem = {
          strengths: item.result.valueSystem || [],
          weaknesses: [],
          description: "Values derived from assessment"
        };
      } else {
        valSystem = {
          strengths: item.result.valueSystem?.strengths || [],
          weaknesses: item.result.valueSystem?.weaknesses || [],
          description: item.result.valueSystem?.description || "Values derived from assessment"
        };
      }
      
      // Merge with the result, but keep the base values if they're more reliable
      return {
        ...item.result,
        ...baseAnalysis,
        traits: normalizedTraits,
        intelligence: normalizedIntelligence,
        cognitiveStyle: cogStyle,
        valueSystem: valSystem,
        // Keep intelligence scores as-is (0-100 scale)
        intelligenceScore: item.result.intelligenceScore || item.intelligence_score || 50,
        emotionalIntelligenceScore: item.result.emotionalIntelligenceScore || item.emotional_intelligence_score || 50
      } as PersonalityAnalysis;
    }
    
    // Otherwise construct from individual fields with type safety and fallbacks
    let normalizedTraits: PersonalityTrait[] = [];
    if (item.traits && Array.isArray(item.traits) && item.traits.length > 0) {
      normalizedTraits = item.traits.map((trait: any) => ({
        name: trait.name || trait.trait || "Unknown trait",
        trait: trait.trait || trait.name || "Unknown trait", // Keep backwards compatibility
        score: trait.score || 0,
        description: trait.description || "No description available",
        impact: trait.impact || [],
        recommendations: trait.recommendations || [],
        strengths: trait.strengths || [],
        challenges: trait.challenges || [],
        growthSuggestions: trait.growthSuggestions || []
      }));
    } else {
      normalizedTraits = [{
        name: "Analysis Incomplete", 
        trait: "Analysis Incomplete",
        score: 5, 
        description: "This analysis didn't generate enough trait data.",
        impact: ["Limited insights available"],
        recommendations: ["Consider retaking the assessment"],
        strengths: ["Not available"],
        challenges: ["Not available"],
        growthSuggestions: ["Consider retaking the assessment"]
      }];
    }
    
    // Create default intelligence if missing
    const defaultIntelligence: Intelligence = { 
      type: 'General Intelligence', 
      score: 50, 
      description: 'Intelligence data was not fully processed.',
      strengths: ["Analytical thinking"],
      areas_for_development: ["Consider completing the full assessment"],
      learning_style: "Visual",
      cognitive_preferences: ["Logical reasoning"],
      domains: [{
        name: "General Intelligence",
        score: 50,
        description: "Intelligence data was incomplete in this analysis."
      }]
    };
    
    // Create normalized value system
    const valueSystem: ValueSystem = {
      strengths: Array.isArray(item.value_system) ? item.value_system : [],
      weaknesses: [],
      description: "Core values from assessment"
    };
    
    // Create normalized cognitive style
    const cognitiveStyle: CognitiveStyle = {
      primary: typeof item.cognitive_style === 'string' ? item.cognitive_style : 'Analytical',
      secondary: 'Balanced',
      description: 'Cognitive style preference'
    };
    
    return {
      id: item.id || '',
      createdAt: item.created_at || new Date().toISOString(),
      overview: item.overview || 'No overview available for this analysis.',
      traits: normalizedTraits,
      intelligence: item.intelligence ? {
        ...item.intelligence,
        strengths: item.intelligence.strengths || [],
        areas_for_development: item.intelligence.areas_for_development || [],
        learning_style: item.intelligence.learning_style || "Visual",
        cognitive_preferences: item.intelligence.cognitive_preferences || []
      } : defaultIntelligence,
      // Keep intelligence scores as-is (0-100 scale)
      intelligenceScore: item.intelligence_score || 50,
      emotionalIntelligenceScore: item.emotional_intelligence_score || 50,
      cognitiveStyle: cognitiveStyle,
      valueSystem: valueSystem,
      motivators: Array.isArray(item.motivators) ? item.motivators : [],
      inhibitors: Array.isArray(item.inhibitors) ? item.inhibitors : [],
      weaknesses: Array.isArray(item.weaknesses) ? item.weaknesses : [],
      growthAreas: Array.isArray(item.growth_areas) ? item.growth_areas : [],
      relationshipPatterns: {
        strengths: Array.isArray(item.relationship_patterns) ? item.relationship_patterns : [],
        challenges: [],
        compatibleTypes: []
      },
      careerSuggestions: Array.isArray(item.career_suggestions) ? item.careerSuggestions : [],
      learningPathways: Array.isArray(item.learning_pathways) ? item.learningPathways : [],
      roadmap: item.roadmap || '',
    } as PersonalityAnalysis;
  } catch (error) {
    console.error("Error converting Supabase data to PersonalityAnalysis:", error);
    console.error("Problematic data:", item);
    
    // Return a minimal valid object as fallback
    return {
      id: item?.id || `error-${Date.now()}`,
      createdAt: new Date().toISOString(),
      overview: "Error processing analysis data. Please try again.",
      traits: [{
        name: "Error Processing Data",
        trait: "Error Processing Data", 
        score: 5, 
        description: "There was an error processing your analysis data.",
        impact: ["Unable to determine impact"],
        recommendations: ["Please try taking the assessment again"],
        strengths: ["Not available due to error"],
        challenges: ["Not available due to error"],
        growthSuggestions: ["Please try taking the assessment again"]
      }],
      intelligence: { 
        type: 'Error', 
        score: 50, 
        description: 'Error processing intelligence data',
        strengths: [],
        areas_for_development: [],
        learning_style: "Visual",
        cognitive_preferences: [],
        domains: []
      },
      intelligenceScore: 50,
      emotionalIntelligenceScore: 50,
      cognitiveStyle: {
        primary: "Unknown",
        secondary: "Unknown",
        description: "Could not determine cognitive style"
      },
      valueSystem: {
        strengths: [],
        weaknesses: [],
        description: "Could not determine values"
      },
      motivators: [],
      inhibitors: [],
      weaknesses: [],
      growthAreas: [],
      relationshipPatterns: {
        strengths: [],
        challenges: [],
        compatibleTypes: []
      },
      careerSuggestions: [],
      learningPathways: [],
      roadmap: "Please retake the assessment for a personalized growth roadmap"
    } as PersonalityAnalysis;
  }
};

// Helper to normalize scores to ensure they're always in the 0-1 range
// IMPORTANT: This function is only used for internal calculations that need a 0-1 scale
export const normalizeScore = (score: any): number => {
  // If the score is already between 0 and 1, return it
  if (typeof score === 'number' && score >= 0 && score <= 1) {
    return score;
  }
  
  // If the score is a number greater than 1 but less than or equal to 10, normalize to 0-1
  if (typeof score === 'number' && score > 1 && score <= 10) {
    return score / 10;
  }
  
  // If the score is a number greater than 10, assume it's on a 0-100 scale
  if (typeof score === 'number' && score > 10) {
    return score / 100;
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
      const dateA = new Date(a.createdAt || "").getTime();
      const dateB = new Date(b.createdAt || "").getTime();
      return dateB - dateA; // Sort newest first
    } catch (e) {
      console.warn("Error sorting dates:", e);
      return 0; // Keep order if dates can't be parsed
    }
  });
};
