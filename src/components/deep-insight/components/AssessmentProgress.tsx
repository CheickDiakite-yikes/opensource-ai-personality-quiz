
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AssessmentProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
  category: string;
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
  progress,
  category,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span className="font-medium">{Math.round(progress)}% Complete</span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex flex-wrap gap-2 mt-3">
        <Badge variant="outline" className="bg-primary/10">
          {category}
        </Badge>
      </div>
    </div>
  );
};

export default AssessmentProgress;
