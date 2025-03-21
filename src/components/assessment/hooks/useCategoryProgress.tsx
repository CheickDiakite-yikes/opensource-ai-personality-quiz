
import { useEffect, useState } from "react";
import { AssessmentQuestion, AssessmentResponse, QuestionCategory } from "@/utils/types";

export const useCategoryProgress = (
  responses: AssessmentResponse[],
  allQuestions: AssessmentQuestion[]
) => {
  const [categoryProgress, setCategoryProgress] = useState<Record<QuestionCategory, number>>({} as Record<QuestionCategory, number>);

  // Calculate category progress
  useEffect(() => {
    const progress: Record<QuestionCategory, { completed: number, total: number }> = {} as Record<QuestionCategory, { completed: number, total: number }>;
    
    // Initialize all categories
    Object.values(QuestionCategory).forEach(category => {
      progress[category] = { completed: 0, total: 0 };
    });
    
    // Count total questions per category
    allQuestions.forEach(question => {
      progress[question.category].total += 1;
    });
    
    // Count completed questions per category
    responses.forEach(response => {
      const question = allQuestions.find(q => q.id === response.questionId);
      if (question && (response.selectedOption || response.customResponse)) {
        progress[question.category].completed += 1;
      }
    });
    
    // Convert to percentages
    const percentages: Record<QuestionCategory, number> = {} as Record<QuestionCategory, number>;
    Object.entries(progress).forEach(([category, data]) => {
      percentages[category as QuestionCategory] = data.total > 0 
        ? (data.completed / data.total) * 100 
        : 0;
    });
    
    setCategoryProgress(percentages);
  }, [responses, allQuestions]);

  return { categoryProgress };
};
