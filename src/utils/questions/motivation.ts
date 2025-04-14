import { AssessmentQuestion, QuestionCategory } from "../types";

export const motivationQuestions: AssessmentQuestion[] = [
  {
    id: "21",
    category: QuestionCategory.Motivation,
    question: "What drives you to persist when facing significant challenges in pursuing important goals?",
    options: [
      "The deep personal meaning or purpose behind the goal",
      "The opportunity to prove capabilities to myself and others",
      "The potential positive impact on others or society",
      "The satisfaction of overcoming difficult obstacles",
      "The learning and growth that comes from the journey"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "22",
    category: QuestionCategory.Motivation,
    question: "In moments when motivation naturally dips, what strategy most effectively helps you maintain momentum?",
    options: [
      "Breaking the goal into smaller, more manageable milestones",
      "Reconnecting with my core purpose and values",
      "Seeking inspiration from others' success stories",
      "Creating accountability through commitments to others",
      "Adjusting approaches while maintaining the end goal"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "23",
    category: QuestionCategory.Motivation,
    question: "When facing a necessary but uninspiring task, which approach helps you maintain the highest quality of engagement?",
    options: [
      "Connecting it to a larger purpose or value that matters to me",
      "Finding creative ways to make the process itself more enjoyable",
      "Breaking it into smaller milestones with rewards for completion",
      "Transforming it into a challenge or opportunity to develop a skill",
      "Creating accountability through commitments to others"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "24",
    category: QuestionCategory.Motivation,
    question: "Which situation most significantly diminishes your motivation and sense of engagement?",
    options: [
      "When I don't have autonomy in how I approach the work",
      "When I don't understand the purpose behind what I'm doing",
      "When I receive little feedback about my progress or impact",
      "When the challenge level isn't well-matched to my capabilities",
      "When there's minimal connection with others in the process"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "25",
    category: QuestionCategory.Motivation,
    question: "In your experience, which element most powerfully sustains your motivation through difficulties and setbacks?",
    options: [
      "A clear and compelling vision of what I'm working toward",
      "Strong social support and encouragement from others",
      "Seeing tangible progress, even if small",
      "Connecting with my deeper values and why the goal matters",
      "The confidence gained from overcoming previous obstacles"
    ],
    allowCustomResponse: true,
    weight: 1.0
  }
];
