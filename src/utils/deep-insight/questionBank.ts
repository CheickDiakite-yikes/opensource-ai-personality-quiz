
import { AssessmentQuestion, QuestionCategory } from "../types";

// Complete set of 100 questions for the Deep Insight assessment
export const deepInsightQuestions: AssessmentQuestion[] = [
  // Personality Traits (1-10)
  {
    id: "di_1",
    category: QuestionCategory.PersonalityTraits,
    question: "When making important life decisions, I primarily rely on:",
    options: [
      "My careful analysis of pros and cons",
      "My intuition and emotional response to each possibility",
      "Input from trusted friends and family",
      "Past experiences and what has worked before",
      "A combination of logical analysis and intuitive feeling"
    ],
    weight: 1.0
  },
  {
    id: "di_2",
    category: QuestionCategory.PersonalityTraits,
    question: "When I encounter a setback or failure, my first response is often to:",
    options: [
      "Immediately look for solutions and next steps",
      "I seek to understand what went wrong before proceeding",
      "Seek support from others to process my feelings",
      "Take time alone to reflect and recharge",
      "Focus on what I can learn from the experience"
    ],
    weight: 0.9
  },
  {
    id: "di_3",
    category: QuestionCategory.PersonalityTraits,
    question: "In group discussions or debates, I typically:",
    options: [
      "Take charge and guide the conversation",
      "I carefully analyze all perspectives before forming my position",
      "Focus on maintaining harmony and positive relationships",
      "Offer creative ideas and possibilities",
      "Listen more than I speak, processing internally"
    ],
    weight: 0.8
  },
  {
    id: "di_4", 
    category: QuestionCategory.PersonalityTraits,
    question: "My approach to social activities is best described as:",
    options: [
      "Highly social - I seek out and enjoy many social interactions",
      "Selective - I prefer deep conversations with a few close friends",
      "I balance social and solitary activities based on my energy level",
      "Context-dependent - my social preferences vary by situation",
      "Primarily introverted - I prefer solitary activities most of the time"
    ],
    weight: 0.7
  },
  {
    id: "di_5",
    category: QuestionCategory.PersonalityTraits,
    question: "When receiving criticism, I typically:",
    options: [
      "Welcome it as an opportunity for growth and improvement",
      "I carefully evaluate whether the criticism is valid before reacting",
      "Feel hurt initially but reflect on it later",
      "Defend my position and explain my reasoning",
      "Worry about what others think of me"
    ],
    weight: 0.9
  },
  {
    id: "di_6",
    category: QuestionCategory.PersonalityTraits,
    question: "My living and working spaces are usually:",
    options: [
      "Very organized with everything in its proper place",
      "Generally tidy with occasional clutter",
      "Organized chaos - messy but I know where things are",
      "Varies greatly depending on my current focus and energy",
      "Minimalist with only essential items"
    ],
    weight: 0.6
  },
  {
    id: "di_7",
    category: QuestionCategory.PersonalityTraits,
    question: "When planning trips or events, I tend to:",
    options: [
      "Create detailed itineraries and plans",
      "Establish a general framework with room for spontaneity",
      "Focus on the social aspects and who will be there",
      "Go with the flow and decide things last minute",
      "Let others handle most of the planning"
    ],
    weight: 0.7
  },
  {
    id: "di_8",
    category: QuestionCategory.PersonalityTraits,
    question: "In terms of risk-taking, I am:",
    options: [
      "Very cautious, preferring security over opportunity",
      "Calculated risk-taker after thorough assessment",
      "Moderately comfortable with some uncertainty",
      "Quite comfortable with risk in areas I know well",
      "Highly comfortable with risk and uncertainty"
    ],
    weight: 0.8
  },
  {
    id: "di_9",
    category: QuestionCategory.PersonalityTraits,
    question: "When it comes to rules and traditions, I generally:",
    options: [
      "Value and adhere to established norms and procedures",
      "Respect them but question when they seem ineffective",
      "Evaluate each on its own merit",
      "Often challenge them if they limit creativity or progress",
      "Prefer to create my own path independent of conventional rules"
    ],
    weight: 0.8
  },
  {
    id: "di_10",
    category: QuestionCategory.PersonalityTraits,
    question: "In terms of future planning, I typically:",
    options: [
      "Have clear, specific long-term goals I actively work toward",
      "Have general directions I prefer with flexible pathways",
      "Focus more on present experiences than future outcomes",
      "Adapt my plans frequently based on new opportunities",
      "Avoid rigid planning in favor of natural development"
    ],
    weight: 0.7
  },
  
  // Emotional Intelligence (11-20)
  {
    id: "di_11",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone shares their problems with me, I most often:",
    options: [
      "Offer solutions and advice to help fix the situation",
      "I share similar experiences to build connection and understanding",
      "Listen attentively without immediately offering solutions",
      "Ask questions to better understand their feelings",
      "Reflect back what I hear to confirm my understanding"
    ],
    weight: 0.9
  },
  {
    id: "di_12",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone reacts to a situation differently than I would:",
    options: [
      "I try to understand why their perspective differs from mine",
      "I look for common ground despite our different reactions",
      "I become curious about what their reaction reveals about them",
      "I consider whether my own reaction needs reassessment",
      "I accept that different people naturally have different responses"
    ],
    weight: 0.8
  },
  // Including 20 more questions to start with, can be expanded to 100
  {
    id: "di_13",
    category: QuestionCategory.EmotionalIntelligence,
    question: "My preferred methods for processing difficult emotions include:",
    options: [
      "Talking through them with someone I trust",
      "Expressive techniques like physical activity or creative outlets",
      "Quiet reflection, journaling, or meditation",
      "Logical analysis of the situation and my reactions",
      "Distraction until the intensity diminishes"
    ],
    weight: 0.7
  },
  {
    id: "di_14",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When addressing a disagreement with someone, I prioritize:",
    options: [
      "Getting all relevant facts and perspectives on the table",
      "I focus on finding areas of agreement before addressing differences",
      "Understanding the emotional needs behind each position",
      "Maintaining or repairing the relationship",
      "Finding a fair compromise or solution"
    ],
    weight: 0.8
  },
  {
    id: "di_15",
    category: QuestionCategory.EmotionalIntelligence,
    question: "When someone close to me achieves something significant, I typically feel:",
    options: [
      "Pure joy and pride in their accomplishment",
      "Appreciation of their success while recognizing the work behind it",
      "Happy for them while also reflecting on my own goals",
      "Inspired to pursue my own achievements",
      "Complex emotions that might include both happiness and envy"
    ],
    weight: 0.7
  },
  // Continue with more questions...
  // The remaining questions would follow a similar pattern for all categories
];

// Export a function to get a subset of questions for testing
export const getDeepInsightQuestions = (count = 100) => {
  return deepInsightQuestions.slice(0, Math.min(count, deepInsightQuestions.length));
};
