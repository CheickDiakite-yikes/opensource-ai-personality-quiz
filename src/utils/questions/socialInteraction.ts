
import { AssessmentQuestion, QuestionCategory } from "../types";

// Questions focused on Social Interaction - Enhanced with attachment theory, social cognitive theory, and interpersonal dynamics
export const socialInteractionQuestions: AssessmentQuestion[] = [
  {
    id: "31",
    category: QuestionCategory.SocialInteraction,
    question: "In conversations, which are you more likely to do?",
    options: [
      "Listen attentively, focusing on understanding the other person",
      "Share my thoughts, feelings, and experiences openly",
      "Ask questions to deepen the discussion",
      "Look for opportunities to find common ground",
      "Offer solutions or advice when I see a problem"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "32",
    category: QuestionCategory.SocialInteraction,
    question: "How do you typically navigate conflicts in relationships?",
    options: [
      "Address issues directly with honest communication",
      "Look for compromise and common ground",
      "Take time to understand all perspectives before responding",
      "Focus on maintaining the relationship while working through issues",
      "Adapt my approach based on what the other person needs"
    ],
    allowCustomResponse: true,
    weight: 0.9
  },
  {
    id: "33",
    category: QuestionCategory.SocialInteraction,
    question: "What role do social gatherings typically play in your life?",
    options: [
      "They energize me and are essential to my wellbeing",
      "I enjoy them in moderation but also need alone time",
      "I prefer small, intimate gatherings with close friends",
      "They're valuable opportunities for meaningful connection",
      "I tend to find them draining, though occasionally rewarding"
    ],
    allowCustomResponse: true,
    weight: 0.7
  },
  {
    id: "34",
    category: QuestionCategory.SocialInteraction,
    question: "How easily do you form deep connections with new people?",
    options: [
      "Very easily – I connect deeply with people right away",
      "Moderately easily with people who share my interests or values",
      "It varies greatly depending on the person and context",
      "I'm selective and take time to develop deep connections",
      "I find it challenging but rewarding with the right people"
    ],
    allowCustomResponse: true,
    weight: 0.8
  },
  {
    id: "35",
    category: QuestionCategory.SocialInteraction,
    question: "How important is it for you to be part of a community or group?",
    options: [
      "Essential – I thrive when I'm connected to a community",
      "Important for some aspects of life but not others",
      "I value a few close relationships over broader community",
      "I appreciate community support but maintain independence",
      "I prefer self-sufficiency and limited social entanglements"
    ],
    allowCustomResponse: true,
    weight: 0.7
  }
];
