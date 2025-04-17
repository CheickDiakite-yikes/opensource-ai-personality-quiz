
import { PersonalityAnalysis } from "@/utils/types";
import { DeepInsightResponses, ResponsePatternAnalysis as DeepInsightResponsePatternAnalysis } from "../../types";

// Define AnalysisData type to extend PersonalityAnalysis
export interface AnalysisData extends PersonalityAnalysis {
  coreTraits?: {
    primary: string;
    secondary: string;
    strengths: string[];
    challenges: string[];
  };
  cognitivePatterning?: {
    decisionMaking: string;
    learningStyle: string;
    attention: string;
  };
  emotionalArchitecture?: {
    emotionalAwareness: string;
    regulationStyle: string;
    empathicCapacity: string;
  };
  interpersonalDynamics?: {
    attachmentStyle: string;
    communicationPattern: string;
    conflictResolution: string;
  };
  growthPotential?: {
    developmentAreas: string[];
    recommendations: string[];
  };
  responsePatterns?: DeepInsightResponsePatternAnalysis;
}

// Export the ResponsePatternAnalysis type to match with the type in DeepInsight/types.ts
export type ResponsePatternAnalysis = DeepInsightResponsePatternAnalysis;

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
