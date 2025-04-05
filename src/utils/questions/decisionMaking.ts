
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Decision Making - Enhanced with dual process theory, cognitive biases, and decision science
export const decisionMakingQuestions: AssessmentQuestion[] = [
  {
    id: "36",
    category: QuestionCategory.DecisionMaking,
    question: "When making decisions, how much do you rely on intuition versus analysis?",
    options: [
      "Heavily analytical with little role for intuition",
      "Primarily analytical but intuition serves as a check",
      "Equal balance between analytical thinking and intuitive sensing",
      "Primarily intuitive but validated with analytical thinking",
      "Heavily intuitive with analysis as a secondary consideration"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "37",
    category: QuestionCategory.DecisionMaking,
    question: "How comfortable are you making decisions with incomplete information?",
    options: [
      "Very comfortable – I can decide and adjust as needed",
      "Moderately comfortable if the situation requires quick action",
      "It depends on the stakes and consequences involved",
      "Somewhat uncomfortable – I prefer to gather more data first",
      "Very uncomfortable – I need thorough information before deciding"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "38",
    category: QuestionCategory.DecisionMaking,
    question: "After making an important decision, how often do you second-guess yourself?",
    options: [
      "Rarely – once I decide, I typically move forward confidently",
      "Occasionally, especially if I receive new information",
      "Sometimes, particularly for decisions with significant impact",
      "Often – I frequently wonder if I made the right choice",
      "It depends on the feedback and results I observe"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: "39",
    category: QuestionCategory.DecisionMaking,
    question: "How do you typically approach decisions that affect others?",
    options: [
      "I consult those affected and consider their input carefully",
      "I try to anticipate needs and concerns of others independently",
      "I balance my judgment with consideration for others' perspectives",
      "I make the decision I believe is right and explain my reasoning",
      "I focus on objective criteria rather than subjective preferences"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "40",
    category: QuestionCategory.DecisionMaking,
    question: "What tends to be your biggest challenge in decision-making?",
    options: [
      "Overthinking and analysis paralysis",
      "Balancing logical and emotional considerations",
      "Managing time pressure or urgency",
      "Considering too many options or possibilities",
      "Confidence in my judgment without external validation"
    ],
    allowCustomResponse: true,
    weight: 0.8
  }
];
