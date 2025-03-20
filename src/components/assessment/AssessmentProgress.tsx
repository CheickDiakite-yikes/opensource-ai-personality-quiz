
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { QuestionCategory } from "@/utils/types";

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  completedQuestions: number[];
  currentCategory?: QuestionCategory;
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentQuestion,
  totalQuestions,
  completedQuestions,
  currentCategory,
}) => {
  const progress = ((completedQuestions.length) / totalQuestions) * 100;
  
  // Category color mapping
  const getCategoryColor = (category?: QuestionCategory): string => {
    if (!category) return "bg-primary/40";
    
    const categoryColors: Record<QuestionCategory, string> = {
      [QuestionCategory.PersonalityTraits]: "bg-blue-500/40",
      [QuestionCategory.EmotionalIntelligence]: "bg-pink-500/40",
      [QuestionCategory.CognitivePatterns]: "bg-purple-500/40",
      [QuestionCategory.ValueSystems]: "bg-amber-500/40",
      [QuestionCategory.Motivation]: "bg-green-500/40",
      [QuestionCategory.Resilience]: "bg-cyan-500/40",
      [QuestionCategory.SocialInteraction]: "bg-indigo-500/40",
      [QuestionCategory.DecisionMaking]: "bg-orange-500/40",
      [QuestionCategory.Creativity]: "bg-violet-500/40",
      [QuestionCategory.Leadership]: "bg-red-500/40",
    };
    
    return categoryColors[category];
  };

  // Format category name for display
  const formatCategoryName = (category?: QuestionCategory): string => {
    if (!category) return "";
    
    // Add spaces before capital letters and capitalize first letter
    return category
      .replace(/([A-Z])/g, ' $1')
      .trim();
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-sm mb-2">
        {currentCategory && (
          <Badge variant="outline" className={`${getCategoryColor(currentCategory)} text-xs font-normal py-0.5`}>
            {formatCategoryName(currentCategory)}
          </Badge>
        )}
        
        <Badge variant="outline" className="bg-primary/5 ml-auto">
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
        {Array.from({ length: totalQuestions }, (_, i) => {
          const question = i < totalQuestions ? { id: i + 1 } : null;
          const isCompleted = completedQuestions.includes(i);
          const isCurrent = i === currentQuestion;
          
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                backgroundColor: isCompleted
                  ? 'rgba(var(--primary-rgb), 0.7)'
                  : isCurrent
                  ? 'rgba(var(--primary-rgb), 0.4)'
                  : 'rgba(var(--primary-rgb), 0.1)'
              }}
              transition={{ 
                duration: 0.2,
                delay: i * 0.01 
              }}
              className={`h-1.5 w-1.5 rounded-full`}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default AssessmentProgress;
