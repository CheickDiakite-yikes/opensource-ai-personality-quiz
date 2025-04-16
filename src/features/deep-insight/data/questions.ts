
import { DeepInsightQuestion } from "../types";

// Sample questions
export const deepInsightQuestions: DeepInsightQuestion[] = [
  {
    id: "q1",
    question: "When faced with a difficult decision, I typically:",
    description: "Think about your natural response pattern in challenging situations",
    category: "decision-making",
    options: [
      { id: "q1-a", text: "Analyze all options methodically before deciding", value: 1 },
      { id: "q1-b", text: "Go with what feels right intuitively", value: 2 },
      { id: "q1-c", text: "Consider how others would handle it", value: 3 },
      { id: "q1-d", text: "Delay the decision until absolutely necessary", value: 4 },
    ],
  },
  {
    id: "q2",
    question: "In social gatherings, I am most often:",
    category: "social",
    options: [
      { id: "q2-a", text: "The center of attention, energized by interaction", value: 1 },
      { id: "q2-b", text: "Engaging with a small group of close friends", value: 2 },
      { id: "q2-c", text: "Observing others and selectively participating", value: 3 },
      { id: "q2-d", text: "Feeling drained and looking forward to alone time", value: 4 },
    ],
  },
  {
    id: "q3",
    question: "My approach to personal growth is best described as:",
    category: "growth",
    options: [
      { id: "q3-a", text: "Setting clear goals with measurable outcomes", value: 1 },
      { id: "q3-b", text: "Following my passions wherever they lead me", value: 2 },
      { id: "q3-c", text: "Learning from mentors and role models", value: 3 },
      { id: "q3-d", text: "Reflecting deeply on past experiences", value: 4 },
    ],
  },
  {
    id: "q4",
    question: "When I experience failure, I typically:",
    category: "resilience",
    options: [
      { id: "q4-a", text: "Analyze what went wrong to avoid future mistakes", value: 1 },
      { id: "q4-b", text: "Feel deeply disappointed but try to move forward", value: 2 },
      { id: "q4-c", text: "Seek support and perspective from others", value: 3 },
      { id: "q4-d", text: "Question my abilities and worry about future attempts", value: 4 },
    ],
  },
  {
    id: "q5",
    question: "My ideal work environment would be:",
    category: "work",
    options: [
      { id: "q5-a", text: "Structured and organized with clear expectations", value: 1 },
      { id: "q5-b", text: "Creative and flexible with room for innovation", value: 2 },
      { id: "q5-c", text: "Collaborative with strong team relationships", value: 3 },
      { id: "q5-d", text: "Independent with minimal oversight", value: 4 },
    ],
  },
];
