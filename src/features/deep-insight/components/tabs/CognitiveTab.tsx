
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Zap, BookOpen, Focus } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";

interface CognitiveTabProps {
  analysis: PersonalityAnalysis;
}

export const CognitiveTab: React.FC<CognitiveTabProps> = ({ analysis }) => {
  const cognitivePatterning = analysis.cognitivePatterning || {
    decisionMaking: "You tend to balance analytical thinking with intuitive insights when making decisions.",
    learningStyle: "You absorb information best through a mix of practical examples and theoretical concepts.",
    attention: "Your focus is adaptable, allowing you to switch between deep concentration and broader awareness."
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Cognitive Patterning
        </CardTitle>
        <CardDescription>How you process information and make decisions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-lg">Decision Making Style</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{cognitivePatterning.decisionMaking}</p>
        </div>
        
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Learning Approach</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{cognitivePatterning.learningStyle}</p>
        </div>
        
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Focus className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-lg">Attention Pattern</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{cognitivePatterning.attention}</p>
        </div>
      </CardContent>
    </Card>
  );
};
