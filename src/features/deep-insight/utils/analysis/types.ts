import { PersonalityAnalysis } from "@/utils/types";
import { DeepInsightResponses } from "../../types";
import { Json } from "@/integrations/supabase/types";
// Re-export the PersonalityTrait type for use in Deep Insight components
import { PersonalityTrait } from "@/utils/types";
export type { PersonalityTrait };

// Define AnalysisData type to extend PersonalityAnalysis
export interface AnalysisData extends PersonalityAnalysis {
  coreTraits: {
    primary: string;
    secondary: string;
    strengths: string[];
    challenges: string[];
  };
  cognitivePatterning: {
    decisionMaking: string;
    learningStyle: string;
    attention: string;
  };
  emotionalArchitecture: {
    emotionalAwareness: string;
    regulationStyle: string;
    empathicCapacity: string;
  };
  interpersonalDynamics: {
    attachmentStyle: string;
    communicationPattern: string;
    conflictResolution: string;
  };
  growthPotential: {
    developmentAreas: string[];
    recommendations: string[];
  };
  responsePatterns: ResponsePatternAnalysis;
}

// Helper function to convert AnalysisData to Json-compatible format
export const toJsonObject = (analysis: AnalysisData): Record<string, Json> => {
  return JSON.parse(JSON.stringify(analysis));
};

// Pattern analysis response interface
export interface ResponsePatternAnalysis {
  percentages: Record<string, number>;
  primaryChoice: string;
  secondaryChoice: string;
  responseSignature: string;
}

// Personality trait determination response
export interface PersonalityTraitsDetermination {
  primaryTrait: string;
  analyticalScore: number;
  emotionalScore: number;
  adaptabilityScore: number;
  decisionMakingStyle: string;
  learningStyle: string;
  emotionalAwareness: string;
}

// Strengths and challenges response
export interface StrengthsChallengesResult {
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
  recommendations: string[];
}
