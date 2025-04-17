
import { DeepInsightResponses } from "../types";
import { AnalysisData } from "./analysis/types";
import { PersonalityAnalysis } from "@/utils/types";
import { analyzeResponsePatterns } from "./analysis/patternAnalyzer";
import { determinePersonalityTraits } from "./analysis/personalityTraits";
import { generateStrengthsChallenges } from "./analysis/strengthsChallenges";
import { v4 as uuidv4 } from "uuid";

// Main export function that the hook will call
export const generateAnalysisFromResponses = (responses: DeepInsightResponses): AnalysisData => {
  // Analyze response patterns
  const { 
    percentages, 
    primaryChoice, 
    secondaryChoice, 
    responseSignature 
  } = analyzeResponsePatterns(responses);
  
  // Determine personality traits
  const { 
    primaryTrait, 
    analyticalScore, 
    emotionalScore, 
    adaptabilityScore,
    decisionMakingStyle,
    learningStyle,
    emotionalAwareness
  } = determinePersonalityTraits(primaryChoice);
  
  // Get secondary trait
  const secondaryTrait = determineSecondaryTrait(secondaryChoice);
  
  // Generate strengths and challenges
  const { 
    strengths, 
    challenges, 
    growthAreas, 
    recommendations 
  } = generateStrengthsChallenges(primaryChoice, secondaryChoice);
  
  // Create metadata
  const uniqueId = `analysis-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  
  // Generate final analysis
  return {
    id: uniqueId,
    createdAt: now,
    overview: `Based on your unique response pattern (${responseSignature}), you appear to be primarily a ${primaryTrait} with strong ${secondaryTrait} tendencies. Your responses reveal a thoughtful approach to various situations, with particular strengths in ${strengths.slice(0, 2).join(" and ")}. You demonstrate a balanced combination of analytical thinking, emotional awareness, and adaptability, with your strongest dimension being your ${primaryChoice === 'a' ? 'analytical capabilities' : primaryChoice === 'b' ? 'emotional intelligence' : primaryChoice === 'c' ? 'adaptability' : 'creative vision'}.`,
    traits: [
      {
        trait: "Analytical Thinking",
        score: analyticalScore,
        description: "Your analytical abilities help you understand complex situations and make reasoned decisions.",
        strengths: ["Methodical problem-solving", "Critical evaluation", "Pattern recognition"],
        challenges: ["May sometimes overthink decisions", "Could benefit from trusting intuition more"],
        growthSuggestions: ["Balance analysis with action", "Incorporate more intuitive approaches"]
      },
      {
        trait: "Emotional Intelligence",
        score: emotionalScore,
        description: "Your emotional awareness influences how you understand yourself and connect with others.",
        strengths: ["Self-awareness", "Empathy", "Relationship management"],
        challenges: ["Balancing emotional needs with practical considerations"],
        growthSuggestions: ["Practice mindfulness to deepen emotional awareness", "Seek feedback on interpersonal interactions"]
      },
      {
        trait: "Adaptability",
        score: adaptabilityScore,
        description: "Your flexibility in handling change and new situations is a key part of your approach to life.",
        strengths: ["Willingness to adjust when necessary", "Resilience when facing obstacles"],
        challenges: ["May need time to fully embrace major changes"],
        growthSuggestions: ["Intentionally seek new experiences", "Practice reframing challenges as opportunities"]
      }
    ],
    intelligence: {
      type: "Integrated",
      score: (analyticalScore + emotionalScore) / 2,
      description: "You exhibit balanced capabilities across analytical, emotional, and practical domains.",
      domains: [
        { name: "Logical-Mathematical", score: analyticalScore, description: "Your analytical and systematic thinking abilities." },
        { name: "Interpersonal", score: emotionalScore, description: "Your understanding of others' motivations and feelings." },
        { name: "Adaptability", score: adaptabilityScore, description: "Your ability to adjust to new situations and information." }
      ]
    },
    intelligenceScore: Math.round((analyticalScore + emotionalScore + adaptabilityScore) / 3),
    emotionalIntelligenceScore: Math.round(emotionalScore),
    cognitiveStyle: {
      primary: primaryTrait,
      secondary: secondaryTrait,
      description: `Your thinking style combines elements of ${primaryTrait.toLowerCase()} approaches with ${secondaryTrait.toLowerCase()} tendencies, creating a unique cognitive profile.`
    },
    valueSystem: {
      strengths: ["Integrity", "Growth", "Connection", "Understanding"],
      challenges: ["Balancing competing priorities", "Recognizing when values conflict"],
      compatibleTypes: ["Growth-oriented individuals", "People with complementary strengths"]
    },
    motivators: ["Personal growth", "Meaningful achievement", "Understanding complex systems", "Authentic connection"],
    inhibitors: ["Self-doubt", "Perfectionism", "Fear of making wrong choices"],
    weaknesses: ["May struggle with ambiguity", "Sometimes hesitant to take risks", "Occasional perfectionism"],
    growthAreas: growthAreas,
    relationshipPatterns: {
      strengths: ["Good listening skills", "Thoughtfulness", "Depth of connection"],
      challenges: ["May withhold feelings to maintain harmony", "Could be more assertive about needs"],
      compatibleTypes: ["Open communicators", "Growth-oriented individuals", "Those who appreciate depth"]
    },
    careerSuggestions: ["Strategic advisor", "Research specialist", "Program developer", "Systems analyst", "Consultant", "Educator"],
    learningPathways: ["Structured courses with practical applications", "Collaborative learning environments", "Self-directed deep dives"],
    roadmap: "Focus on leveraging your natural strengths while developing in areas that will complement your core tendencies. Consider engaging in activities that challenge your comfort zone in small, progressive steps.",
    coreTraits: {
      primary: primaryTrait,
      secondary: secondaryTrait,
      strengths: strengths,
      challenges: challenges
    },
    cognitivePatterning: {
      decisionMaking: decisionMakingStyle,
      learningStyle: learningStyle,
      attention: "Your attention is most focused when dealing with content that aligns with your values and interests. Your response pattern suggests you can maintain strong focus when engaged with meaningful material."
    },
    emotionalArchitecture: {
      emotionalAwareness: emotionalAwareness,
      regulationStyle: "You tend to process emotions through a combination of reflection and discussion. This balanced approach helps you manage emotional experiences effectively in most situations.",
      empathicCapacity: "You demonstrate good empathy for others, particularly those whose experiences you can relate to. You're able to perspective-take while maintaining appropriate emotional boundaries."
    },
    interpersonalDynamics: {
      attachmentStyle: "Your attachment style shows a balanced approach to relationships, valuing both connection and independence.",
      communicationPattern: "You communicate thoughtfully and prefer depth over small talk. You listen well and generally express your thoughts clearly.",
      conflictResolution: "Your approach to conflict emphasizes finding common ground while addressing issues directly but tactfully."
    },
    growthPotential: {
      developmentAreas: growthAreas,
      recommendations: recommendations
    },
    responsePatterns: {
      percentages: percentages,
      primaryChoice,
      secondaryChoice,
      responseSignature
    },
    // Store the raw responses for future reference
    rawResponses: responses
  };
};

// Function to determine secondary trait based on response pattern
const determineSecondaryTrait = (secondaryChoice: string): string => {
  switch(secondaryChoice) {
    case 'a': return "Systematic Thinker";
    case 'b': return "Relationship Focused";
    case 'c': return "Pragmatic Adapter";
    case 'd': return "Creative Explorer";
    default: return "Balanced Thinker";
  }
};

// For backwards compatibility - alias the function
export const analyzeDeepInsightResponses = generateAnalysisFromResponses;
