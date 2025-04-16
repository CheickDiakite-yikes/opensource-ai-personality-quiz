
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Cognitive Patterns - Enhanced with cognitive flexibility, thinking styles, and ambiguity tolerance
export const cognitivePatternQuestions: AssessmentQuestion[] = [
  {
    id: "11",
    category: QuestionCategory.CognitivePatterns,
    question: "When acquiring a complex new skill or subject, which approach yields the best results for you?",
    options: [
      "Building a theoretical foundation before attempting practical application",
      "Diving into hands-on practice and learning through trial and error",
      "Alternating between conceptual understanding and practical application",
      "Observing experts and then modeling their techniques with my own adaptations",
      "Breaking down the subject into smaller components to master sequentially"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "12",
    category: QuestionCategory.CognitivePatterns,
    question: "When faced with an ambiguous problem with no clear solution, how do you typically approach it?",
    options: [
      "I explore multiple potential frameworks before committing to one approach",
      "I break it down into smaller, more defined components to tackle individually",
      "I seek analogies from seemingly unrelated fields that might provide insight",
      "I gather diverse perspectives to see the problem from different angles",
      "I start with what's certain and methodically work toward the uncertain areas"
    ],
    allowCustomResponse: true,
    weight: 1.0
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
