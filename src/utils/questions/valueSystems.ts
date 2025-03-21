
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Value Systems
export const valueSystemQuestions: AssessmentQuestion[] = [
  {
    id: "16",
    category: QuestionCategory.ValueSystems,
    question: "Which of these do you value most in your relationships with others?",
    options: [
      "Honesty and authenticity",
      "Loyalty and dependability",
      "Growth and mutual development",
      "Understanding and empathy",
      "Respect for independence and boundaries"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "17",
    category: QuestionCategory.ValueSystems,
    question: "What do you consider most important when making significant life decisions?",
    options: [
      "Alignment with my core values and principles",
      "Potential for personal growth and development",
      "Impact on important relationships in my life",
      "Practical considerations and likely outcomes",
      "Following my passion and what brings fulfillment"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "18",
    category: QuestionCategory.ValueSystems,
    question: "How important is it to you that your work contributes to something beyond yourself?",
    options: [
      "Essential – I need to feel I'm contributing to a greater good",
      "Important, but balanced with personal fulfillment and practical needs",
      "Somewhat important, though other factors often take priority",
      "Nice when possible, but not a primary consideration",
      "Less important than excellence and personal achievement"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "19",
    category: QuestionCategory.ValueSystems,
    question: "Which of these qualities do you most admire in others?",
    options: [
      "Integrity and moral courage",
      "Wisdom and insight",
      "Kindness and compassion",
      "Creativity and original thinking",
      "Resilience and determination"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: "20",
    category: QuestionCategory.ValueSystems,
    question: "What constitutes 'success' in your view?",
    options: [
      "Making a positive difference in others' lives",
      "Achieving excellence in my chosen field",
      "Finding personal fulfillment and happiness",
      "Building meaningful relationships and connections",
      "Continuously growing and developing as a person"
    ],
    allowCustomResponse: true,
    weight: 0.9
  }
];
