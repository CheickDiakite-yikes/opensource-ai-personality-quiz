import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Lightbulb, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatIntelligenceScore } from "@/utils/formatUtils";
import { Intelligence } from "@/utils/types";

interface IntelligenceSectionProps {
  intelligence: Intelligence;
  intelligenceScore?: number;
  emotionalIntelligenceScore?: number;
}

const IntelligenceSection: React.FC<IntelligenceSectionProps> = ({
  intelligence,
  intelligenceScore,
  emotionalIntelligenceScore
}) => {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pb-4">
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" /> Cognitive Intelligence
        </CardTitle>
        <CardDescription>
          Your intellectual and problem-solving strengths
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-500" /> Cognitive Intelligence Score
            </h3>
            <div className="rounded-md bg-muted p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Score</span>
                <span className="font-medium">{formatIntelligenceScore(intelligenceScore || intelligence.score)}</span>
              </div>
              <Progress value={intelligenceScore || intelligence.score} className="h-2" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-1 text-amber-500" /> Emotional Intelligence Score
            </h3>
            <div className="rounded-md bg-muted p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Score</span>
                <span className="font-medium">{formatIntelligenceScore(emotionalIntelligenceScore || 0)}</span>
              </div>
              <Progress value={emotionalIntelligenceScore || 0} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-3">Cognitive Type</h3>
            <p className="text-muted-foreground">{intelligence.type}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Description</h3>
            <p className="text-muted-foreground">{intelligence.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Cognitive Strengths</h3>
            <ul className="space-y-1">
              {intelligence.strengths?.map((strength, i) => (
                <li key={i} className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Areas for Development</h3>
            <ul className="space-y-1">
              {intelligence.areas_for_development?.map((area, i) => (
                <li key={i} className="flex items-start">
                  <div className="rounded-full border border-primary mr-3 h-5 w-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-muted-foreground">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligenceSection;
