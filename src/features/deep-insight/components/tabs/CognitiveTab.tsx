
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisData } from "../../utils/analysis/types";

interface CognitiveTabProps {
  analysis: AnalysisData;
}

export const CognitiveTab: React.FC<CognitiveTabProps> = ({ analysis }) => {
  // Ensure we have valid data structures
  const cognitivePatterning = analysis.cognitivePatterning || {
    decisionMaking: "You exhibit a balanced approach to decision making.",
    learningStyle: "You demonstrate a versatile learning approach.",
    attention: "You show adaptive attention patterns."
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Decision Making Style</h3>
          <p className="text-muted-foreground">
            {cognitivePatterning.decisionMaking || "You exhibit a balanced approach to decision making, weighing both logical analysis and intuitive factors when evaluating options."}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Learning Style</h3>
          <p className="text-muted-foreground">
            {cognitivePatterning.learningStyle || "You demonstrate a versatile learning approach, adapting your method based on the subject matter and context."}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Attention Patterns</h3>
          <p className="text-muted-foreground">
            {cognitivePatterning.attention || "You show adaptive attention patterns, with the ability to focus deeply on subjects of interest while remaining aware of your surroundings."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
