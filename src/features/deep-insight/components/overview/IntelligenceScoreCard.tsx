
import React from "react";
import { Brain } from "lucide-react";

interface IntelligenceScoreCardProps {
  cognitiveScore?: number;
  emotionalScore?: number;
}

export const IntelligenceScoreCard: React.FC<IntelligenceScoreCardProps> = ({ 
  cognitiveScore, 
  emotionalScore 
}) => {
  // Round intelligence scores to 2 decimal places, with proper null checking
  const roundScore = (score?: number) => {
    if (score === undefined || score === null) return 'N/A';
    return Number(score.toFixed(2));
  };

  return (
    <div className="bg-secondary/20 p-4 rounded-md">
      <h3 className="font-semibold mb-2 flex items-center">
        <div className="bg-primary/20 p-1.5 rounded-full mr-2">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        Intelligence Score
      </h3>
      <div className="flex justify-between">
        <span>Cognitive: {roundScore(cognitiveScore)}</span>
        <span>Emotional: {roundScore(emotionalScore)}</span>
      </div>
    </div>
  );
};
