
export interface DeepInsightOption {
  id: string;
  text: string;
  value: number;
}

export interface DeepInsightQuestion {
  id: string;
  question: string;
  description?: string;
  options: DeepInsightOption[];
  category: string;
}

export type DeepInsightResponses = Record<string, string>;

export interface DeepInsightCategory {
  id: string;
  name: string;
  description: string;
}

export const DeepInsightCategories: DeepInsightCategory[] = [
  {
    id: "personality",
    name: "Personality Core",
    description: "Understand your fundamental personality traits and tendencies"
  },
  {
    id: "emotional",
    name: "Emotional Intelligence",
    description: "Explore how you perceive, understand, and manage emotions"
  },
  {
    id: "cognitive",
    name: "Cognitive Patterns",
    description: "Identify your thought processes and decision-making approaches"
  },
  {
    id: "social",
    name: "Social Dynamics",
    description: "Discover how you interact with others and build relationships"
  },
  {
    id: "motivation",
    name: "Motivation & Drive",
    description: "Understand what energizes and inspires your actions"
  },
  {
    id: "values",
    name: "Value Systems",
    description: "Explore your core beliefs and what you consider important"
  },
  {
    id: "resilience",
    name: "Resilience & Growth",
    description: "Assess how you handle challenges and bounce back from setbacks"
  },
  {
    id: "creativity",
    name: "Creativity & Innovation",
    description: "Examine your creative processes and novel thinking patterns"
  },
  {
    id: "leadership",
    name: "Leadership Style",
    description: "Understand how you guide and influence others"
  },
  {
    id: "mindfulness",
    name: "Self-Awareness",
    description: "Explore your level of personal insight and mindful presence"
  }
];
