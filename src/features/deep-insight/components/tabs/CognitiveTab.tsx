
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Cognitive Patterning
        </CardTitle>
        <CardDescription>How you process information and make decisions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-lg">Decision Making Style</h3>
          <p className="text-muted-foreground leading-relaxed">{cognitivePatterning.decisionMaking}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Learning Approach</h3>
          <p className="text-muted-foreground leading-relaxed">{cognitivePatterning.learningStyle}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Attention Pattern</h3>
          <p className="text-muted-foreground leading-relaxed">{cognitivePatterning.attention}</p>
        </div>
      </CardContent>
    </Card>
  );
};
