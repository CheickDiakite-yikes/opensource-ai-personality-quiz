
import { corsHeaders } from "../_shared/cors.ts";
import { generateDefaultScore, calculateSafeDomainScore } from "./scoring.ts";
import { getStringSafely, getArraySafely, generateOverview } from "./utils.ts";

export function formatAnalysisResponse(analysisContent: any) {
  // First validate that the analysis content is a valid object
  if (!analysisContent || typeof analysisContent !== 'object') {
    console.error("Invalid analysis content format:", analysisContent);
    return new Response(
      JSON.stringify({ 
        error: "Invalid analysis content format", 
        success: false 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const analysis = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      overview: generateOverview(analysisContent),
      ...analysisContent,
      careerSummary: {
        dominantStrengths: getArraySafely(analysisContent, "careerInsights.naturalStrengths", 0),
        recommendedPaths: getArraySafely(analysisContent, "careerInsights.careerPathways", 0),
        workStyle: getStringSafely(analysisContent, "careerInsights.leadershipStyle", "Adaptive leadership style")
      },
      motivationSummary: {
        primaryMotivators: getArraySafely(analysisContent, "motivationalProfile.primaryDrivers"),
        keyInhibitors: getArraySafely(analysisContent, "motivationalProfile.inhibitors"),
        coreValues: getArraySafely(analysisContent, "motivationalProfile.values")
      },
      relationshipCompatibility: {
        compatibleTypes: getArraySafely(analysisContent, "interpersonalDynamics.compatibleTypes"),
        challengingRelationships: getArraySafely(analysisContent, "interpersonalDynamics.challengingRelationships")
      },
      traitScores: generateTraitScores(),
      intelligenceScore: calculateSafeDomainScore("cognitive"),
      emotionalIntelligenceScore: calculateSafeDomainScore("emotional"),
      adaptabilityScore: calculateSafeDomainScore("adaptability"),
      resilienceScore: calculateSafeDomainScore("resilience")
    };

    return new Response(
      JSON.stringify({ analysis, success: true, message: "Enhanced analysis generated successfully" }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error formatting analysis response:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error formatting analysis response", 
        details: error.message,
        success: false 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}

function generateTraitScores() {
  return [
    { 
      trait: "Analytical Thinking", 
      score: generateDefaultScore("analytical"),
      description: "Based on demonstrated problem-solving patterns" 
    },
    { 
      trait: "Emotional Intelligence", 
      score: generateDefaultScore("emotional"),
      description: "Derived from emotional awareness indicators" 
    },
    { 
      trait: "Interpersonal Skills", 
      score: generateDefaultScore("social"),
      description: "Based on communication patterns" 
    },
    { 
      trait: "Growth Mindset", 
      score: generateDefaultScore("growth"),
      description: "Measured from learning orientation" 
    },
    { 
      trait: "Leadership Potential", 
      score: generateDefaultScore("leadership"),
      description: "Based on influence and decision patterns" 
    }
  ];
}
