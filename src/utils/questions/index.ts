
import { personalityTraitsQuestions } from './personalityTraits';
import { emotionalIntelligenceQuestions } from './emotionalIntelligence';
import { cognitivePatternQuestions } from './cognitivePatterns';
import { valueSystemQuestions } from './valueSystems';
import { motivationQuestions } from './motivation';
import { resilienceQuestions } from './resilience';
import { socialInteractionQuestions } from './socialInteraction';
import { decisionMakingQuestions } from './decisionMaking';
import { creativityQuestions } from './creativity';
import { leadershipQuestions } from './leadership';
import { AssessmentQuestion } from '../types';

// Export all question categories for individual use if needed
export {
  personalityTraitsQuestions,
  emotionalIntelligenceQuestions,
  cognitivePatternQuestions,
  valueSystemQuestions,
  motivationQuestions,
  resilienceQuestions,
  socialInteractionQuestions,
  decisionMakingQuestions,
  creativityQuestions,
  leadershipQuestions
};

// Combined question bank with all questions
export const allQuestions: AssessmentQuestion[] = [
  ...personalityTraitsQuestions,
  ...emotionalIntelligenceQuestions,
  ...cognitivePatternQuestions,
  ...valueSystemQuestions,
  ...motivationQuestions,
  ...resilienceQuestions,
  ...socialInteractionQuestions,
  ...decisionMakingQuestions,
  ...creativityQuestions,
  ...leadershipQuestions
];
