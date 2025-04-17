
import { DeepInsightQuestion } from "../../types";

export const cognitiveQuestions: DeepInsightQuestion[] = [
  // COGNITIVE PATTERNS - Questions 21-30
  {
    id: "q21",
    question: "When solving complex problems, I prefer to:",
    category: "cognitive",
    options: [
      { id: "q21-a", text: "Break them down into smaller, manageable parts", value: 1 },
      { id: "q21-b", text: "Consider the big picture and overall patterns", value: 2 },
      { id: "q21-c", text: "Brainstorm multiple creative approaches", value: 3 },
      { id: "q21-d", text: "Draw on similar problems I've solved before", value: 4 },
    ],
  },
  {
    id: "q22",
    question: "When forming opinions, I prioritize:",
    category: "cognitive",
    options: [
      { id: "q22-a", text: "Logical reasoning and objective evidence", value: 1 },
      { id: "q22-b", text: "Personal experiences and observations", value: 2 },
      { id: "q22-c", text: "Input from experts and trusted sources", value: 3 },
      { id: "q22-d", text: "My intuition and what feels right", value: 4 },
    ],
  },
  {
    id: "q23",
    question: "How do you typically approach learning new subjects?",
    category: "cognitive",
    options: [
      { id: "q23-a", text: "Systematically studying fundamentals before applications", value: 1 },
      { id: "q23-b", text: "Diving in with practical applications and learning as needed", value: 2 },
      { id: "q23-c", text: "Finding connections to things I already understand", value: 3 },
      { id: "q23-d", text: "Exploring different perspectives and approaches", value: 4 },
    ],
  },
  {
    id: "q24",
    question: "When considering the future, I tend to:",
    category: "cognitive",
    options: [
      { id: "q24-a", text: "Make detailed plans based on likely outcomes", value: 1 },
      { id: "q24-b", text: "Imagine various possibilities and scenarios", value: 2 },
      { id: "q24-c", text: "Focus on immediate next steps rather than distant outcomes", value: 3 },
      { id: "q24-d", text: "Adapt to circumstances as they occur", value: 4 },
    ],
  },
  {
    id: "q25",
    question: "When explaining complex ideas to others, I typically:",
    category: "cognitive",
    options: [
      { id: "q25-a", text: "Use precise definitions and logical structure", value: 1 },
      { id: "q25-b", text: "Use analogies and real-world examples", value: 2 },
      { id: "q25-c", text: "Use visual aids or demonstrations", value: 3 },
      { id: "q25-d", text: "Adapt my explanation based on the listener's responses", value: 4 },
    ],
  },
  {
    id: "q26",
    question: "When I encounter information that contradicts my beliefs:",
    category: "cognitive",
    options: [
      { id: "q26-a", text: "I evaluate it critically based on credibility and evidence", value: 1 },
      { id: "q26-b", text: "I consider how it might change or refine my understanding", value: 2 },
      { id: "q26-c", text: "I compare it to my existing knowledge and experience", value: 3 },
      { id: "q26-d", text: "I feel skeptical until multiple sources confirm it", value: 4 },
    ],
  },
  {
    id: "q27",
    question: "My thinking tends to be most effective when:",
    category: "cognitive",
    options: [
      { id: "q27-a", text: "I focus deeply on one topic without distractions", value: 1 },
      { id: "q27-b", text: "I'm engaging with diverse perspectives and ideas", value: 2 },
      { id: "q27-c", text: "I'm collaborating and discussing with others", value: 3 },
      { id: "q27-d", text: "I'm under some pressure or time constraint", value: 4 },
    ],
  },
  {
    id: "q28",
    question: "When remembering past events, I most easily recall:",
    category: "cognitive",
    options: [
      { id: "q28-a", text: "Specific details and sequences of what happened", value: 1 },
      { id: "q28-b", text: "The emotions and personal significance of the experience", value: 2 },
      { id: "q28-c", text: "Visual images and the physical setting", value: 3 },
      { id: "q28-d", text: "The general impression rather than specific details", value: 4 },
    ],
  },
  {
    id: "q29",
    question: "I'm most motivated to think deeply about topics that:",
    category: "cognitive",
    options: [
      { id: "q29-a", text: "Present complex logical or abstract challenges", value: 1 },
      { id: "q29-b", text: "Have practical applications to real-world problems", value: 2 },
      { id: "q29-c", text: "Connect to human experiences and values", value: 3 },
      { id: "q29-d", text: "Allow for creative or innovative approaches", value: 4 },
    ],
  },
  {
    id: "q30",
    question: "When faced with ambiguity or uncertainty:",
    category: "cognitive",
    options: [
      { id: "q30-a", text: "I try to gather more information to reduce the uncertainty", value: 1 },
      { id: "q30-b", text: "I'm comfortable exploring multiple potential interpretations", value: 2 },
      { id: "q30-c", text: "I look for patterns or similarities to familiar situations", value: 3 },
      { id: "q30-d", text: "I focus on what's clear while tolerating some ambiguity", value: 4 },
    ],
  },
];
