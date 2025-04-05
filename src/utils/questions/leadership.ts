
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Leadership - Enhanced with transformational leadership theory, situational leadership, and leadership psychology
export const leadershipQuestions: AssessmentQuestion[] = [
  {
    id: "46",
    category: QuestionCategory.Leadership,
    question: "What do you believe is the most important quality of effective leadership?",
    options: [
      "Clear vision and the ability to inspire others",
      "Emotional intelligence and understanding of people",
      "Strategic thinking and sound decision-making",
      "Integrity and leading by example",
      "Adaptability and responsiveness to change"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "47",
    category: QuestionCategory.Leadership,
    question: "How do you typically influence others toward a goal or perspective?",
    options: [
      "By clearly articulating the reasoning and benefits",
      "By demonstrating enthusiasm and conviction",
      "By listening to concerns and finding common ground",
      "By setting an example through my own actions",
      "By emphasizing shared values and principles"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "48",
    category: QuestionCategory.Leadership,
    question: "When in a leadership role, how do you handle disagreement or dissenting views?",
    options: [
      "I actively seek out diverse perspectives to test my thinking",
      "I listen carefully and integrate valid points into the approach",
      "I encourage open debate to find the best solution",
      "I appreciate the input but make the final decision myself",
      "I look for common ground and areas of consensus"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "49",
    category: QuestionCategory.Leadership,
    question: "How comfortable are you with taking charge in group situations?",
    options: [
      "Very comfortable – I naturally step into leadership roles",
      "Comfortable when I have expertise or feel responsible",
      "It depends on the context and the needs of the group",
      "I prefer to influence from within rather than leading formally",
      "I'm more comfortable supporting a capable leader"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "50",
    category: QuestionCategory.Leadership,
    question: "How do you typically respond when things go wrong under your leadership?",
    options: [
      "I take full responsibility and focus on solutions",
      "I analyze what happened to prevent similar issues",
      "I engage the team in problem-solving together",
      "I acknowledge the issue while maintaining morale",
      "I evaluate whether adjustments in approach are needed"
    ],
    allowCustomResponse: true,
    weight: 0.9
  }
];
