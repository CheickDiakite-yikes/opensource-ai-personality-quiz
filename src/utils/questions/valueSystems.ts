
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Value Systems - Enhanced with moral foundations theory and value-based trade-offs
export const valueSystemQuestions: AssessmentQuestion[] = [
  {
    id: "16",
    category: QuestionCategory.ValueSystems,
    question: "If you had to prioritize one of these values above all others in your closest relationships, which would it be?",
    options: [
      "Complete honesty, even when uncomfortable truths are involved",
      "Loyalty and commitment, especially during challenging times",
      "Mutual growth and supporting each other's development",
      "Deep understanding and empathy for each other's experiences",
      "Respect for autonomy and personal boundaries"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "17",
    category: QuestionCategory.ValueSystems,
    question: "When making a major life decision that involves competing values, which consideration typically guides you most strongly?",
    options: [
      "Whether the decision aligns with my core ethical principles",
      "The potential impact on the wellbeing of those closest to me",
      "Which choice offers the greatest opportunity for personal growth",
      "The option that best balances multiple important priorities",
      "What feels most authentic to my sense of purpose and identity"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "18",
    category: QuestionCategory.ValueSystems,
    question: "In your view, what is the most fundamental responsibility we have toward society and others?",
    options: [
      "To minimize harm and prevent suffering whenever possible",
      "To uphold justice and fairness in our actions and systems",
      "To remain loyal to our communities and shared traditions",
      "To respect legitimate authority and social structures",
      "To preserve what is pure and sacred against degradation"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "19",
    category: QuestionCategory.ValueSystems,
    question: "Which quality do you most deeply admire and aspire to embody in your own life?",
    options: [
      "Moral courage - standing for what's right despite personal cost",
      "Wisdom - deep understanding applied with good judgment",
      "Compassion - genuine concern for others' wellbeing",
      "Authenticity - true alignment between values and actions",
      "Excellence - mastery and continuous improvement"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "20",
    category: QuestionCategory.ValueSystems,
    question: "If you could ensure your life embodied one type of meaningful impact, which would you choose?",
    options: [
      "Positively transforming individual lives through direct support",
      "Advancing knowledge or innovation that benefits humanity",
      "Creating beauty or meaning that inspires and moves others",
      "Building communities and connections between people",
      "Upholding important principles and being an example to others"
    ],
    allowCustomResponse: true,
    weight: 1.0
  }
];
