
export interface CoreTraits {
  primary?: string;
  secondary?: string;
  strengths?: string[];
  challenges?: string[];
  tertiaryTraits?: (string | Record<string, string>)[];
}

export interface CognitivePatterns {
  decisionMaking?: string;
  learningStyle?: string;
  attention?: string;
  problemSolvingApproach?: string;
  informationProcessing?: string;
  analyticalTendencies?: string;
}

export interface EmotionalArchitecture {
  emotionalAwareness?: string;
  regulationStyle?: string;
  empathicCapacity?: string;
}

export interface InterpersonalDynamics {
  attachmentStyle?: string;
  communicationPattern?: string;
  conflictResolution?: string;
  relationshipNeeds?: string;
  groupDynamics?: string;
  socialBoundaries?: string;
}

export interface GrowthPotential {
  developmentAreas?: string[];
  recommendations?: string[];
}

export interface CareerInsights {
  naturalStrengths?: string[];
  workplaceNeeds?: string[];
  leadershipStyle?: string;
  careerPathways?: (string | Record<string, string>)[];
}

export interface MotivationalProfile {
  primaryDrivers?: (string | Record<string, string>)[];
  inhibitors?: (string | Record<string, string>)[];
}

export interface CompleteAnalysis {
  careerInsights?: CareerInsights;
  motivationalProfile?: MotivationalProfile;
  status?: 'processing' | 'completed' | 'error';
}

export interface DeepInsightAnalysis {
  id: string;
  title?: string;
  overview?: string;
  created_at?: string;
  intelligence_score?: number;
  emotional_intelligence_score?: number;
  core_traits?: CoreTraits;
  cognitive_patterning?: CognitivePatterns;
  emotional_architecture?: EmotionalArchitecture;
  interpersonal_dynamics?: InterpersonalDynamics;
  growth_potential?: GrowthPotential;
  response_patterns?: {
    primaryChoice?: string;
    secondaryChoice?: string;
  };
  complete_analysis?: CompleteAnalysis;
  user_id?: string;
  error_occurred?: boolean;
  error_message?: string | null;
}
