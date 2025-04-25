
import { allQuestions } from './questions';
import { deepInsightQuestions } from './deep-insight/questionBank';

/**
 * Export the full question bank from our modular question structure.
 * This file serves as the main entry point for accessing all assessment questions.
 * Each category is defined in its own file for better organization and maintainability.
 */
export const questionBank = allQuestions;

/**
 * Export the Deep Insight questions as a separate bank
 * This is a more focused, research-backed set of 50 questions 
 * designed for deeper psychological insights
 */
export { deepInsightQuestions };
