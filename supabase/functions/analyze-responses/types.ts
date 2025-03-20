
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

// Personality Analysis
export interface PersonalityAnalysis {
  id: string;
  createdAt: string;
  overview: string;
  traits: PersonalityTrait[];
  intelligence: IntelligenceType;
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  cognitiveStyle: string | { 
    primary: string;
    secondary: string;
    description: string;
  };
  valueSystem: string[] | {
    strengths: string[];
    challenges: string[];
    compatibleTypes: string[];
  };
  motivators: string[];
  inhibitors: string[];
  weaknesses: string[];
  growthAreas: string[];
  relationshipPatterns: string[];
  careerSuggestions: string[];
  learningPathways: string[];
  roadmap: string;
}

// Activity Types
export enum ActivityCategory {
  Kindness = "KINDNESS",
  Mindfulness = "MINDFULNESS",
  Learning = "LEARNING",
  Health = "HEALTH",
  Social = "SOCIAL",
  Creativity = "CREATIVITY",
  COGNITIVE = "COGNITIVE",
  EMOTIONAL = "EMOTIONAL",
  SOCIAL = "SOCIAL",
  PERSONALITY = "PERSONALITY",
  MOTIVATION = "MOTIVATION",
  VALUES = "VALUES",
  LEARNING = "LEARNING",
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
