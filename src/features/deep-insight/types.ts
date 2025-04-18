
export interface DeepInsightQuestion {
  id: string;
  category: string;
  question: string;
  description?: string;
  options: {
    id: string;
    text: string;
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

export interface CoreTraits {
  primary: string;
  secondary: string;
  strengths: string[];
  challenges: string[];
}

export interface GrowthPotential {
  developmentAreas: string[];
  recommendations: string[];
}

export interface CognitivePatterning {
  decisionMaking: string;
  learningStyle: string;
  attention: string;
}

export interface EmotionalArchitecture {
  emotionalAwareness: string;
  regulationStyle: string;
  empathicCapacity: string;
}

export interface InterpersonalDynamics {
  attachmentStyle: string;
  communicationPattern: string;
  conflictResolution: string;
}

// Add the missing DeepInsightCategories export
export const DeepInsightCategories = [
  { id: 'personality', name: 'Personality Traits' },
  { id: 'emotional', name: 'Emotional Intelligence' },
  { id: 'cognitive', name: 'Cognitive Patterns' },
  { id: 'social', name: 'Social Interaction' },
  { id: 'motivation', name: 'Motivation' },
  { id: 'values', name: 'Value Systems' },
  { id: 'resilience', name: 'Resilience' },
  { id: 'creativity', name: 'Creativity' },
  { id: 'leadership', name: 'Leadership' },
  { id: 'mindfulness', name: 'Mindfulness' }
];
