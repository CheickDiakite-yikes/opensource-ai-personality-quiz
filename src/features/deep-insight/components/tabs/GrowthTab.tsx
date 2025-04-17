
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { AnalysisData } from "../../utils/analysis/types";

interface GrowthTabProps {
  analysis: AnalysisData;
}

export const GrowthTab: React.FC<GrowthTabProps> = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          Growth Potential
        </CardTitle>
        <CardDescription>Areas for development and personal evolution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Development Areas</h3>
          <ul className="list-disc list-inside space-y-2">
            {analysis.growthPotential.developmentAreas.map((area: string, i: number) => (
              <li key={i} className="text-muted-foreground leading-relaxed pl-2">
                <span className="text-foreground font-medium">{area.split(':')[0]}:</span>{' '}
                {area.split(':').slice(1).join(':')}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Recommendations</h3>
          <ul className="list-disc list-inside space-y-2">
            {analysis.growthPotential.recommendations.map((rec: string, i: number) => (
              <li key={i} className="text-muted-foreground leading-relaxed pl-2">
                <span className="text-foreground font-medium">{i + 1}.</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
