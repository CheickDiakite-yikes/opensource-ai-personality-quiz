
import { DeepInsightQuestion } from "../../types";

export const emotionalQuestions: DeepInsightQuestion[] = [
  // EMOTIONAL INTELLIGENCE - Questions 11-20
  {
    id: "q11",
    question: "When I experience strong emotions:",
    category: "emotional",
    options: [
      { id: "q11-a", text: "I can usually identify and name them precisely", value: 1 },
      { id: "q11-b", text: "I feel them intensely but sometimes struggle to identify them", value: 2 },
      { id: "q11-c", text: "I notice physical sensations before recognizing the emotion", value: 3 },
      { id: "q11-d", text: "I tend to rationalize or downplay my emotional responses", value: 4 },
    ],
  },
  {
    id: "q12",
    question: "When someone shares their problems with me:",
    category: "emotional",
    options: [
      { id: "q12-a", text: "I try to offer solutions and practical advice", value: 1 },
      { id: "q12-b", text: "I focus on listening and validating their feelings", value: 2 },
      { id: "q12-c", text: "I relate their experience to similar situations I've faced", value: 3 },
      { id: "q12-d", text: "I ask questions to understand the situation more deeply", value: 4 },
    ],
  },
  {
    id: "q13",
    question: "When I'm feeling overwhelmed, I typically:",
    category: "emotional",
    options: [
      { id: "q13-a", text: "Take time alone to process and regain composure", value: 1 },
      { id: "q13-b", text: "Talk through my feelings with someone I trust", value: 2 },
      { id: "q13-c", text: "Focus on solving the problems causing stress", value: 3 },
      { id: "q13-d", text: "Engage in physical activity or practical tasks", value: 4 },
    ],
  },
  {
    id: "q14",
    question: "How accurately can you predict how your actions will make others feel?",
    category: "emotional",
    options: [
      { id: "q14-a", text: "Very accurately - I'm highly attuned to others' emotional responses", value: 1 },
      { id: "q14-b", text: "Somewhat accurately, though I'm sometimes surprised", value: 2 },
      { id: "q14-c", text: "It depends on how well I know the person", value: 3 },
      { id: "q14-d", text: "I often find others' emotional responses unpredictable", value: 4 },
    ],
  },
  {
    id: "q15",
    question: "When facing criticism, I typically:",
    category: "emotional",
    options: [
      { id: "q15-a", text: "Consider it objectively and look for truth in it", value: 1 },
      { id: "q15-b", text: "Feel hurt initially but reflect on it later", value: 2 },
      { id: "q15-c", text: "Defend my actions or explain my reasoning", value: 3 },
      { id: "q15-d", text: "Question the critic's motives or understanding", value: 4 },
    ],
  },
  {
    id: "q16",
    question: "In emotionally charged conflicts, I tend to:",
    category: "emotional",
    options: [
      { id: "q16-a", text: "Stay calm and focus on finding rational solutions", value: 1 },
      { id: "q16-b", text: "Express my feelings openly while respecting others", value: 2 },
      { id: "q16-c", text: "Try to smooth things over and restore harmony", value: 3 },
      { id: "q16-d", text: "Need time to process before engaging constructively", value: 4 },
    ],
  },
  {
    id: "q17",
    question: "How often do you reflect on why you feel the way you do?",
    category: "emotional",
    options: [
      { id: "q17-a", text: "Very often - I regularly analyze my emotional responses", value: 1 },
      { id: "q17-b", text: "Sometimes, particularly for strong or persistent emotions", value: 2 },
      { id: "q17-c", text: "Occasionally, when someone prompts me to think about it", value: 3 },
      { id: "q17-d", text: "Rarely - I generally accept my feelings without analysis", value: 4 },
    ],
  },
  {
    id: "q18",
    question: "When someone is in distress, my most natural response is to:",
    category: "emotional",
    options: [
      { id: "q18-a", text: "Feel their distress deeply myself", value: 1 },
      { id: "q18-b", text: "Listen and validate their feelings", value: 2 },
      { id: "q18-c", text: "Offer practical help or solutions", value: 3 },
      { id: "q18-d", text: "Give them space to process their emotions", value: 4 },
    ],
  },
  {
    id: "q19",
    question: "When it comes to managing my emotions:",
    category: "emotional",
    options: [
      { id: "q19-a", text: "I can usually regulate my emotions effectively", value: 1 },
      { id: "q19-b", text: "I express emotions freely but recover quickly", value: 2 },
      { id: "q19-c", text: "Strong emotions sometimes overwhelm me", value: 3 },
      { id: "q19-d", text: "I tend to suppress or control emotional displays", value: 4 },
    ],
  },
  {
    id: "q20",
    question: "How important is emotional connection in your relationships?",
    category: "emotional",
    options: [
      { id: "q20-a", text: "Essential - I prioritize deep emotional intimacy", value: 1 },
      { id: "q20-b", text: "Very important, balanced with other aspects", value: 2 },
      { id: "q20-c", text: "Somewhat important, but I value independence too", value: 3 },
      { id: "q20-d", text: "I prefer connections based on shared activities or interests", value: 4 },
    ],
  },
];
