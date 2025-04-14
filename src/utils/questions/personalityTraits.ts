import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Personality Traits - Enhanced with Big Five/HEXACO framework insights
export const personalityTraitsQuestions: AssessmentQuestion[] = [
  {
    id: "1",
    category: QuestionCategory.PersonalityTraits,
    question: "When facing an important decision with multiple good options, what do you rely on most?",
    options: [
      "Systematic analysis of pros and cons for each option",
      "How each option aligns with my core values and principles",
      "Input and perspectives from people I trust and respect",
      "My intuition and emotional response to each possibility",
      "Past experiences with similar situations and their outcomes"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "2",
    category: QuestionCategory.PersonalityTraits,
    question: "How do you typically respond when your carefully made plans are unexpectedly disrupted?",
    options: [
      "I quickly adapt and create alternative approaches",
      "I feel frustrated but methodically work on a new plan",
      "I seek to understand what went wrong before proceeding",
      "I try to salvage as much of the original plan as possible",
      "I see it as potentially opening up better opportunities"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "3",
    category: QuestionCategory.PersonalityTraits,
    question: "In collaborative projects where opinions differ strongly, how do you typically contribute?",
    options: [
      "I take charge to establish direction when there's uncertainty",
      "I focus on finding common ground between opposing viewpoints",
      "I carefully analyze all perspectives before forming my position",
      "I support others' ideas while adding refinements and improvements",
      "I offer creative alternatives that hadn't been considered"
    ],
    allowCustomResponse: true,
    weight: 1.0
  },
  {
    id: "4",
    category: QuestionCategory.PersonalityTraits,
    question: "Which statement most accurately describes how you recharge after periods of intense social interaction?",
    options: [
      "I need significant alone time with minimal external stimulation",
      "I prefer quiet activities with one or two close friends",
      "I balance social and solitary activities based on my energy level",
      "I shift to a different type of social setting with different people",
      "I rarely feel drained by social interaction and can continue engaging"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "5",
    category: QuestionCategory.PersonalityTraits,
    question: "When you receive constructive criticism about your work, what is your most authentic immediate reaction?",
    options: [
      "I appreciate the feedback and immediately consider how to implement it",
      "I feel temporarily disappointed but recognize its value for growth",
      "I carefully evaluate whether the criticism is valid before reacting",
      "I tend to feel defensive initially before processing it objectively",
      "I actively seek clarification to understand the critique fully"
    ],
    allowCustomResponse: true,
    weight: 0.9
  }
];
