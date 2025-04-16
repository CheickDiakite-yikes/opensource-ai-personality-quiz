
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { AnalysisData } from "../../utils/analysis/types";

interface CognitiveTabProps {
  analysis: AnalysisData;
}

export const CognitiveTab: React.FC<CognitiveTabProps> = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Cognitive Patterning
        </CardTitle>
        <CardDescription>How you process information and make decisions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Decision Making Style</h3>
          <p>{analysis.cognitivePatterning.decisionMaking}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Learning Approach</h3>
          <p>{analysis.cognitivePatterning.learningStyle}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Attention Pattern</h3>
          <p>{analysis.cognitivePatterning.attention}</p>
        </div>
      </CardContent>
    </Card>
  );
};
