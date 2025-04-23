
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IntelligenceScoresProps {
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
}

const IntelligenceScores: React.FC<IntelligenceScoresProps> = ({
  intelligenceScore,
  emotionalIntelligenceScore
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cognitive Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{intelligenceScore}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <Progress value={intelligenceScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emotional Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{emotionalIntelligenceScore}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <Progress value={emotionalIntelligenceScore} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceScores;
