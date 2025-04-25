
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface IntelligenceScoresProps {
  intelligenceScore?: number | null;
  emotionalIntelligenceScore?: number | null;
  responsePatterns?: {
    primaryChoice?: string;
    secondaryChoice?: string;
  };
}

const IntelligenceScores: React.FC<IntelligenceScoresProps> = ({ 
  intelligenceScore = 0, 
  emotionalIntelligenceScore = 0,
  responsePatterns 
}) => {
  // Ensure we have proper values - replace nulls with defaults
  const cognitiveScore = typeof intelligenceScore === 'number' ? intelligenceScore : 70;
  const emotionalScore = typeof emotionalIntelligenceScore === 'number' ? emotionalIntelligenceScore : 70;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-950/90 to-indigo-950/90 border-blue-900/50">
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-medium text-blue-400">Cognitive Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-3xl font-bold text-center text-blue-300">
              {cognitiveScore}
            </div>
            <Progress 
              value={cognitiveScore} 
              className="h-2 bg-blue-950" 
              indicatorClassName="bg-blue-400"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-rose-950/90 to-pink-950/90 border-rose-900/50">
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-medium text-rose-400">Emotional Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-3xl font-bold text-center text-rose-300">
              {emotionalScore}
            </div>
            <Progress 
              value={emotionalScore} 
              className="h-2 bg-rose-950" 
              indicatorClassName="bg-rose-400"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-950/90 to-violet-950/90 border-purple-900/50">
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-medium text-purple-400">Response Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-purple-300">
            {responsePatterns?.primaryChoice ? (
              <span className="text-lg font-medium">
                Type {responsePatterns.primaryChoice}-{responsePatterns.secondaryChoice}
              </span>
            ) : (
              <span className="text-lg font-medium">Balanced</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceScores;
