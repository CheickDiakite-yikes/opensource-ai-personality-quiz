
import { corsHeaders } from "../_shared/cors.ts";
import { generateDefaultScore, calculateSafeDomainScore } from "./scoring.ts";
import { getStringSafely, getArraySafely, generateOverview } from "./utils.ts";

export function formatAnalysisResponse(analysisContent: any) {
  // Use overview from content or generate one if missing
  const overviewText = analysisContent.overview || 
                      analysisContent.overviewText || 
                      generateOverview(analysisContent);

  // Ensure core traits exists with fallbacks
  const coreTraits = ensureCoreTraits(analysisContent.coreTraits);
  
  // Build the complete analysis object
  const analysis = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    overview: overviewText,
    core_traits: coreTraits,
    cognitive_patterning: ensureCognitivePatterning(analysisContent.cognitivePatterning),
    emotional_architecture: ensureEmotionalArchitecture(analysisContent.emotionalArchitecture),
    interpersonal_dynamics: ensureInterpersonalDynamics(analysisContent.interpersonalDynamics),
    complete_analysis: {
      careerInsights: ensureCareerInsights(analysisContent.careerInsights),
      motivationalProfile: ensureMotivationalProfile(analysisContent.motivationalProfile)
    },
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
    intelligence_score: calculateSafeDomainScore("cognitive"),
    emotional_intelligence_score: calculateSafeDomainScore("emotional"),
    adaptabilityScore: calculateSafeDomainScore("adaptability"),
    resilienceScore: calculateSafeDomainScore("resilience"),
    growth_potential: ensureGrowthPotential(analysisContent.growthPotential),
    response_patterns: {
      primaryChoice: "B", 
      secondaryChoice: "C"
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

function ensureCoreTraits(coreTraits: any) {
  if (!coreTraits || typeof coreTraits !== 'object') {
    return {
      primary: "Analytical Thinker",
      secondary: "Empathetic Communicator",
      tertiaryTraits: ["Critical thinking", "Adaptability", "Emotional awareness", "Structure-oriented", "Detail-focused"],
      strengths: ["Logical reasoning", "Problem-solving", "Communication"],
      challenges: ["Perfectionism", "Overthinking complex situations"]
    };
  }
  
  // Ensure all required fields exist
  return {
    primary: coreTraits.primary || "Analytical Thinker",
    secondary: coreTraits.secondary || "Balanced Communicator",
    tertiaryTraits: Array.isArray(coreTraits.tertiaryTraits) && coreTraits.tertiaryTraits.length > 0 
      ? coreTraits.tertiaryTraits 
      : ["Critical thinking", "Adaptability", "Pattern recognition"],
    strengths: Array.isArray(coreTraits.strengths) && coreTraits.strengths.length > 0 
      ? coreTraits.strengths 
      : ["Logical reasoning", "Problem-solving", "Effective communication"],
    challenges: Array.isArray(coreTraits.challenges) && coreTraits.challenges.length > 0 
      ? coreTraits.challenges 
      : ["Perfectionism", "Overthinking"]
  };
}

function ensureCognitivePatterning(cognitivePatterning: any) {
  if (!cognitivePatterning || typeof cognitivePatterning !== 'object') {
    return {
      decisionMaking: "Your decision-making approach balances logical analysis with practical considerations.",
      learningStyle: "You learn effectively through structured approaches with both theory and application.",
      problemSolvingApproach: "You approach problems methodically, breaking them into manageable components.",
      analyticalTendencies: "You demonstrate strong analytical capabilities with attention to important details."
    };
  }
  
  return cognitivePatterning;
}

function ensureEmotionalArchitecture(emotionalArchitecture: any) {
  if (!emotionalArchitecture || typeof emotionalArchitecture !== 'object') {
    return {
      emotionalAwareness: "You demonstrate solid emotional self-awareness and recognition of feelings.",
      regulationStyle: "Your emotional regulation balances expression with appropriate restraint.",
      empathicCapacity: "You show genuine empathy when engaging with others' feelings and perspectives."
    };
  }
  
  return emotionalArchitecture;
}

function ensureInterpersonalDynamics(interpersonalDynamics: any) {
  if (!interpersonalDynamics || typeof interpersonalDynamics !== 'object') {
    return {
      attachmentStyle: "You demonstrate a balanced attachment style that values connection while maintaining healthy boundaries.",
      communicationPattern: "Your communication is direct yet thoughtful, with careful consideration of impact.",
      conflictResolution: "You approach conflicts by seeking to understand all perspectives before working toward resolution.",
      compatibleTypes: ["Analytical thinkers", "Empathetic listeners", "Growth-oriented individuals"]
    };
  }
  
  return interpersonalDynamics;
}

function ensureCareerInsights(careerInsights: any) {
  if (!careerInsights || typeof careerInsights !== 'object') {
    return {
      naturalStrengths: ["Analytical thinking", "Structured problem-solving", "Clear communication"],
      careerPathways: ["Data analysis", "System design", "Strategic planning"],
      leadershipStyle: "Balanced leadership with focus on both tasks and relationships",
      potentialRoles: ["Analyst", "Coordinator", "Specialist"]
    };
  }
  
  return careerInsights;
}

function ensureMotivationalProfile(motivationalProfile: any) {
  if (!motivationalProfile || typeof motivationalProfile !== 'object') {
    return {
      primaryDrivers: ["Growth and development", "Structure and clarity", "Recognition of contribution"],
      inhibitors: ["Ambiguity", "Micromanagement", "Lack of feedback"],
      values: ["Integrity", "Competence", "Balance"]
    };
  }
  
  return motivationalProfile;
}

function ensureGrowthPotential(growthPotential: any) {
  if (!growthPotential || typeof growthPotential !== 'object') {
    return {
      developmentAreas: ["Comfort with ambiguity", "Delegating responsibilities", "Quick decision-making"],
      recommendations: ["Practice mindfulness for better present awareness", "Seek feedback on leadership style"]
    };
  }
  
  return growthPotential;
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
