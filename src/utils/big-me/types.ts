
export interface CognitivePatterning {
  decisionMaking: string;
  learningStyle: string;
  attention: string;
  problemSolvingApproach: string;
  informationProcessing: string;
  analyticalTendencies: string;
  notableExamples?: string[];
}

export interface EmotionalArchitecture {
  emotionalAwareness: string;
  regulationStyle: string;
  empathicCapacity: string;
  emotionalComplexity: string;
  stressResponse: string;
  emotionalResilience: string;
  notableExamples?: string[];
}

export interface InterpersonalDynamics {
  attachmentStyle: string;
  communicationPattern: string;
  conflictResolution: string;
  relationshipNeeds: string;
  socialBoundaries: string;
  groupDynamics: string;
  compatibilityProfile: string;
  compatibleTypes: string[];
  challengingRelationships: string[];
  notableExamples?: string[];
}

export interface CoreTraitItem {
  label: string;
  explanation: string;
}

export interface CoreTraits {
  primary: string;
  secondary: string;
  tertiaryTraits: (string | CoreTraitItem)[];
  strengths: string[];
  challenges: string[];
  adaptivePatterns: string[];
  potentialBlindSpots: string[];
  notableExamples?: string[];
}

export interface CareerInsights {
  naturalStrengths: string[];
  workplaceNeeds: string[];
  leadershipStyle: string;
  idealWorkEnvironment: string;
  careerPathways: string[];
  professionalChallenges: string[];
  potentialRoles: string[];
  notableExamples?: string[];
}

export interface MotivationalProfile {
  primaryDrivers: string[];
  secondaryDrivers: string[];
  inhibitors: string[];
  values: string[];
  aspirations: string;
  fearPatterns: string;
  notableExamples?: string[];
}

export interface GrowthPotential {
  developmentAreas: string[];
  recommendations: string[];
  specificActionItems: string[];
  longTermTrajectory: string;
  potentialPitfalls: string[];
  growthMindsetIndicators: string;
  notableExamples?: string[];
}

export interface PsychologicalProfile {
  values?: {
    coreValues: string[];
    motivationalDrivers: string[];
  };
  strengths?: string[];
  challenges?: string[];
  coreTraits?: {
    dominantTraits: string[];
    tertiaryTraits: CoreTraitItem[];
  };
  socialDynamics?: {
    interpersonalStyle: string[];
    leadershipApproach: string[];
  };
  cognitivePatterns?: {
    thinkingStyle: string[];
  };
}

export interface BigMeAnalysisResult {
  cognitivePatterning: CognitivePatterning;
  emotionalArchitecture: EmotionalArchitecture;
  interpersonalDynamics: InterpersonalDynamics;
  coreTraits: CoreTraits;
  careerInsights: CareerInsights;
  motivationalProfile: MotivationalProfile;
  growthPotential: GrowthPotential;
  psychologicalProfile?: PsychologicalProfile;
}

export interface BigMeResponse {
  questionId: string;
  selectedOption?: string;
  customResponse?: string;
  category?: string;
}

export interface BigMeQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  allowCustomResponse?: boolean;
  weight?: number;
}
