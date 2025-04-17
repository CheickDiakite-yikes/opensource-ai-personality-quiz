
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { AnalysisData } from "../../utils/analysis/types";

interface CognitiveTabProps {
  analysis: AnalysisData;
}

export const CognitiveTab: React.FC<CognitiveTabProps> = ({ analysis }) => {
  // Ensure cognitivePatterning exists or provide default values
  const cognitivePatterning = analysis.cognitivePatterning || {
    decisionMaking: "Your decision-making style information is not available.",
    learningStyle: "Your learning style information is not available.",
    attention: "Your attention pattern information is not available."
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Brain className="h-6 w-6 text-primary" />
          Cognitive Patterning
        </CardTitle>
        <CardDescription className="text-base">How you process information and make decisions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-semibold mb-4 text-xl text-primary/90">Decision Making Style</h3>
          <p className="text-muted-foreground leading-relaxed text-base">{cognitivePatterning.decisionMaking}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-xl text-primary/90">Learning Approach</h3>
          <p className="text-muted-foreground leading-relaxed text-base">{cognitivePatterning.learningStyle}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-xl text-primary/90">Attention Pattern</h3>
          <p className="text-muted-foreground leading-relaxed text-base">{cognitivePatterning.attention}</p>
        </div>
      </CardContent>
    </Card>
  );
};
