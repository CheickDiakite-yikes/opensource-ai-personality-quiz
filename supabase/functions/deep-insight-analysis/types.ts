
export interface DeepInsightResponses {
  [questionId: string]: string;
}

interface AnalysisDomainScores {
  cognitive: number;
  emotional: number;
  adaptability: number;
  resilience: number;
}

export interface TraitScore {
  trait: string;
  score: number;
  description: string;
}

export interface AnalysisSummary {
  careerSummary: {
    dominantStrengths: string[];
    recommendedPaths: string[];
    workStyle: string;
  };
  motivationSummary: {
    primaryMotivators: string[];
    keyInhibitors: string[];
    coreValues: string[];
  };
  traitScores: TraitScore[];
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  adaptabilityScore: number;
  resilienceScore: number;
}

