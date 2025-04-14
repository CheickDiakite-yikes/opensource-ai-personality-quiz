import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Emotional Intelligence - Enhanced with Mayer-Salovey-Caruso model and regulatory dimensions
export const emotionalIntelligenceQuestions: AssessmentQuestion[] = [
  {
    id: "6",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone expresses strong emotions that you find challenging, how do you typically respond?",
    options: [
      "I focus on understanding their perspective fully before responding",
      "I acknowledge their feelings while maintaining emotional boundaries",
      "I share similar experiences to build connection and understanding",
      "I look for practical ways to help improve their situation",
      "I create space for them to process their emotions safely"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "7",
    category: QuestionCategory.EmotionalIntelligence,
    question: "How do you handle situations where your emotional reaction differs significantly from others?",
    options: [
      "I reflect on why our responses might differ based on experiences",
      "I try to understand their emotional perspective while honoring mine",
      "I look for common ground despite our different reactions",
      "I express my view while acknowledging the validity of theirs",
      "I use the difference to learn about diverse emotional experiences"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "8",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When feeling overwhelmed by strong negative emotions, which regulation strategy do you find most effective?",
    options: [
      "Cognitive reframing - changing how I think about the situation",
      "Mindfulness practices to observe emotions without judgment",
      "Expressive techniques like physical activity or creative outlets",
      "Strategic distraction until I'm in a better state to process feelings",
      "Seeking support and discussing my feelings with others"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "9",
    category: QuestionCategory.EmotionalIntelligence,
    question: "In a heated disagreement on a topic you care deeply about, how do you typically handle conflicting viewpoints?",
    options: [
      "I listen carefully to understand the underlying values driving their perspective",
      "I express my position clearly while acknowledging valid points they make",
      "I focus on finding areas of agreement before addressing differences",
      "I regulate my emotional response first, then engage intellectually",
      "I ask questions to better understand their reasoning and experiences"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "10",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When witnessing someone's professional triumph, which response most closely matches your genuine internal experience?",
    options: [
      "Pure joy and enthusiasm for their achievement",
      "Happiness for them mixed with some reflection on your own goals",
      "Appreciation of their success while recognizing the work behind it",
      "Curiosity about their process and what you might learn from them",
      "Motivated inspiration to pursue your own aspirations"
    ],
    allowCustomResponse: true,
    weight: 0.8
  }
];
