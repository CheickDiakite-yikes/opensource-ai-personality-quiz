
import { AnalysisData } from "../analysis/types";
import { PersonalityTrait } from "@/utils/types";

export const ensureAnalysisStructure = (analysisData: AnalysisData): void => {
  // Make sure responsePatterns exists
  if (!analysisData.responsePatterns) {
    analysisData.responsePatterns = {
      percentages: { a: 20, b: 20, c: 20, d: 20, e: 10, f: 10 },
      primaryChoice: 'a',
      secondaryChoice: 'b',
      responseSignature: 'AB'
    };
  }
  
  // Make sure interpersonalDynamics exists
  if (!analysisData.interpersonalDynamics) {
    analysisData.interpersonalDynamics = {
      attachmentStyle: "Your attachment style shows a balanced approach to relationships.",
      communicationPattern: "You communicate thoughtfully and prefer meaningful conversations.",
      conflictResolution: "You approach conflicts by seeking to understand different perspectives."
    };
  }
  
  // Make sure relationshipPatterns has the correct structure
  if (!analysisData.relationshipPatterns || Array.isArray(analysisData.relationshipPatterns)) {
    analysisData.relationshipPatterns = {
      strengths: Array.isArray(analysisData.relationshipPatterns) 
        ? analysisData.relationshipPatterns 
        : ["Good listening skills", "Thoughtfulness"],
      challenges: [],
      compatibleTypes: []
    };
  }
  
  // Ensure traits are properly structured with all required properties
  if (!analysisData.traits || !Array.isArray(analysisData.traits) || analysisData.traits.length === 0) {
    const defaultTraits: PersonalityTrait[] = [
      {
        trait: "Analytical Thinking",
        score: 7.5,
        description: "Your analytical abilities help you understand complex situations.",
        strengths: ["Problem-solving", "Logical reasoning"],
        challenges: ["May overthink simple situations"],
        growthSuggestions: ["Practice intuitive decision-making"]
      },
      {
        trait: "Emotional Intelligence",
        score: 7.0,
        description: "Your emotional awareness influences how you connect with others.",
        strengths: ["Empathy", "Self-awareness"],
        challenges: ["May be overly sensitive"],
        growthSuggestions: ["Develop emotional boundaries"]
      },
      {
        trait: "Adaptability",
        score: 6.5,
        description: "Your flexibility in handling change is a key part of your approach.",
        strengths: ["Quick learning", "Flexibility"],
        challenges: ["May struggle with routine"],
        growthSuggestions: ["Build stable habits"]
      }
    ];
    analysisData.traits = defaultTraits;
  } else {
    // Ensure each trait has all required properties
    analysisData.traits = analysisData.traits.map(trait => ({
      ...trait,
      strengths: trait.strengths || ["Adaptability", "Quick learning"],
      challenges: trait.challenges || ["May need more practice"],
      growthSuggestions: trait.growthSuggestions || ["Continue developing skills"]
    }));
  }
  
  // Ensure cognitivePatterning exists
  if (!analysisData.cognitivePatterning) {
    analysisData.cognitivePatterning = {
      decisionMaking: "You tend to weigh options carefully before making decisions.",
      learningStyle: "You learn best through a combination of concepts and practical applications.",
      attention: "Your attention is most focused when dealing with meaningful content."
    };
  }
};
