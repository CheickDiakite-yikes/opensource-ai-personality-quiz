
import React from "react";
import { Progress } from "@/components/ui/progress";

interface BigMeProgressProps {
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
}

const BigMeProgress: React.FC<BigMeProgressProps> = ({
  progress,
  currentQuestion,
  totalQuestions,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default BigMeProgress;
