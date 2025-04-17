
import { DeepInsightQuestion } from "../../types";

export const socialQuestions: DeepInsightQuestion[] = [
  // SOCIAL DYNAMICS - Questions 31-40
  {
    id: "q31",
    question: "In group situations, I typically:",
    category: "social",
    options: [
      { id: "q31-a", text: "Take on leadership or facilitation roles", value: 1 },
      { id: "q31-b", text: "Contribute actively to discussions and activities", value: 2 },
      { id: "q31-c", text: "Observe and listen before participating", value: 3 },
      { id: "q31-d", text: "Connect with individuals rather than the whole group", value: 4 },
    ],
  },
  {
    id: "q32",
    question: "My approach to building new friendships is:",
    category: "social",
    options: [
      { id: "q32-a", text: "Being outgoing and initiating conversations", value: 1 },
      { id: "q32-b", text: "Finding common interests or activities", value: 2 },
      { id: "q32-c", text: "Gradually developing trust over time", value: 3 },
      { id: "q32-d", text: "Connecting deeply with few rather than many", value: 4 },
    ],
  },
  {
    id: "q33",
    question: "When there's conflict in a group:",
    category: "social",
    options: [
      { id: "q33-a", text: "I try to mediate and find compromise", value: 1 },
      { id: "q33-b", text: "I advocate for what I believe is right", value: 2 },
      { id: "q33-c", text: "I try to understand all perspectives involved", value: 3 },
      { id: "q33-d", text: "I tend to distance myself from the conflict", value: 4 },
    ],
  },
  {
    id: "q34",
    question: "My social network tends to be:",
    category: "social",
    options: [
      { id: "q34-a", text: "Wide with many acquaintances and social connections", value: 1 },
      { id: "q34-b", text: "Balanced between close friends and broader connections", value: 2 },
      { id: "q34-c", text: "Small but with deep, long-lasting relationships", value: 3 },
      { id: "q34-d", text: "Variable depending on my life circumstances", value: 4 },
    ],
  },
  {
    id: "q35",
    question: "When communicating important ideas:",
    category: "social",
    options: [
      { id: "q35-a", text: "I'm direct and straightforward about my thoughts", value: 1 },
      { id: "q35-b", text: "I consider how my message will be received", value: 2 },
      { id: "q35-c", text: "I tailor my approach to each specific person", value: 3 },
      { id: "q35-d", text: "I prefer writing to speaking for complex ideas", value: 4 },
    ],
  },
  {
    id: "q36",
    question: "In close relationships, I value most:",
    category: "social",
    options: [
      { id: "q36-a", text: "Open, honest communication", value: 1 },
      { id: "q36-b", text: "Mutual support and reliability", value: 2 },
      { id: "q36-c", text: "Shared experiences and enjoyment", value: 3 },
      { id: "q36-d", text: "Respect for independence and boundaries", value: 4 },
    ],
  },
  {
    id: "q37",
    question: "When someone disagrees with my viewpoint:",
    category: "social",
    options: [
      { id: "q37-a", text: "I enjoy debating and defending my position", value: 1 },
      { id: "q37-b", text: "I'm curious about their reasoning and perspective", value: 2 },
      { id: "q37-c", text: "I look for points of common ground", value: 3 },
      { id: "q37-d", text: "I might reconsider my view if their argument is strong", value: 4 },
    ],
  },
  {
    id: "q38",
    question: "When someone needs emotional support, I typically:",
    category: "social",
    options: [
      { id: "q38-a", text: "Listen attentively without immediately offering advice", value: 1 },
      { id: "q38-b", text: "Help them analyze the problem and find solutions", value: 2 },
      { id: "q38-c", text: "Share similar experiences to show understanding", value: 3 },
      { id: "q38-d", text: "Offer practical help and tangible support", value: 4 },
    ],
  },
  {
    id: "q39",
    question: "In terms of social boundaries:",
    category: "social",
    options: [
      { id: "q39-a", text: "I'm quite open and readily share personal information", value: 1 },
      { id: "q39-b", text: "I adjust my openness depending on the relationship", value: 2 },
      { id: "q39-c", text: "I'm selective about what personal information I share", value: 3 },
      { id: "q39-d", text: "I prefer maintaining clear privacy boundaries", value: 4 },
    ],
  },
  {
    id: "q40",
    question: "When working with others on projects:",
    category: "social",
    options: [
      { id: "q40-a", text: "I enjoy collaborating and building on others' ideas", value: 1 },
      { id: "q40-b", text: "I prefer clearly defined individual responsibilities", value: 2 },
      { id: "q40-c", text: "I often take on coordination or leadership roles", value: 3 },
      { id: "q40-d", text: "I'm most productive when I can work independently", value: 4 },
    ],
  },
];
