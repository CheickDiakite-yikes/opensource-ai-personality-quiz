
import { corsHeaders } from "../_shared/cors.ts";
import { generateDefaultScore, calculateSafeDomainScore } from "./scoring.ts";
import { getStringSafely, getArraySafely, generateOverview } from "./utils.ts";

export function formatAnalysisResponse(analysisContent: any) {
  const analysis = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    overview: generateOverview(analysisContent) || "Comprehensive personality analysis based on your assessment responses",
    core_traits: {
      primary: getStringSafely(analysisContent, "coreTraits.primary", "Analytical Thinker"),
      secondary: getStringSafely(analysisContent, "coreTraits.secondary", "Balanced Communicator"),
      strengths: getArraySafely(analysisContent, "coreTraits.strengths", ["Logical reasoning", "Detail orientation", "Structured approach"]),
      challenges: getArraySafely(analysisContent, "coreTraits.challenges", ["Perfectionism", "Overthinking", "Difficulty with ambiguity"]),
      tertiaryTraits: getArraySafely(analysisContent, "coreTraits.tertiaryTraits")
    },
    cognitive_patterning: analysisContent.cognitivePatterning || {
      decisionMaking: "Systematic and analytical approach to decision-making",
      learningStyle: "Detail-oriented learning with focus on understanding core principles",
      attention: "Strong ability to maintain focused attention on complex tasks",
      problemSolvingApproach: "Methodical problem-solving with emphasis on logic",
      informationProcessing: "Thorough and systematic information processing style",
      analyticalTendencies: "High capacity for detailed analysis and pattern recognition"
    },
    emotional_architecture: analysisContent.emotionalArchitecture || {
      emotionalAwareness: "Developing emotional self-awareness with room for growth",
      regulationStyle: "Balanced approach to emotional regulation",
      empathicCapacity: "Growing capacity for emotional understanding"
    },
    intelligence_score: calculateSafeDomainScore("cognitive"),
    emotional_intelligence_score: calculateSafeDomainScore("emotional"),
    response_patterns: {
      primaryChoice: analysisContent.responsePatterns?.primaryChoice || "balanced",
      secondaryChoice: analysisContent.responsePatterns?.secondaryChoice || "analytical"
    },
    growth_potential: {
      developmentAreas: getArraySafely(analysisContent, "growthPotential.developmentAreas"),
      recommendations: getArraySafely(analysisContent, "growthPotential.recommendations")
    },
    complete_analysis: {
      careerInsights: analysisContent.careerInsights || {
        naturalStrengths: ["Analytical thinking", "Strategic planning", "Problem-solving"],
        workplaceNeeds: ["Clear objectives", "Intellectual stimulation", "Structured environment"],
        leadershipStyle: "Thoughtful and systematic leadership approach",
        careerPathways: ["Data Analysis", "Strategic Planning", "Research"]
      },
      motivationalProfile: analysisContent.motivationalProfile || {
        primaryDrivers: ["Understanding", "Achievement", "Growth"],
        inhibitors: ["Perfectionism", "Analysis paralysis", "Risk aversion"],
        values: ["Logic", "Excellence", "Learning"]
      }
    }
  };

  return new Response(
    JSON.stringify({ 
      analysis, 
      success: true, 
      message: "Enhanced analysis generated successfully" 
    }), 
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
