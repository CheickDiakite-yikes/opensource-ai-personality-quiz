
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart } from "lucide-react";

interface IntelligenceScoreCardProps {
  cognitiveScore?: number;
  emotionalScore?: number;
}

// Helper function to safely round scores with proper fallbacks
const roundScore = (score: number | undefined): number => {
  if (score === undefined || score === null) {
    return 0;
  }
  return Math.round(score);
};

// Helper function to get color class based on score
const getColorClass = (score: number): string => {
  if (score >= 85) return "bg-primary";
  if (score >= 70) return "bg-blue-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-slate-400";
};

// Helper function to get textual rating based on score
const getRating = (score: number): string => {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Very Strong";
  if (score >= 70) return "Strong";
  if (score >= 60) return "Above Average";
  if (score >= 50) return "Average";
  if (score >= 40) return "Developing";
  if (score >= 30) return "Needs Attention";
  return "Foundational";
};

// Helper function to get short description based on score combination
const getDescription = (cognitive: number, emotional: number): string => {
  const total = cognitive + emotional;
  
  if (total >= 170) return "Exceptionally balanced intelligence profile";
  if (total >= 150) return "Outstanding intelligence integration";
  
  if (cognitive >= 80 && emotional >= 80) return "Highly balanced cognitive and emotional capabilities";
  if (cognitive >= 80 && emotional < 70) return "Strong analytical with developing emotional awareness";
  if (cognitive < 70 && emotional >= 80) return "Strong emotional intelligence with developing cognitive skills";
  if (cognitive >= 70 && emotional >= 70) return "Well-balanced intelligence profile";
  
  if (cognitive > emotional + 20) return "Analytical strengths predominate";
  if (emotional > cognitive + 20) return "Emotional strengths predominate";
  
  return "Balanced development across domains";
};

export const IntelligenceScoreCard: React.FC<IntelligenceScoreCardProps> = ({ 
  cognitiveScore, 
  emotionalScore 
}) => {
  // Handle undefined or null scores with default values
  const safeCogscore = roundScore(cognitiveScore);
  const safeEmotionalScore = roundScore(emotionalScore);
  
  const cognitiveRating = getRating(safeCogscore);
  const emotionalRating = getRating(safeEmotionalScore);
  const description = getDescription(safeCogscore, safeEmotionalScore);

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pb-4 pt-6 flex-1 flex flex-col">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-primary">Intelligence Profile</h3>
        </div>
        
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-1 text-blue-500" />
                <span className="text-sm">Cognitive</span>
              </div>
              <span className="text-xs font-medium">{cognitiveRating}</span>
            </div>
            <Progress value={safeCogscore} max={100} className="h-2" 
              indicatorClassName={getColorClass(safeCogscore)} />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">{safeCogscore}/100</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-rose-500" />
                <span className="text-sm">Emotional</span>
              </div>
              <span className="text-xs font-medium">{emotionalRating}</span>
            </div>
            <Progress value={safeEmotionalScore} max={100} className="h-2" 
              indicatorClassName={getColorClass(safeEmotionalScore)} />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">{safeEmotionalScore}/100</span>
            </div>
          </div>
          
          <p className="text-xs text-center pt-2 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
