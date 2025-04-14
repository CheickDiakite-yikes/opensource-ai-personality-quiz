
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

// Assessment Response type
export interface AssessmentResponse {
  questionId: string;
  selectedOption?: string;
  customResponse?: string;
  category: QuestionCategory;
  timestamp: Date;
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
  // Adding compatibleTypes for type guard compatibility
  compatibleTypes?: string[];
  challenges?: string[];
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

// Alias for backward compatibility
export type CognitiveStyleType = CognitiveStyle | string;

export interface PersonalityAnalysis {
  id: string;
  createdAt?: string;
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
  trait: string; // Adding trait property
  score: number;
  description: string;
  impact: string[];
  recommendations: string[];
  relatedTraits?: string[];
  strengths: string[]; // Adding strengths
  challenges: string[]; // Adding challenges
  growthSuggestions: string[]; // Adding growth suggestions
}

export interface Intelligence {
  type: string;
  score: number;
  description: string;
  strengths: string[];
  areas_for_development: string[];
  learning_style: string;
  cognitive_preferences: string[];
  domains?: string[];
}

// Alias for backward compatibility
export type IntelligenceType = Intelligence;

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

// Activity tracking related types
export enum ActivityCategory {
  PersonalGrowth = "PersonalGrowth",
  SelfReflection = "SelfReflection",
  SocialConnection = "SocialConnection",
  EmotionalWellbeing = "EmotionalWellbeing",
  MindfulPractice = "MindfulPractice",
  StressCoping = "StressCoping"
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration: number; // in minutes
  difficulty: "Easy" | "Moderate" | "Challenging";
  completed?: boolean;
  completedDate?: string;
  recommendedFrequency?: string;
  benefits: string[];
  steps?: string[];
}

// Notification types
export interface MotivationalNotification {
  id: string;
  title: string;
  message: string;
  type: "motivational" | "reminder" | "milestone" | "tip";
  createdAt: string;
  read: boolean;
  trait?: string;
  link?: string;
}
