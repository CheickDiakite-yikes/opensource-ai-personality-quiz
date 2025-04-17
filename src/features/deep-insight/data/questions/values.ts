
import { DeepInsightQuestion } from "../../types";

export const valuesQuestions: DeepInsightQuestion[] = [
  // VALUE SYSTEMS - Questions 51-60
  {
    id: "q51",
    question: "Which best describes your approach to truth and knowledge?",
    category: "values",
    options: [
      { id: "q51-a", text: "There are objective truths we should seek to understand", value: 1 },
      { id: "q51-b", text: "Truth is relative to perspective and context", value: 2 },
      { id: "q51-c", text: "Truth emerges through consensus and dialogue", value: 3 },
      { id: "q51-d", text: "Practical utility matters more than abstract truth", value: 4 },
    ],
  },
  {
    id: "q52",
    question: "Which of these values do you consider most fundamental?",
    category: "values",
    options: [
      { id: "q52-a", text: "Freedom and individual autonomy", value: 1 },
      { id: "q52-b", text: "Compassion and care for others", value: 2 },
      { id: "q52-c", text: "Justice and fairness", value: 3 },
      { id: "q52-d", text: "Tradition and respect for established wisdom", value: 4 },
    ],
  },
  {
    id: "q53",
    question: "When considering ethical dilemmas, I primarily focus on:",
    category: "values",
    options: [
      { id: "q53-a", text: "Universal principles that should apply to everyone", value: 1 },
      { id: "q53-b", text: "The specific context and individuals involved", value: 2 },
      { id: "q53-c", text: "The outcomes and consequences of different choices", value: 3 },
      { id: "q53-d", text: "Maintaining harmonious relationships and community", value: 4 },
    ],
  },
  {
    id: "q54",
    question: "I believe the best societies prioritize:",
    category: "values",
    options: [
      { id: "q54-a", text: "Individual rights and freedoms", value: 1 },
      { id: "q54-b", text: "Community welfare and collective good", value: 2 },
      { id: "q54-c", text: "Order, security, and stability", value: 3 },
      { id: "q54-d", text: "Equality and fair distribution of resources", value: 4 },
    ],
  },
  {
    id: "q55",
    question: "Which statement best reflects your view on authority?",
    category: "values",
    options: [
      { id: "q55-a", text: "Authority should be questioned and held accountable", value: 1 },
      { id: "q55-b", text: "Legitimate authority deserves respect and cooperation", value: 2 },
      { id: "q55-c", text: "Authority should be earned through competence", value: 3 },
      { id: "q55-d", text: "Authority works best when it serves those it governs", value: 4 },
    ],
  },
  {
    id: "q56",
    question: "Which quality do you most value in yourself and others?",
    category: "values",
    options: [
      { id: "q56-a", text: "Integrity and honesty", value: 1 },
      { id: "q56-b", text: "Kindness and compassion", value: 2 },
      { id: "q56-c", text: "Courage and determination", value: 3 },
      { id: "q56-d", text: "Wisdom and good judgment", value: 4 },
    ],
  },
  {
    id: "q57",
    question: "Regarding wealth and material resources:",
    category: "values",
    options: [
      { id: "q57-a", text: "They're important tools for freedom and opportunity", value: 1 },
      { id: "q57-b", text: "Their value depends on how they're used for good", value: 2 },
      { id: "q57-c", text: "Simple living often leads to greater contentment", value: 3 },
      { id: "q57-d", text: "Fair distribution is more important than accumulation", value: 4 },
    ],
  },
  {
    id: "q58",
    question: "I believe human nature is fundamentally:",
    category: "values",
    options: [
      { id: "q58-a", text: "Good but influenced by circumstances", value: 1 },
      { id: "q58-b", text: "A mix of positive and negative potentials", value: 2 },
      { id: "q58-c", text: "Primarily self-interested but capable of altruism", value: 3 },
      { id: "q58-d", text: "Shaped more by culture and society than inherent traits", value: 4 },
    ],
  },
  {
    id: "q59",
    question: "The legacy I would most like to leave is:",
    category: "values",
    options: [
      { id: "q59-a", text: "Having made a positive difference in others' lives", value: 1 },
      { id: "q59-b", text: "Having lived authentically according to my values", value: 2 },
      { id: "q59-c", text: "Having created something lasting and meaningful", value: 3 },
      { id: "q59-d", text: "Having continuously grown and evolved as a person", value: 4 },
    ],
  },
  {
    id: "q60",
    question: "On the question of free will versus determinism:",
    category: "values",
    options: [
      { id: "q60-a", text: "We have significant free will and moral responsibility", value: 1 },
      { id: "q60-b", text: "Our choices are constrained but still meaningful", value: 2 },
      { id: "q60-c", text: "External and internal factors strongly shape our choices", value: 3 },
      { id: "q60-d", text: "This theoretical question matters less than practical living", value: 4 },
    ],
  },
];
