
import { DeepInsightQuestion } from "../../types";

export const resilienceQuestions: DeepInsightQuestion[] = [
  // RESILIENCE & GROWTH - Questions 61-70
  {
    id: "q61",
    question: "When facing significant life challenges, I typically:",
    category: "resilience",
    options: [
      { id: "q61-a", text: "Analyze the problem systematically to find solutions", value: 1 },
      { id: "q61-b", text: "Draw strength from my values and sense of purpose", value: 2 },
      { id: "q61-c", text: "Rely on supportive relationships to help me through", value: 3 },
      { id: "q61-d", text: "Focus on acceptance and adapting to the new reality", value: 4 },
      { id: "q61-e", text: "Become overwhelmed and struggle to function", value: 5 },
      { id: "q61-f", text: "Deny problems exist until they become unmanageable", value: 6 },
    ],
  },
  {
    id: "q62",
    question: "After experiencing failure or disappointment:",
    category: "resilience",
    options: [
      { id: "q62-a", text: "I quickly regroup and focus on next steps", value: 1 },
      { id: "q62-b", text: "I reflect deeply on lessons and personal growth", value: 2 },
      { id: "q62-c", text: "I process my emotions before moving forward", value: 3 },
      { id: "q62-d", text: "I sometimes struggle to regain momentum", value: 4 },
      { id: "q62-e", text: "I ruminate extensively and blame myself harshly", value: 5 },
      { id: "q62-f", text: "I blame others or external circumstances", value: 6 },
    ],
  },
  // ... continue with remaining questions
  {
    id: "q63",
    question: "My capacity to adapt to unexpected changes is:",
    category: "resilience",
    options: [
      { id: "q63-a", text: "Very strong - I thrive on change and novelty", value: 1 },
      { id: "q63-b", text: "Good - I adjust after an initial adjustment period", value: 2 },
      { id: "q63-c", text: "Variable depending on the type of change", value: 3 },
      { id: "q63-d", text: "Challenging - I prefer stability and predictability", value: 4 },
      { id: "q63-e", text: "Poor - change causes significant distress", value: 5 },
      { id: "q63-f", text: "I resist change at all costs", value: 6 },
    ],
  },
  {
    id: "q64",
    question: "During periods of high stress, I maintain wellbeing by:",
    category: "resilience",
    options: [
      { id: "q64-a", text: "Exercising or other physical activities", value: 1 },
      { id: "q64-b", text: "Mindfulness practices or spiritual activities", value: 2 },
      { id: "q64-c", text: "Connecting with supportive people", value: 3 },
      { id: "q64-d", text: "Creating structure and managing priorities", value: 4 },
      { id: "q64-e", text: "Using unhealthy coping mechanisms (overeating, substances)", value: 5 },
      { id: "q64-f", text: "I don't have effective stress management strategies", value: 6 },
    ],
  },
  {
    id: "q65",
    question: "When things don't go as planned:",
    category: "resilience",
    options: [
      { id: "q65-a", text: "I quickly pivot to alternative approaches", value: 1 },
      { id: "q65-b", text: "I see it as an opportunity to learn and improve", value: 2 },
      { id: "q65-c", text: "I try to accept what I cannot change", value: 3 },
      { id: "q65-d", text: "I analyze what went wrong before proceeding", value: 4 },
      { id: "q65-e", text: "I get frustrated and may give up entirely", value: 5 },
      { id: "q65-f", text: "I dwell on the disappointment extensively", value: 6 },
    ],
  },
  {
    id: "q66",
    question: "I derive strength during difficult times primarily from:",
    category: "resilience",
    options: [
      { id: "q66-a", text: "My inner beliefs and personal philosophy", value: 1 },
      { id: "q66-b", text: "Close relationships and social support", value: 2 },
      { id: "q66-c", text: "Past experiences overcoming challenges", value: 3 },
      { id: "q66-d", text: "Focusing on practical solutions and actions", value: 4 },
      { id: "q66-e", text: "Distracting myself from problems", value: 5 },
      { id: "q66-f", text: "I often feel I have nowhere to turn for strength", value: 6 },
    ],
  },
  {
    id: "q67",
    question: "My attitude toward painful or difficult emotions is:",
    category: "resilience",
    options: [
      { id: "q67-a", text: "I accept them as natural and try to understand them", value: 1 },
      { id: "q67-b", text: "I express them and seek support when needed", value: 2 },
      { id: "q67-c", text: "I work through them by focusing on constructive actions", value: 3 },
      { id: "q67-d", text: "I try to maintain perspective and not let them overwhelm me", value: 4 },
      { id: "q67-e", text: "I try to escape or suppress them immediately", value: 5 },
      { id: "q67-f", text: "I often feel controlled by my emotions", value: 6 },
    ],
  },
  {
    id: "q68",
    question: "When considering personal growth, I believe:",
    category: "resilience",
    options: [
      { id: "q68-a", text: "Challenges are essential opportunities for development", value: 1 },
      { id: "q68-b", text: "Gradual, consistent effort yields the best growth", value: 2 },
      { id: "q68-c", text: "Growth happens through reflection and self-awareness", value: 3 },
      { id: "q68-d", text: "Learning from others accelerates personal development", value: 4 },
      { id: "q68-e", text: "Personal growth is overrated and unnecessary", value: 5 },
      { id: "q68-f", text: "Growth requires changing who you fundamentally are", value: 6 },
    ],
  },
  {
    id: "q69",
    question: "My capacity to persevere toward long-term goals is:",
    category: "resilience",
    options: [
      { id: "q69-a", text: "Very strong - I consistently follow through", value: 1 },
      { id: "q69-b", text: "Strong when the goal remains meaningful to me", value: 2 },
      { id: "q69-c", text: "Variable depending on feedback and progress", value: 3 },
      { id: "q69-d", text: "Sometimes challenged by changing interests", value: 4 },
      { id: "q69-e", text: "Weak - I often abandon goals when difficulties arise", value: 5 },
      { id: "q69-f", text: "Almost non-existent - I rarely set long-term goals", value: 6 },
    ],
  },
  {
    id: "q70",
    question: "Looking back on difficult life experiences:",
    category: "resilience",
    options: [
      { id: "q70-a", text: "I can identify ways they made me stronger", value: 1 },
      { id: "q70-b", text: "They've helped me develop greater compassion", value: 2 },
      { id: "q70-c", text: "They've clarified what's truly important to me", value: 3 },
      { id: "q70-d", text: "I've learned valuable lessons about myself", value: 4 },
      { id: "q70-e", text: "I still feel defined by my worst experiences", value: 5 },
      { id: "q70-f", text: "I prefer not to think about painful past events", value: 6 },
    ],
  },
];
