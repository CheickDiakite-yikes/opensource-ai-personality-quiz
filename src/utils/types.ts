
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
  allowCustomResponse: boolean;
}

export interface AssessmentResponse {
  questionId: number;
  selectedOption?: string;
  customResponse?: string;
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
}

export interface AnalysisSection {
  title: string;
  content: string;
}

export interface PersonalityAnalysis {
  overview: string;
  traits: PersonalityTrait[];
  intelligence: {
    type: string;
    score: number;
    description: string;
  };
  motivators: string[];
  inhibitors: string[];
  weaknesses: string[];
  growthAreas: string[];
  intelligenceScore: number;
  roadmap: string;
  createdAt: Date;
}

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
