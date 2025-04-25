
import { DeepInsightQuestion } from "../../types";

export const personalityQuestions: DeepInsightQuestion[] = [
  // PERSONALITY CORE - Questions 1-10
  {
    id: "q1",
    question: "When faced with a difficult decision, I typically:",
    description: "Think about your natural response pattern in challenging situations",
    category: "personality",
    options: [
      { id: "q1-a", text: "Analyze all options methodically before deciding", value: 1 },
      { id: "q1-b", text: "Go with what feels right intuitively", value: 2 },
      { id: "q1-c", text: "Consider how others would handle it", value: 3 },
      { id: "q1-d", text: "Delay the decision until absolutely necessary", value: 4 },
      { id: "q1-e", text: "Assume the worst outcome and prepare for it", value: 5 },
      { id: "q1-f", text: "Second-guess myself even after deciding", value: 6 },
    ],
  },
  {
    id: "q2",
    question: "In social gatherings, I am most often:",
    category: "personality",
    options: [
      { id: "q2-a", text: "The center of attention, energized by interaction", value: 1 },
      { id: "q2-b", text: "Engaging with a small group of close friends", value: 2 },
      { id: "q2-c", text: "Observing others and selectively participating", value: 3 },
      { id: "q2-d", text: "Feeling drained and looking forward to alone time", value: 4 },
      { id: "q2-e", text: "Judging others' behaviors and conversations", value: 5 },
      { id: "q2-f", text: "Anxious about how I'm being perceived", value: 6 },
    ],
  },
  {
    id: "q3",
    question: "My approach to personal growth is best described as:",
    category: "personality",
    options: [
      { id: "q3-a", text: "Setting clear goals with measurable outcomes", value: 1 },
      { id: "q3-b", text: "Following my passions wherever they lead me", value: 2 },
      { id: "q3-c", text: "Learning from mentors and role models", value: 3 },
      { id: "q3-d", text: "Reflecting deeply on past experiences", value: 4 },
      { id: "q3-e", text: "Comparing myself to others to gauge progress", value: 5 },
      { id: "q3-f", text: "Setting impossibly high standards for myself", value: 6 },
    ],
  },
  {
    id: "q4",
    question: "When I experience failure, I typically:",
    category: "personality",
    options: [
      { id: "q4-a", text: "Analyze what went wrong to avoid future mistakes", value: 1 },
      { id: "q4-b", text: "Feel deeply disappointed but try to move forward", value: 2 },
      { id: "q4-c", text: "Seek support and perspective from others", value: 3 },
      { id: "q4-d", text: "Question my abilities and worry about future attempts", value: 4 },
      { id: "q4-e", text: "Blame external factors or other people", value: 5 },
      { id: "q4-f", text: "Dwell on the failure and replay it mentally", value: 6 },
    ],
  },
  {
    id: "q5",
    question: "My ideal work environment would be:",
    category: "personality",
    options: [
      { id: "q5-a", text: "Structured and organized with clear expectations", value: 1 },
      { id: "q5-b", text: "Creative and flexible with room for innovation", value: 2 },
      { id: "q5-c", text: "Collaborative with strong team relationships", value: 3 },
      { id: "q5-d", text: "Independent with minimal oversight", value: 4 },
      { id: "q5-e", text: "Competitive, where individual achievement is recognized", value: 5 },
      { id: "q5-f", text: "Low-pressure with minimal risk of failure or criticism", value: 6 },
    ],
  },
  {
    id: "q6",
    question: "When learning something new, I prefer to:",
    category: "personality",
    options: [
      { id: "q6-a", text: "Follow a structured, step-by-step approach", value: 1 },
      { id: "q6-b", text: "Experiment and learn through trial and error", value: 2 },
      { id: "q6-c", text: "Watch others demonstrate before trying myself", value: 3 },
      { id: "q6-d", text: "Research thoroughly before beginning practice", value: 4 },
    ],
  },
  {
    id: "q7",
    question: "I find the most satisfaction in achievements that:",
    category: "personality",
    options: [
      { id: "q7-a", text: "Are recognized and valued by others", value: 1 },
      { id: "q7-b", text: "Fulfill my own internal standards of success", value: 2 },
      { id: "q7-c", text: "Make a positive difference for others", value: 3 },
      { id: "q7-d", text: "Advance my knowledge and understanding", value: 4 },
    ],
  },
  {
    id: "q8",
    question: "When planning for the future, I tend to:",
    category: "personality",
    options: [
      { id: "q8-a", text: "Create detailed plans with specific milestones", value: 1 },
      { id: "q8-b", text: "Have general ideas but stay flexible to opportunities", value: 2 },
      { id: "q8-c", text: "Focus on relationships and lifestyle more than achievements", value: 3 },
      { id: "q8-d", text: "Worry about potential obstacles and challenges", value: 4 },
    ],
  },
  {
    id: "q9",
    question: "My room or workspace is usually:",
    category: "personality",
    options: [
      { id: "q9-a", text: "Neat and organized with everything in its place", value: 1 },
      { id: "q9-b", text: "Somewhat cluttered but with a system that works for me", value: 2 },
      { id: "q9-c", text: "Decorated to be comfortable and personally meaningful", value: 3 },
      { id: "q9-d", text: "Frequently changing based on current projects and interests", value: 4 },
    ],
  },
  {
    id: "q10",
    question: "When making moral or ethical decisions, I primarily consider:",
    category: "personality",
    options: [
      { id: "q10-a", text: "Universal principles of right and wrong", value: 1 },
      { id: "q10-b", text: "The specific circumstances and individuals involved", value: 2 },
      { id: "q10-c", text: "The impact on community and relationships", value: 3 },
      { id: "q10-d", text: "My personal values and intuitive sense", value: 4 },
    ],
  },
];
