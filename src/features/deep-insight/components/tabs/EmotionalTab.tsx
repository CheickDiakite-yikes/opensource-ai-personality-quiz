
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";
import { AnalysisData } from "../../utils/analysis/types";

interface EmotionalTabProps {
  analysis: PersonalityAnalysis;
}

export const EmotionalTab: React.FC<EmotionalTabProps> = ({ analysis }) => {
  // Get emotional architecture from either format
  const typedAnalysis = analysis as AnalysisData;
  const emotionalArchitecture = typedAnalysis.emotionalArchitecture || {
    emotionalAwareness: "You have a good understanding of your emotional states and can often identify the sources of your feelings.",
    regulationStyle: "You manage emotions through a balanced approach, using both cognitive strategies and healthy expression.",
    empathicCapacity: "You connect well with others' emotions and can offer meaningful support while maintaining healthy boundaries."
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Emotional Architecture
        </CardTitle>
        <CardDescription>How you experience and manage emotions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-lg">Emotional Awareness</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.emotionalAwareness}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Regulation Style</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.regulationStyle}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Empathic Capacity</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.empathicCapacity}</p>
        </div>
      </CardContent>
    </Card>
  );
};
