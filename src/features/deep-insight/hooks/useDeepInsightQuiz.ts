
import { useQuizState } from './quiz/useQuizState';

/**
 * Main hook for the Deep Insight quiz
 * This is now a thin wrapper around useQuizState that maintains
 * the original API for backward compatibility
 */
export const useDeepInsightQuiz = (totalQuestions: number) => {
  return useQuizState(totalQuestions);
};
