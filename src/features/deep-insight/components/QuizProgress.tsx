
import React from "react";
import { DeepInsightCategories } from "../types";

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
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // Find current category name if available
  const category = currentCategory ? 
    DeepInsightCategories.find(cat => cat.id === currentCategory)?.name : 
    undefined;
  
  // Calculate which section of the assessment we're in
  const section = Math.floor((currentQuestionIndex / totalQuestions) * 5) + 1;
  const questionInSection = (currentQuestionIndex % (totalQuestions / 5)) + 1;
  const questionsInSection = totalQuestions / 5;
  
  return (
    <div className="w-full space-y-2">
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
          {category && <span className="ml-1">• {category}</span>}
        </div>
        
        <div className="text-sm font-medium">
          Section {section}: {questionInSection}/{questionsInSection}
        </div>
      </div>
    </div>
  );
};
