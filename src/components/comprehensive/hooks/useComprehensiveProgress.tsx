
import { AssessmentQuestion, QuestionCategory } from "@/utils/types";
import { ComprehensiveResponse } from "./comprehensiveTypes";

export function useComprehensiveProgress(
  questionBank: AssessmentQuestion[], 
  responses: Record<string, ComprehensiveResponse>
) {
  // Calculate category progress
  const categoryProgress = calculateCategoryProgress(questionBank, responses);
  
  return {
    categoryProgress
  };
}

// Helper function to calculate progress for each category
const calculateCategoryProgress = (
  questions: AssessmentQuestion[], 
  responses: Record<string, ComprehensiveResponse>
): Record<QuestionCategory, number> => {
  // Initialize all categories with 0 progress
  const progress: Record<QuestionCategory, number> = Object.values(QuestionCategory).reduce(
    (acc, category) => ({ ...acc, [category]: 0 }),
    {} as Record<QuestionCategory, number>
  );
  
  // Count questions per category
  const totalPerCategory: Record<string, number> = {};
  const answeredPerCategory: Record<string, number> = {};
  
  questions.forEach(q => {
    totalPerCategory[q.category] = (totalPerCategory[q.category] || 0) + 1;
    
    if (responses[q.id]?.selectedOption || responses[q.id]?.customResponse) {
      answeredPerCategory[q.category] = (answeredPerCategory[q.category] || 0) + 1;
    }
  });
  
  // Calculate percentage for each category
  Object.keys(totalPerCategory).forEach(category => {
    progress[category as QuestionCategory] = (answeredPerCategory[category] || 0) / totalPerCategory[category] * 100;
  });
  
  return progress;
};
