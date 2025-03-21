
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Resilience
export const resilienceQuestions: AssessmentQuestion[] = [
  {
    id: "26",
    category: QuestionCategory.Resilience,
    question: "How do you typically respond to significant setbacks or failures?",
    options: [
      "I analyze what went wrong and create a plan to improve",
      "I seek support from others while processing my feelings",
      "I take time to recover emotionally before moving forward",
      "I look for the lessons or growth opportunities in the experience",
      "I quickly pivot to alternative approaches or goals"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "27",
    category: QuestionCategory.Resilience,
    question: "What helps you cope with stress most effectively?",
    options: [
      "Physical activity or exercise",
      "Speaking with supportive friends or family",
      "Mindfulness practices like meditation",
      "Creative expression or hobbies",
      "Planning and organizing to regain a sense of control"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "28",
    category: QuestionCategory.Resilience,
    question: "When faced with significant life changes, how do you typically adapt?",
    options: [
      "I embrace change as an opportunity for growth",
      "I research and prepare as much as possible",
      "I take it one day at a time with a flexible approach",
      "I rely on my support network during the transition",
      "I maintain some routines for stability while adapting to changes"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "29",
    category: QuestionCategory.Resilience,
    question: "When a long-term project becomes difficult, what most helps you persevere?",
    options: [
      "Reconnecting with the purpose or meaning behind the work",
      "Breaking it down into smaller milestones",
      "Taking breaks to recharge and gain perspective",
      "Getting input or support from others",
      "Reminding myself of past challenges I've overcome"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "30",
    category: QuestionCategory.Resilience,
    question: "How have your past difficulties shaped your approach to new challenges?",
    options: [
      "They've made me more confident in my ability to overcome obstacles",
      "They've taught me to be more careful and thorough in my planning",
      "They've helped me develop better coping strategies",
      "They've shown me the importance of asking for help when needed",
      "They've given me perspective on what matters most"
    ],
    allowCustomResponse: true,
    weight: 0.9
  }
];
