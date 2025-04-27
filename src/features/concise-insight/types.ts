

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
  uniquenessMarkers: string[]; // Now required field for displaying distinctive traits
  coreProfiling: {
    primaryArchetype: string;
    secondaryArchetype: string;
    description: string;
    compatibilityInsights?: string[];
  };
  traits: {
    trait: string;
    score: number;
    description: string;
    strengths: string[];
    challenges: string[];
    developmentStrategies?: string[];
  }[];
  cognitiveProfile: {
    style: string;
    strengths: string[];
    blindSpots: string[];
    description?: string;
    learningStyle?: string;
    decisionMakingProcess?: string;
  };
  emotionalInsights: {
    // Now can be either a score with description string or just a number
    awareness: string | number;
    regulation: string;
    // Now can be either a score with description string or just a number
    empathy: string | number;
    description: string;
    stressResponse?: string;
    emotionalTriggersAndCoping?: {
      triggers: string[];
      copingStrategies: string[];
    };
  };
  interpersonalDynamics: {
    communicationStyle: string;
    relationshipPattern: string;
    conflictApproach: string;
    socialNeeds?: string;
    leadershipStyle?: string;
    teamRole?: string;
  };
  valueSystem?: {
    coreValues: string[];
    motivationSources: string[];
    meaningMakers?: string[];
    culturalConsiderations?: string;
  };
  growthPotential: {
    areasOfDevelopment: string[];
    personalizedRecommendations: string[] | {
      area: string;
      why: string;
      action: string;
      resources: string;
    }[];
    keyStrengthsToLeverage: string[];
    developmentTimeline?: {
      shortTerm: string;
      mediumTerm: string;
      longTerm: string;
    };
  };
  careerInsights?: string[] | {
    environmentFit?: string;
    challengeAreas?: string;
    roleAlignments: string[];
    workStyles?: {
      collaboration: string;
      autonomy: string;
      structure: string;
    };
  };
}

