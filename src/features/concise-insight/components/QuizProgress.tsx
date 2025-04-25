
import React from "react";
import { ConciseInsightCategory } from "../types";
import { Progress } from "@/components/ui/progress";
import { Brain, HeartHandshake, Users, Lightbulb, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentCategory?: ConciseInsightCategory;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentCategory
}) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          {currentCategory && (
            <span className="bg-muted px-2 py-1 rounded-full text-xs">
              {currentCategory}
            </span>
          )}
        </div>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex justify-between">
        <CategoryIcon
          category="core_traits" 
          isActive={currentCategory === "core_traits"}
          label="Core Traits"
          icon={<Star className="h-4 w-4" />}
        />
        <CategoryIcon
          category="emotional" 
          isActive={currentCategory === "emotional"}
          label="Emotional"
          icon={<HeartHandshake className="h-4 w-4" />}
        />
        <CategoryIcon
          category="cognitive" 
          isActive={currentCategory === "cognitive"}
          label="Cognitive"
          icon={<Brain className="h-4 w-4" />}
        />
        <CategoryIcon
          category="social" 
          isActive={currentCategory === "social"}
          label="Social"
          icon={<Users className="h-4 w-4" />}
        />
        <CategoryIcon
          category="values" 
          isActive={currentCategory === "values"}
          label="Values"
          icon={<Lightbulb className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

interface CategoryIconProps {
  category: ConciseInsightCategory;
  isActive: boolean;
  label: string;
  icon: React.ReactNode;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, isActive, label, icon }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "flex items-center justify-center rounded-full p-2",
          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};
