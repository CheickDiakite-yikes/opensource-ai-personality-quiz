
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
  [key: string]: number; // Add index signature to make it compatible with Record<string, number>
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

export const DeepInsightCategories = [
  { id: "personality", name: "Personality Core" },
  { id: "emotional", name: "Emotional Intelligence" },
  { id: "cognitive", name: "Cognitive Patterns" },
  { id: "social", name: "Social Dynamics" },
  { id: "motivation", name: "Motivation & Drive" },
  { id: "values", name: "Value Systems" },
  { id: "resilience", name: "Resilience & Growth" },
  { id: "creativity", name: "Creativity & Innovation" },
  { id: "leadership", name: "Leadership Style" },
  { id: "mindfulness", name: "Self-Awareness" }
];
