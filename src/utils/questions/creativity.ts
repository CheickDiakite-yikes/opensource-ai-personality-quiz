
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Creativity - Enhanced with divergent thinking, creative cognition, and flow state research
export const creativityQuestions: AssessmentQuestion[] = [
  {
    id: "41",
    category: QuestionCategory.Creativity,
    question: "How do you typically generate new ideas or approaches?",
    options: [
      "Connecting seemingly unrelated concepts or fields",
      "Building upon and improving existing ideas",
      "Through collaboration and discussion with others",
      "During quiet reflection or meditative states",
      "By challenging assumptions and conventional thinking"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "42",
    category: QuestionCategory.Creativity,
    question: "When do you feel most creative or innovative?",
    options: [
      "When I'm under pressure with tight deadlines",
      "When I have unstructured time to explore possibilities",
      "When I'm collaborating with diverse perspectives",
      "When I'm in a relaxed, positive emotional state",
      "When I'm challenged by difficult problems or constraints"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "43",
    category: QuestionCategory.Creativity,
    question: "How important is creative expression in your life?",
    options: [
      "Essential – it's a primary way I understand and process experience",
      "Very important for specific aspects of my life and work",
      "Moderately important as one of several valuable pursuits",
      "Somewhat important, mainly as a recreational activity",
      "Relatively minor compared to other priorities and interests"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: "44",
    category: QuestionCategory.Creativity,
    question: "How do you typically respond to unconventional or unusual ideas?",
    options: [
      "With excitement and eagerness to explore them further",
      "With curious interest but some practical skepticism",
      "By considering how they might be practically applied",
      "I evaluate them against established principles and knowledge",
      "I appreciate them intellectually but prefer proven approaches"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "45",
    category: QuestionCategory.Creativity,
    question: "What do you find most challenging about creative processes?",
    options: [
      "Translating abstract ideas into concrete reality",
      "Finding the right balance between novelty and practicality",
      "Managing self-doubt and internal criticism",
      "Maintaining momentum through implementation",
      "Knowing when something is truly finished or complete"
    ],
    allowCustomResponse: true,
    weight: 0.7
  }
];

