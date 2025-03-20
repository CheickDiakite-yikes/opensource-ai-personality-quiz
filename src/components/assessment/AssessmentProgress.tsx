
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  completedQuestions: number[];
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentQuestion,
  totalQuestions,
  completedQuestions,
}) => {
  const progress = ((completedQuestions.length) / totalQuestions) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center text-sm mb-2">
        <span>Question {currentQuestion + 1} of {totalQuestions}</span>
        <Badge variant="outline" className="bg-primary/5">
          {Math.round(progress)}% complete
          {progress >= 100 && <CheckCircle2 className="ml-1 h-3 w-3 text-green-500" />}
        </Badge>
      </div>
      <Progress value={progress} className="h-2" />
      
      <motion.div 
        className="mt-4 flex justify-center gap-1 overflow-hidden flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Array.from({ length: totalQuestions }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              backgroundColor: completedQuestions.includes(i)
                ? 'hsla(var(--primary) / 0.7)'
                : i === currentQuestion
                ? 'hsla(var(--primary) / 0.3)'
                : 'hsla(var(--primary) / 0.1)'
            }}
            transition={{ 
              duration: 0.2,
              delay: i * 0.01 
            }}
            className={`h-1.5 w-1.5 rounded-full`}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AssessmentProgress;
