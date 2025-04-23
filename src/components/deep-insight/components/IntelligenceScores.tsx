
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface IntelligenceScoresProps {
  intelligenceScore: number | undefined;
  emotionalIntelligenceScore: number | undefined;
}

const IntelligenceScores: React.FC<IntelligenceScoresProps> = ({
  intelligenceScore = 0,
  emotionalIntelligenceScore = 0
}) => {
  // Ensure we have valid numbers for display
  const cognitiveScore = typeof intelligenceScore === 'number' ? intelligenceScore : 0;
  const emotionalScore = typeof emotionalIntelligenceScore === 'number' ? emotionalIntelligenceScore : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Cognitive Intelligence</CardTitle>
          {cognitiveScore === 0 && <Info size={16} className="text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{cognitiveScore}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <Progress value={cognitiveScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Emotional Intelligence</CardTitle>
          {emotionalScore === 0 && <Info size={16} className="text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{emotionalScore}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <Progress value={emotionalScore} className="h-2" indicatorClassName={emotionalScore > 0 ? "" : "bg-muted"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceScores;
