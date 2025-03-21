
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Emotional Intelligence
export const emotionalIntelligenceQuestions: AssessmentQuestion[] = [
  {
    id: "6",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you witness someone else's distress, how do you typically respond?",
    options: [
      "I immediately offer practical help and solutions",
      "I listen empathetically without rushing to fix the situation",
      "I give them space, respecting that they might want privacy",
      "I share similar experiences to show understanding",
      "I try to cheer them up or distract them from their troubles"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "7",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How easily can you identify your own emotions as they arise?",
    options: [
      "Very easily – I'm immediately aware of what I'm feeling and why",
      "Fairly easily, though some complex emotions take time to understand",
      "It depends on the intensity – strong emotions are clear, subtle ones less so",
      "I often need time alone to process and understand my feelings",
      "I sometimes struggle to distinguish between similar emotions"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "8",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you're feeling overwhelmed, what strategies do you typically employ?",
    options: [
      "I break down the situation into manageable components",
      "I seek social support and talk through my feelings",
      "I engage in physical activity or exercise",
      "I practice mindfulness, meditation, or breathing exercises",
      "I temporarily distract myself before returning to the issue"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "9",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How do you typically handle situations where others hold strong opinions that differ from yours?",
    options: [
      "I listen carefully to understand their perspective fully",
      "I engage in respectful debate to express my viewpoint",
      "I find common ground while acknowledging differences",
      "I tend to keep my opinions to myself to avoid conflict",
      "I reassess my own views to see if there's something I've missed"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "10",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone close to you is celebrating a success, what's your most natural reaction?",
    options: [
      "I express genuine enthusiasm and celebrate with them",
      "I ask questions to understand the achievement better",
      "I highlight specific aspects of their accomplishment I find impressive",
      "I share in their happiness while offering new goals to pursue",
      "I express pride in them and their efforts"
    ],
    allowCustomResponse: true,
    weight: 0.7
  }
];
