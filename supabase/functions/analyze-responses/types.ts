
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

// Career Pathway type for enhanced career suggestions
export interface CareerPathway {
  field?: string;
  title?: string;
  description?: string;
  alignment?: string;
  keyTraits?: string[];
  traits?: string[];
  growth?: string;
  skills?: string[];
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
  careerSuggestions: string[] | CareerPathway[];
  learningPathways: string[];
  roadmap: string;
  userId?: string;
  assessmentId?: string;
}

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

export interface Activity {
  id: string;
  title: string;
  description: string;
  points: number;
  category: ActivityCategory;
  completed: boolean;
  completedAt?: Date;
  steps?: string[];
  benefits?: string;
}

// Notification Type
export interface MotivationalNotification {
  id: string;
  message: string;
  type: 'achievement' | 'reminder' | 'insight';
  date: Date;
  read: boolean;
  userId?: string;
  suggestion?: string;
  createdAt: Date;
  relatedTraits?: string[];
}
