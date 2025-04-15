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
  CREATIVITY = "CREATIVITY",
  COGNITIVE = "COGNITIVE",
  EMOTIONAL = "EMOTIONAL",
  PERSONALITY = "PERSONALITY",
  MOTIVATION = "MOTIVATION",
  VALUES = "VALUES",
  STRENGTHS = "STRENGTHS"
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

// PersonalityTrait with all required properties
export interface PersonalityTrait {
  name: string;           // Required property
  trait: string;          // Also required to maintain compatibility
  score: number;
  description: string;
  impact: string[];       // Required property
  recommendations: string[]; // Required property
  relatedTraits?: string[];
  strengths: string[];    
  challenges: string[];   
  growthSuggestions: string[];
}

// Intelligence with all required properties
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

// Defining CognitiveDomain interface
export interface CognitiveDomain {
  name: string;
  score: number;
  description?: string;
}

// ValueSystem with required properties
export interface ValueSystem {
  strengths: string[];
  weaknesses: string[];
  description: string;
  compatibleTypes?: string[];
  challenges?: string[];
}

export type ValueSystemType = ValueSystem | string[];

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

// Adding CognitiveStyleType to allow for string fallback
export type CognitiveStyleType = CognitiveStyle | string;

export interface PersonalityAnalysis {
  id: string;
  userId?: string;       // Optional property for backward compatibility
  assessmentId?: string; // Optional property for backward compatibility
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

export interface ComprehensiveAnalysis {
  id: string;
  created_at?: string;
  assessment_id: string;
  user_id?: string;
  overview: string;
  traits: any;
  intelligence: any;
  intelligence_score?: number; // Database field name
  intelligenceScore: number;   // Processed field for components 
  emotional_intelligence_score?: number; // Database field name
  emotionalIntelligenceScore: number;    // Processed field for components
  value_system?: any;          // Database field name
  valueSystem?: any;           // Processed field for components
  motivators: string[];
  inhibitors: string[];
  growthAreas: string[];       // Processed field for components
  growth_areas?: any;          // Database field name
  weaknesses: string[];
  relationshipPatterns: any;   // Processed field for components
  relationship_patterns?: any; // Database field name
  careerSuggestions: string[]; // Processed field for components
  career_suggestions?: any;    // Database field name
  roadmap: string;
  learningPathways: string[];  // Processed field for components
  learning_pathways?: any;     // Database field name
  cognitive_style?: any;       // Database field name
  cognitiveStyle?: any;        // Processed field for components
  result?: any;                // Raw result field from database
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
  createdAt: Date;
  recommendedFrequency?: string;
  benefits: string | string[];
  steps?: string[];
  points: number;
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
