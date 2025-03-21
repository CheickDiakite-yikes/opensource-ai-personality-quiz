
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Cognitive Patterns
export const cognitivePatternQuestions: AssessmentQuestion[] = [
  {
    id: "11",
    category: QuestionCategory.CognitivePatterns,
    question: "When learning something new, which approach do you find most effective?",
    options: [
      "Understanding the underlying principles and concepts first",
      "Diving in and learning through practical experience",
      "Following step-by-step instructions or tutorials",
      "Discussing and exploring ideas with others",
      "Connecting it to things I already know and understand"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "12",
    category: QuestionCategory.CognitivePatterns,
    question: "How do you typically approach complex problems?",
    options: [
      "I break them down into smaller, manageable components",
      "I look for patterns and connections to solutions I already know",
      "I try to find creative approaches that others might miss",
      "I research how others have solved similar problems",
      "I identify the core issue before considering solutions"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "13",
    category: QuestionCategory.CognitivePatterns,
    question: "How comfortable are you with ambiguity and uncertainty?",
    options: [
      "Very comfortable – I find it interesting and full of possibility",
      "Moderately comfortable, though I prefer clarity when possible",
      "It depends on the context – sometimes it's energizing, sometimes stressful",
      "Generally uncomfortable – I seek to resolve ambiguity quickly",
      "I'm comfortable with it intellectually but find it emotionally challenging"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "14",
    category: QuestionCategory.CognitivePatterns,
    question: "When forming opinions on complex issues, what influences you most?",
    options: [
      "Factual evidence and logical reasoning",
      "Expertise and authoritative perspectives",
      "Personal values and principles",
      "Impact on people and relationships",
      "Intuitive sense of what feels right or true"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "15",
    category: QuestionCategory.CognitivePatterns,
    question: "How often do you question your own assumptions and beliefs?",
    options: [
      "Constantly – I regularly reassess even my most fundamental beliefs",
      "Often, especially when presented with challenging new information",
      "Sometimes, particularly when my beliefs lead to unexpected outcomes",
      "Occasionally, but I find value in maintaining consistent perspectives",
      "Rarely for core values, more often for practical opinions"
    ],
    allowCustomResponse: true,
    weight: 0.8
  }
];
