
import React from "react";

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({ 
  currentQuestionIndex, 
  totalQuestions 
}) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="w-full">
      <div className="w-full bg-muted rounded-full h-2.5 mb-2">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all" 
          style={{ width: `${progress}%` }}
        />
        <div className="text-sm text-muted-foreground text-right">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>
    </div>
  );
};
