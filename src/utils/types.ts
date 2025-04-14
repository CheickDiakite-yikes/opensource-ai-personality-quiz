export enum QuestionCategory {
  PersonalityTraits = "PersonalityTraits",
  EmotionalIntelligence = "EmotionalIntelligence",
  CognitivePatterns = "CognitivePatterns",
  ValueSystems = "ValueSystems",
  Motivation = "Motivation",
  Resilience = "Resilience",
  SocialInteraction = "SocialInteraction",
  DecisionMaking = "DecisionMaking",
  Creativity = "Creativity",
  Leadership = "Leadership"
}

export interface AssessmentQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  options: string[];
  allowCustomResponse: boolean;
  weight: number;
}

export type ValueSystemType = ValueSystem | string[];

export interface ValueSystem {
  strengths: string[];
  weaknesses: string[];
  description: string;
}

export interface RelationshipPatterns {
  strengths: string[];
  challenges: string[];
  compatibleTypes: string[];
}

export interface CognitiveStyle {
  primary: string;
  secondary: string;
  description: string;
}

export interface PersonalityAnalysis {
  overview: string;
  traits: PersonalityTrait[];
  intelligence: Intelligence;
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  cognitiveStyle: CognitiveStyle;
  valueSystem: ValueSystem;
  motivators: string[];
  inhibitors: string[];
  weaknesses: string[];
  growthAreas: string[];
  relationshipPatterns: RelationshipPatterns;
  careerSuggestions: string[];
  learningPathways: string[];
  roadmap: string;
  detailedAnalysis?: {
    personalityProfile: string;
    cognitiveProcesses: string;
    emotionalPatterns: string;
    interpersonalStyle: string;
    motivationalFactors: string;
    developmentalPath: string;
  };
}

export interface PersonalityTrait {
  name: string;
  score: number;
  description: string;
  impact: string[];
  recommendations: string[];
  relatedTraits?: string[];
}

export interface Intelligence {
  type: string;
  score: number;
  description: string;
  strengths: string[];
  areas_for_development: string[];
  learning_style: string;
  cognitive_preferences: string[];
}

export interface ComprehensiveAnalysis {
  id: string;
  created_at?: string;
  assessment_id: string;
  overview: string;
  traits: any;
  intelligence: any;
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  motivators: string[];
  inhibitors: string[];
  growthAreas: string[];
  weaknesses: string[];
  relationshipPatterns: any;
  careerSuggestions: string[];
  roadmap: string;
  learningPathways: string[];
}
