
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Resilience - Enhanced with post-traumatic growth, adaptive coping, and recovery dynamics
export const resilienceQuestions: AssessmentQuestion[] = [
  {
    id: "26",
    category: QuestionCategory.Resilience,
    question: "Following a significant setback or failure, which approach most helps you recover and move forward?",
    options: [
      "Analyzing the experience for lessons and growth opportunities",
      "Connecting with supportive people who provide perspective",
      "Focusing on what aspects remain within my control",
      "Reconnecting with my core values and larger purpose",
      "Allowing myself to fully process the emotions before planning next steps"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "27",
    category: QuestionCategory.Resilience,
    question: "When experiencing prolonged stress, which coping mechanism proves most effective for maintaining your wellbeing?",
    options: [
      "Physical activity and attention to bodily needs",
      "Mindfulness practices and present-moment awareness",
      "Creative expression or immersion in meaningful activities",
      "Structured problem-solving and prioritization techniques",
      "Seeking connection and support from trusted others"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "28",
    category: QuestionCategory.Resilience,
    question: "How has your approach to adversity evolved based on challenging life experiences?",
    options: [
      "I've developed greater emotional regulation during difficult situations",
      "I more quickly identify what's within and beyond my control",
      "I'm more willing to seek and accept support from others",
      "I better recognize patterns and apply lessons from past challenges",
      "I've cultivated more self-compassion when facing struggles"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "29",
    category: QuestionCategory.Resilience,
    question: "When a long-term project encounters serious obstacles that threaten its completion, what most helps you persevere?",
    options: [
      "Remembering the meaningful purpose behind the work",
      "Breaking down problems into smaller, more manageable steps",
      "Adapting my approach or pivoting to alternative solutions",
      "Drawing on successful strategies from past challenges",
      "Gathering input and support from trusted collaborators"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "30",
    category: QuestionCategory.Resilience,
    question: "Looking back on your most significant challenges, which perspective most resonates with your experience?",
    options: [
      "They revealed strengths I didn't know I possessed",
      "They taught me what truly matters and clarified my priorities",
      "They connected me more deeply with supportive people in my life",
      "They forced me to develop new capabilities and approaches",
      "They showed me that I can handle more than I thought possible"
    ],
    allowCustomResponse: true,
    weight: 1.0
  }
];
