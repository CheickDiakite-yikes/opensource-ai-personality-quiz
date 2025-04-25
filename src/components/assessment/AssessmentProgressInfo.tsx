
import React from "react";
import { QuestionCategory } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BarChart2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface AssessmentProgressInfoProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  categoryProgress: Record<QuestionCategory, number>;
  completedQuestionsCount: number;
}

const AssessmentProgressInfo: React.FC<AssessmentProgressInfoProps> = ({
  currentQuestionIndex,
  totalQuestions,
  categoryProgress,
  completedQuestionsCount,
}) => {
  const calculateOverallProgress = () => {
    return (completedQuestionsCount / totalQuestions) * 100;
  };
  
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <BarChart2 className="h-4 w-4 mr-1" />
              <span>Progress</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-80 p-4">
            <h4 className="font-medium mb-2">Category Progress</h4>
            <div className="space-y-3">
              {Object.entries(categoryProgress).map(([category, progress]) => (
                <div key={category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{category}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Overall Completion</span>
                <span>{Math.round(calculateOverallProgress())}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${calculateOverallProgress()}%` }}
                />
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AssessmentProgressInfo;
