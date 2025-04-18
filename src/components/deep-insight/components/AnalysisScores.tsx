
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AnalysisScoresProps {
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  responsePatterns?: {
    primaryChoice?: string;
    secondaryChoice?: string;
  };
}

const AnalysisScores = ({ 
  intelligenceScore, 
  emotionalIntelligenceScore, 
  responsePatterns 
}: AnalysisScoresProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-medium">Cognitive Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center">
            {intelligenceScore || 75}/100
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-medium">Emotional Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center">
            {emotionalIntelligenceScore || 70}/100
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-medium">Response Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {responsePatterns?.primaryChoice ? (
              <span className="text-lg font-medium capitalize">
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

export default AnalysisScores;
