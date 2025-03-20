
// User-related types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

// Assessment-related types
export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  category: QuestionCategory;
  allowCustomResponse: boolean;
  weight: number; // Question importance weight for analysis
}

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

export interface AssessmentResponse {
  questionId: number;
  selectedOption?: string;
  customResponse?: string;
  category?: QuestionCategory;
  timestamp?: Date;
}

export interface Assessment {
  userId: string;
  responses: AssessmentResponse[];
  completedAt: Date;
}

// Analysis-related types
export interface PersonalityTrait {
  trait: string;
  score: number;
  description: string;
  strengths: string[];
  challenges: string[];
  growthSuggestions: string[];
}

export interface AnalysisSection {
  title: string;
  content: string;
  subSections?: AnalysisSection[];
}

export interface PersonalityAnalysis {
  overview: string;
  traits: PersonalityTrait[];
  intelligence: {
    type: string;
    score: number;
    description: string;
    domains: Array<{
      name: string;
      score: number;
      description: string;
    }>;
  };
  cognitiveStyle: {
    primary: string;
    secondary: string;
    description: string;
  };
  valueSystem: string[];
  motivators: string[];
  inhibitors: string[];
  weaknesses: string[];
  growthAreas: string[];
  relationshipPatterns: {
    strengths: string[];
    challenges: string[];
    compatibleTypes: string[];
  };
  careerSuggestions: string[];
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  roadmap: string;
  learningPathways: string[];
  createdAt: Date;
}

// Export AIAnalysis as an alias for PersonalityAnalysis to maintain compatibility
export type AIAnalysis = PersonalityAnalysis;

// Activity-related types
export interface Activity {
  id: string;
  title: string;
  description: string;
  points: number;
  category: ActivityCategory;
  completed: boolean;
  completedAt?: Date;
}

export enum ActivityCategory {
  Kindness = "Kindness",
  Mindfulness = "Mindfulness",
  Learning = "Learning",
  Health = "Health",
  Social = "Social",
  Creativity = "Creativity"
}
