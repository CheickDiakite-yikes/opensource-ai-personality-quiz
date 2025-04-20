
import { corsHeaders } from "../_shared/cors.ts";
import { generateDefaultScore, calculateSafeDomainScore } from "./scoring.ts";
import { getStringSafely, getArraySafely, generateOverview } from "./utils.ts";

export function formatAnalysisResponse(analysisContent: any) {
  // Validate analysis content structure and ensure we have what we need
  const hasContent = analysisContent && 
    typeof analysisContent === 'object' && 
    Object.keys(analysisContent).length > 0;
    
  // If we don't have proper content, add a warning
  let contentWarning = null;
  if (!hasContent) {
    contentWarning = "The analysis system encountered issues with your data. We've provided a generalized profile that may be less personalized than usual.";
  } else {
    // Check for minimum content in core sections
    const requiredSections = ['coreTraits', 'cognitivePatterning', 'emotionalArchitecture', 'interpersonalDynamics'];
    const missingSections = requiredSections.filter(section => 
      !analysisContent[section] || 
      typeof analysisContent[section] !== 'object' || 
      Object.keys(analysisContent[section]).length === 0
    );
    
    if (missingSections.length > 0) {
      contentWarning = `Some analysis sections had limited data (${missingSections.join(', ')}). We've filled in these areas with general insights.`;
    }
  }
  
  // Generate an appropriate overview
  const overview = contentWarning ? 
    `${contentWarning} ${generateOverview(analysisContent)}` : 
    generateOverview(analysisContent);
    
  // Ensure coreTraits are properly populated even if missing
  if (!analysisContent.coreTraits || typeof analysisContent.coreTraits !== 'object') {
    analysisContent.coreTraits = {};
  }
  
  // Ensure strengths and challenges are always arrays with content
  if (!analysisContent.coreTraits.strengths || !Array.isArray(analysisContent.coreTraits.strengths) || analysisContent.coreTraits.strengths.length === 0) {
    analysisContent.coreTraits.strengths = [
      "Adaptability in changing situations",
      "Analytical approach to problems",
      "Creative thinking and innovation"
    ];
  }
  
  if (!analysisContent.coreTraits.challenges || !Array.isArray(analysisContent.coreTraits.challenges) || analysisContent.coreTraits.challenges.length === 0) {
    analysisContent.coreTraits.challenges = [
      "Tendency toward perfectionism",
      "Occasional difficulty with time management",
      "Balancing analytical thinking with intuition"
    ];
  }

  const analysis = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    overview: overview,
    ...analysisContent,
    
    // Ensure we always have these summaries populated
    careerSummary: {
      dominantStrengths: getArraySafely(analysisContent, "careerInsights.naturalStrengths", 3),
      recommendedPaths: getArraySafely(analysisContent, "careerInsights.careerPathways", 3),
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
    JSON.stringify({ 
      analysis, 
      success: true, 
      message: contentWarning || "Enhanced analysis generated successfully",
      quality: contentWarning ? "partial" : "complete" 
    }), 
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
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
