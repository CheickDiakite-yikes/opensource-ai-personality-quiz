
// Define the types for the Concise Insight feature
export type ConciseInsightCategory = 
  | "core_traits" 
  | "emotional" 
  | "cognitive" 
  | "social" 
  | "values";

export interface ConciseInsightQuestion {
  id: string;
  question: string;
  options: string[];
  category: ConciseInsightCategory;
  weight?: number;
}

export type ConciseInsightResponses = Record<string, string>;

export interface ConciseAnalysisResult {
  id: string;
  createdAt: string;
  userId: string;
  overview: string;
  coreProfiling: {
    primaryArchetype: string;
    secondaryArchetype: string;
    description: string;
  };
  traits: {
    trait: string;
    score: number;
    description: string;
    strengths: string[];
    challenges: string[];
  }[];
  cognitiveProfile: {
    style: string;
    strengths: string[];
    blindSpots: string[];
    description: string;
  };
  emotionalInsights: {
    awareness: string;
    regulation: string;
    empathy: number;
    description: string;
  };
  interpersonalDynamics: {
    communicationStyle: string;
    relationshipPattern: string;
    conflictApproach: string;
  };
  growthPotential: {
    areasOfDevelopment: string[];
    personalizedRecommendations: string[];
    keyStrengthsToLeverage: string[];
  };
  careerInsights: string[];
}
