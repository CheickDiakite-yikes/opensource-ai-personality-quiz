
import React from "react";
import { DeepInsightCategories } from "../types";
import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentCategory?: string;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({ 
  currentQuestionIndex, 
  totalQuestions,
  currentCategory 
}) => {
  // Calculate progress percentage
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // Find current category name if available
  const categoryName = currentCategory ? 
    DeepInsightCategories.find(cat => cat.id === currentCategory)?.name : 
    undefined;
  
  // Calculate which section of the assessment we're in
  const section = Math.floor((currentQuestionIndex / totalQuestions) * 5) + 1;
  const questionsInSection = Math.ceil(totalQuestions / 5);
  const questionInSection = (currentQuestionIndex % questionsInSection) + 1;
  
  return (
    <div className="w-full space-y-2">
      <Progress 
        value={progress} 
        className="h-2.5" 
      />
      
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
          {categoryName && <span className="ml-1">• {categoryName}</span>}
        </div>
        
        <div className="text-sm font-medium">
          Section {section}: {questionInSection}/{questionsInSection}
        </div>
      </div>
    </div>
  );
};
