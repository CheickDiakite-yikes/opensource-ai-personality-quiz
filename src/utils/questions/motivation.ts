
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Motivation - Enhanced with self-determination theory and nuanced motivational factors
export const motivationQuestions: AssessmentQuestion[] = [
  {
    id: "21",
    category: QuestionCategory.Motivation,
    question: "When you commit deeply to pursuing a challenging long-term goal, what typically drives your persistence?",
    options: [
      "The intrinsic enjoyment of the activities involved",
      "The personal meaning or purpose the goal represents for you",
      "The opportunity to develop mastery and demonstrate competence",
      "The vision of the specific outcome or achievement",
      "The way it connects you to something larger than yourself"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "22",
    category: QuestionCategory.Motivation,
    question: "After successfully completing a significant project or achievement, what most strongly motivates your next steps?",
    options: [
      "Seeking a more challenging extension of what I've just accomplished",
      "Exploring an entirely different domain that intrigues me",
      "Deepening my expertise in an aspect I found particularly engaging",
      "Applying what I've learned to help others achieve similar goals",
      "Reflecting on the experience before determining my next direction"
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
