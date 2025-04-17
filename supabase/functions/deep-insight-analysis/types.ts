
export interface DeepInsightResponses {
  [questionId: string]: string;
}

export interface ResponsePercentages {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export interface ResponsePatternAnalysis {
  percentages: ResponsePercentages;
  primaryChoice: string;
  secondaryChoice: string;
  responseSignature: string;
}

export interface AnalysisData {
  id: string;
  createdAt: string;
  overview: string;
  traits: {
    trait: string;
    score: number;
    description: string;
    strengths: string[];
    challenges: string[];
  }[];
  intelligence: {
    type: string;
    score: number;
    description: string;
    domains: {
      name: string;
      score: number;
      description: string;
    }[];
  };
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  cognitiveStyle: {
    primary: string;
    secondary: string;
    description: string;
  };
  valueSystem: string[];
  motivators: string[];
  inhibitors: string[];
  weaknesses: string[];
  growthAreas: string[];
  relationshipPatterns: {
    strengths: string[];
    challenges: string[];
    compatibleTypes: string[];
  };
  careerSuggestions: string[];
  learningPathways: string[];
  roadmap: string;
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
