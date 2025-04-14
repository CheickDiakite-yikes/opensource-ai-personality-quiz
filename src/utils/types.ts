
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

// Defining CognitiveDomain interface
export interface CognitiveDomain {
  name: string;
  score: number;
  description?: string;
}

export interface Intelligence {
  type: string;
  score: number;
  description: string;
  strengths: string[];
  areas_for_development: string[];
  learning_style: string;
  cognitive_preferences: string[];
  domains?: CognitiveDomain[];
}

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
  trait: string; 
  score: number;
  description: string;
  impact: string[];
  recommendations: string[];
  relatedTraits?: string[];
  strengths: string[]; 
  challenges: string[]; 
  growthSuggestions: string[];
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

// Activity tracking related types
export enum ActivityCategory {
  PersonalGrowth = "PersonalGrowth",
  SelfReflection = "SelfReflection",
  SocialConnection = "SocialConnection",
  EmotionalWellbeing = "EmotionalWellbeing",
  MindfulPractice = "MindfulPractice",
  StressCoping = "StressCoping",
  KINDNESS = "KINDNESS",
  MINDFULNESS = "MINDFULNESS",
  LEARNING = "LEARNING",
  HEALTH = "HEALTH",
  SOCIAL = "SOCIAL",
  CREATIVITY = "CREATIVITY"
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration?: number; // in minutes
  difficulty?: "Easy" | "Moderate" | "Challenging";
  completed: boolean;
  completedAt?: Date;
  recommendedFrequency?: string;
  benefits: string;
  steps?: string[];
  points: number;
  createdAt: Date;
  user_id?: string;
}

// Notification types
export interface MotivationalNotification {
  id: string;
  title: string;
  message: string;
  type: "motivational" | "reminder" | "milestone" | "tip" | "insight";
  createdAt: Date | string;
  read: boolean;
  trait?: string;
  link?: string;
  suggestion?: string;
  relatedTraits?: string[];
  date?: Date | string;
  userId?: string;
}

// JSON type for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
