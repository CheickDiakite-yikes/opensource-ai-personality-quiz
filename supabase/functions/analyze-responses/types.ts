
// Assessment Response Types
export enum QuestionCategory {
  PERSONALITY = "personality",
  COGNITIVE = "cognitive",
  EMOTIONAL = "emotional",
  SOCIAL = "social",
  MOTIVATION = "motivation",
  VALUES = "values",
  LEARNING = "learning",
  STRENGTHS = "strengths"
}

export interface AssessmentResponse {
  questionId: string;
  selectedOption?: string;
  customResponse?: string;
  category: QuestionCategory;
  timestamp: Date;
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
  cognitiveStyle: string;
  valueSystem: string[];
  motivators: string[];
  inhibitors: string[];
  weaknesses: string[];
  growthAreas: string[];
  relationshipPatterns: string[];
  careerSuggestions: string[];
  learningPathways: string[];
  roadmap: string;
}
