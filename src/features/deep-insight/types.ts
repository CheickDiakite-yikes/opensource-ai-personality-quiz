export interface DeepInsightQuestion {
  id: string;
  question: string;
  description?: string;
  category: string;
  options: {
    id: string;
    text: string;
    value: number;
  }[];
}

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

export interface StrengthsChallengesResult {
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
  recommendations: string[];
}
