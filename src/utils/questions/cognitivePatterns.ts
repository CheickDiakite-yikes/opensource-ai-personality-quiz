import { AssessmentQuestion, QuestionCategory } from "../types";

export const cognitivePatternQuestions: AssessmentQuestion[] = [
  {
    id: "11",
    category: QuestionCategory.CognitivePatterns,
    question: "When encountering a complex problem with no clear solution, what approach yields the best results for you?",
    options: [
      "Breaking it down into smaller, manageable components",
      "Exploring multiple perspectives and potential frameworks",
      "Looking for patterns or similarities to solved problems",
      "Collaborating with others to gain diverse insights",
      "Taking time to observe and understand the full context"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "12",
    category: QuestionCategory.CognitivePatterns,
    question: "How do you typically process and integrate new information that challenges your existing beliefs?",
    options: [
      "I systematically evaluate evidence for both perspectives",
      "I look for ways to synthesize both viewpoints",
      "I seek additional sources and expert opinions",
      "I reflect on my potential biases and assumptions",
      "I test both old and new ideas against real experiences"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "13",
    category: QuestionCategory.CognitivePatterns,
    question: "How do you respond when presented with information that contradicts your existing beliefs?",
    options: [
      "I evaluate the new information's credibility and evidence regardless of my current beliefs",
      "I experience initial resistance but consciously examine both perspectives",
      "I integrate the new information with my existing knowledge where possible",
      "I seek additional sources and perspectives before modifying my views",
      "I welcome the contradiction as an opportunity to refine my understanding"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "14",
    category: QuestionCategory.CognitivePatterns,
    question: "In situations with high uncertainty but requiring decisions, which cognitive approach do you rely on most?",
    options: [
      "I identify the minimal critical information needed for a reasonable decision",
      "I trust my intuition based on pattern recognition from past experiences",
      "I create mental simulations of potential outcomes for different choices",
      "I establish clear principles to guide decisions when specific data is lacking",
      "I make provisional decisions that can be adjusted as more information emerges"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "15",
    category: QuestionCategory.CognitivePatterns,
    question: "How often and in what circumstances do you find yourself revising your fundamental assumptions about how something works?",
    options: [
      "Frequently, whenever I encounter evidence that challenges my understanding",
      "Periodically, during dedicated reflection on my knowledge frameworks",
      "When a trusted source presents a compelling alternative perspective",
      "When my current understanding fails to produce expected outcomes",
      "Rarely for core principles, more often for their application in specific contexts"
    ],
    allowCustomResponse: true,
    weight: 0.8
  }
];
