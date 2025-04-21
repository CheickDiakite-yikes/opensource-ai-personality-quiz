
import { QuestionCategory } from "../types";

// Big Me question types
export interface BigMeQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  options: string[];
  allowCustomResponse?: boolean;
  weight?: number;
}

// Response type for Big Me assessment
export interface BigMeResponse {
  questionId: string;
  selectedOption?: string;
  customResponse?: string;
  category: QuestionCategory;
  timestamp: Date;
}

// Analysis result interfaces
export interface CognitivePatterning {
  decisionMaking: string;
  learningStyle: string;
  attention: string;
  problemSolvingApproach: string;
  informationProcessing: string;
  analyticalTendencies: string;
}

export interface EmotionalArchitecture {
  emotionalAwareness: string;
  regulationStyle: string;
  empathicCapacity: string;
  emotionalComplexity: string;
  stressResponse: string;
  emotionalResilience: string;
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
}

export interface CoreTraits {
  primary: string;
  secondary: string;
  tertiaryTraits: string[];
  strengths: string[];
  challenges: string[];
  adaptivePatterns: string[];
  potentialBlindSpots: string[];
}

export interface CareerInsights {
  naturalStrengths: string[];
  workplaceNeeds: string[];
  leadershipStyle: string;
  idealWorkEnvironment: string;
  careerPathways: string[];
  professionalChallenges: string[];
  potentialRoles: string[];
}

export interface MotivationalProfile {
  primaryDrivers: string[];
  secondaryDrivers: string[];
  inhibitors: string[];
  values: string[];
  aspirations: string;
  fearPatterns: string;
}

export interface GrowthPotential {
  developmentAreas: string[];
  recommendations: string[];
  specificActionItems: string[];
  longTermTrajectory: string;
  potentialPitfalls: string[];
  growthMindsetIndicators: string;
}

// The full analysis result structure
export interface BigMeAnalysisResult {
  id?: string;
  createdAt?: string;
  userId?: string;
  cognitivePatterning: CognitivePatterning;
  emotionalArchitecture: EmotionalArchitecture;
  interpersonalDynamics: InterpersonalDynamics;
  coreTraits: CoreTraits;
  careerInsights: CareerInsights;
  motivationalProfile: MotivationalProfile;
  growthPotential: GrowthPotential;
}
