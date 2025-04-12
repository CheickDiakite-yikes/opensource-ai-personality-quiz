// Assessment Response Types
export enum QuestionCategory {
  PersonalityTraits = "personality",
  EmotionalIntelligence = "emotional",
  CognitivePatterns = "cognitive",
  ValueSystems = "values",
  Motivation = "motivation",
  Resilience = "resilience",
  SocialInteraction = "social",
  DecisionMaking = "decision",
  Creativity = "creativity",
  Leadership = "leadership"
}

export interface AssessmentResponse {
  questionId: string;
  selectedOption?: string;
  customResponse?: string;
  category: QuestionCategory;
  timestamp: Date;
}

// Assessment Question Type
export interface AssessmentQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  options: string[];
  allowCustomResponse?: boolean;
  weight?: number;
}

// Notification Type
export interface MotivationalNotification {
  id: string;
  message: string;
  type: 'achievement' | 'reminder' | 'insight';
  date: Date;
  read: boolean;
  // Additional properties
  userId?: string;
  suggestion?: string;
  createdAt: Date;
  relatedTraits?: string[];
}

// Intelligence Domain
export interface IntelligenceDomain {
  name: string;
  score: number;
  description: string;
}

// Intelligence Type
export interface IntelligenceType {
  type: string;
  score: number;
  description: string;
  domains: IntelligenceDomain[];
}

// Personality Trait
export interface PersonalityTrait {
  trait: string;
  score: number;
  description: string;
  strengths: string[];
  challenges: string[];
  growthSuggestions: string[];
}

// Value System type to handle both string[] and object
export type ValueSystemType = string[] | {
  strengths: string[];
  challenges: string[];
  compatibleTypes: string[];
};

// Cognitive Style type to handle both string and object
export type CognitiveStyleType = string | { 
  primary: string;
  secondary: string;
  description: string;
};

// Relationship Patterns type
export interface RelationshipPatterns {
  strengths: string[];
  challenges: string[];
  compatibleTypes: string[];
}

// Personality Analysis
export interface PersonalityAnalysis {
  id: string;
  createdAt: string;
  overview: string;
  traits: PersonalityTrait[];
  intelligence: IntelligenceType;
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  cognitiveStyle: CognitiveStyleType;
  valueSystem: ValueSystemType;
  motivators: string[];
  inhibitors: string[];
  weaknesses: string[];
  growthAreas: string[];
  relationshipPatterns: RelationshipPatterns | string[];
  careerSuggestions: string[];
  learningPathways: string[];
  roadmap: string;
  userId?: string;
  assessmentId?: string;
}

// Alias type for backwards compatibility
export type AIAnalysis = PersonalityAnalysis;

// Activity Types
export enum ActivityCategory {
  KINDNESS = "KINDNESS",
  MINDFULNESS = "MINDFULNESS",
  LEARNING = "LEARNING",
  HEALTH = "HEALTH",
  SOCIAL = "SOCIAL",
  CREATIVITY = "CREATIVITY",
  COGNITIVE = "COGNITIVE",
  EMOTIONAL = "EMOTIONAL",
  PERSONALITY = "PERSONALITY",
  MOTIVATION = "MOTIVATION",
  VALUES = "VALUES",
  STRENGTHS = "STRENGTHS"
}

// Adding Json type for Supabase compatibility
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Activity {
  id: string;
  title: string;
  description: string;
  points: number;
  category: ActivityCategory;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  steps?: string[] | Json[];  // Updated to accept both string[] and Json[]
  benefits?: string;
  user_id?: string;
}

// Comprehensive Assessment Types
export interface ComprehensiveQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  options: string[];
  allowCustomResponse?: boolean;
  weight?: number;
}

export interface ComprehensiveAssessmentResponse {
  questionId: string;
  selectedOption?: string;
  customResponse?: string;
  category: QuestionCategory;
  timestamp: Date;
}

export interface ComprehensiveAssessment {
  id: string;
  userId: string;
  responses: ComprehensiveAssessmentResponse[];
  completedAt: Date;
}

export interface ComprehensiveAnalysis extends PersonalityAnalysis {
  // Extended with additional fields specific to comprehensive analysis
  inhibitors: string[];
  detailedTraits: {
    primary: PersonalityTrait[];
    secondary: PersonalityTrait[];
  };
  shadowAspects?: {
    trait: string;
    description: string;
    impactAreas: string[];
    integrationSuggestions: string[];
  }[];
}
