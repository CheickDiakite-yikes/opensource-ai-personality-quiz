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
      
      // Merge with the result, but keep the base values if they're more reliable
      return {
        ...item.result,
        ...baseAnalysis
      } as PersonalityAnalysis;
    }
    
    // Otherwise construct from individual fields with type safety and fallbacks
    return {
      id: item.id || '',
      createdAt: item.created_at || new Date().toISOString(),
      overview: item.overview || 'No overview available for this analysis.',
      traits: Array.isArray(item.traits) && item.traits.length > 0 ? 
        item.traits : 
        [{
          trait: "Analysis Incomplete", 
          score: 5, 
          description: "This analysis didn't generate enough trait data.",
          strengths: ["Not available"],
          challenges: ["Not available"],
          growthSuggestions: ["Consider retaking the assessment"]
        }],
      intelligence: item.intelligence || { 
        type: 'General Intelligence', 
        score: 50, 
        description: 'Intelligence data was not fully processed.',
        domains: [{
          name: "General Intelligence",
          score: 5,
          description: "Intelligence data was incomplete in this analysis."
        }]
      },
      intelligenceScore: typeof item.intelligence_score === 'number' ? item.intelligence_score : 50,
      emotionalIntelligenceScore: typeof item.emotional_intelligence_score === 'number' ? item.emotional_intelligence_score : 50,
      cognitiveStyle: item.cognitive_style || 'Not determined',
      valueSystem: Array.isArray(item.value_system) ? item.value_system : [],
      motivators: Array.isArray(item.motivators) ? item.motivators : [],
      inhibitors: Array.isArray(item.inhibitors) ? item.inhibitors : [],
      weaknesses: Array.isArray(item.weaknesses) ? item.weaknesses : [],
      shadowAspects: Array.isArray(item.shadow_aspects) ? item.shadow_aspects : [],
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
        score: 5, 
        description: "There was an error processing your analysis data.",
        strengths: ["Not available due to error"],
        challenges: ["Not available due to error"],
        growthSuggestions: ["Please try taking the assessment again"]
      }],
      intelligence: { 
        type: 'Error', 
        score: 50, 
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
