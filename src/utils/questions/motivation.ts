
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Motivation
export const motivationQuestions: AssessmentQuestion[] = [
  {
    id: "21",
    category: QuestionCategory.Motivation,
    question: "What most often drives you to take on new challenges?",
    options: [
      "Curiosity and the desire to learn something new",
      "The possibility of achievement and recognition",
      "Personal development and growth",
      "Making a positive impact or contribution",
      "The excitement of pushing my boundaries"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "22",
    category: QuestionCategory.Motivation,
    question: "When you've achieved a goal, what typically motivates you next?",
    options: [
      "Setting a more ambitious related goal",
      "Finding a completely different challenge",
      "Taking time to enjoy the achievement before moving on",
      "Helping others achieve similar goals",
      "Reflecting on what I learned from the process"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "23",
    category: QuestionCategory.Motivation,
    question: "What typically helps you persist through difficult or tedious tasks?",
    options: [
      "Focusing on the purpose or meaning behind the task",
      "Breaking it down into smaller, manageable parts",
      "Rewarding myself at key milestones",
      "Thinking about how good it will feel to complete it",
      "Making the process more enjoyable or creative"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: "24",
    category: QuestionCategory.Motivation,
    question: "What tends to diminish your motivation most significantly?",
    options: [
      "Lack of clear purpose or meaning in the task",
      "Not seeing progress or positive results",
      "External pressure or control",
      "Insufficient challenge or stimulation",
      "Absence of recognition or appreciation"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "25",
    category: QuestionCategory.Motivation,
    question: "What environment helps you feel most motivated and productive?",
    options: [
      "Collaborative setting with energetic, like-minded people",
      "Quiet, private space where I can focus without interruption",
      "Flexible environment that I can adjust as needs change",
      "Structured setting with clear expectations and deadlines",
      "Inspiring, aesthetically pleasing surroundings"
    ],
    allowCustomResponse: true,
    weight: 0.7
  }
];
