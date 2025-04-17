
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { AnalysisData } from "../../utils/analysis/types";

interface EmotionalTabProps {
  analysis: AnalysisData;
}

export const EmotionalTab: React.FC<EmotionalTabProps> = ({ analysis }) => {
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
          <p className="text-muted-foreground leading-relaxed">{analysis.emotionalArchitecture.emotionalAwareness}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Regulation Style</h3>
          <p className="text-muted-foreground leading-relaxed">{analysis.emotionalArchitecture.regulationStyle}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Empathic Capacity</h3>
          <p className="text-muted-foreground leading-relaxed">{analysis.emotionalArchitecture.empathicCapacity}</p>
        </div>
      </CardContent>
    </Card>
  );
};
