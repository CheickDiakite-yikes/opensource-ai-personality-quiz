
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Emotional Intelligence - Enhanced with Mayer-Salovey-Caruso model and regulatory dimensions
export const emotionalIntelligenceQuestions: AssessmentQuestion[] = [
  {
    id: "6",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone close to you is experiencing intense distress, how do you most naturally respond?",
    options: [
      "I listen fully without interruption, validating their feelings before offering help",
      "I share relevant experiences to show understanding of their situation",
      "I focus on practical solutions to help resolve what's causing their distress",
      "I give them space, recognizing some people process emotions privately",
      "I offer physical comfort and reassurance through my presence"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "7",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When you experience a complex emotional reaction (like simultaneous anxiety, excitement, and uncertainty), how do you typically process it?",
    options: [
      "I journal or internally reflect until I understand each component feeling",
      "I talk through my emotions with someone who helps me gain clarity",
      "I identify the physical sensations associated with each emotion",
      "I analyze the situation triggering these emotions rather than the feelings themselves",
      "I accept the emotional complexity without needing to fully dissect it"
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
