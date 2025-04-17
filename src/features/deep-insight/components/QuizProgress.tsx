
import React, { memo } from "react";
import { DeepInsightCategories } from "../types";
import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentCategory?: string;
}

export const QuizProgress: React.FC<QuizProgressProps> = memo(({ 
  currentQuestionIndex, 
  totalQuestions,
  currentCategory 
}) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // Find current category name if available
  const categoryObj = currentCategory ? 
    DeepInsightCategories.find(cat => cat.id === currentCategory) : 
    undefined;
  
  // Calculate which section of the assessment we're in
  const section = Math.floor((currentQuestionIndex / totalQuestions) * 5) + 1;
  const questionInSection = (currentQuestionIndex % (totalQuestions / 5)) + 1;
  const questionsInSection = totalQuestions / 5;
  
  return (
    <div className="w-full space-y-2">
      <Progress 
        value={progress} 
        className="h-2.5" 
        indicatorClassName="transition-all duration-300 ease-out"
      />
      
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
          {categoryObj && <span className="ml-1">• {categoryObj.name}</span>}
        </div>
        
        <div className="text-sm font-medium">
          Section {section}: {questionInSection}/{questionsInSection}
        </div>
      </div>
    </div>
  );
});

// Display name for better debugging
QuizProgress.displayName = "QuizProgress";
