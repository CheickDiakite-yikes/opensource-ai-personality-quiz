
import { DeepInsightQuestion } from "../../types";
import { personalityQuestions } from "./personality";
import { emotionalQuestions } from "./emotional";
import { cognitiveQuestions } from "./cognitive";
import { socialQuestions } from "./social";
import { motivationQuestions } from "./motivation";
import { valuesQuestions } from "./values";
import { resilienceQuestions } from "./resilience";
import { creativityQuestions } from "./creativity";
import { leadershipQuestions } from "./leadership";
import { mindfulnessQuestions } from "./mindfulness";

// Export individual question categories so they can be used separately if needed
export {
  personalityQuestions,
  emotionalQuestions,
  cognitiveQuestions,
  socialQuestions,
  motivationQuestions,
  valuesQuestions,
  resilienceQuestions,
  creativityQuestions,
  leadershipQuestions,
  mindfulnessQuestions
};

// Combine all questions into a single array for the complete assessment
export const deepInsightQuestions: DeepInsightQuestion[] = [
  ...personalityQuestions,
  ...emotionalQuestions,
  ...cognitiveQuestions,
  ...socialQuestions,
  ...motivationQuestions,
  ...valuesQuestions,
  ...resilienceQuestions,
  ...creativityQuestions,
  ...leadershipQuestions,
  ...mindfulnessQuestions
];
