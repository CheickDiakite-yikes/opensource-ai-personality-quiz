
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
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Development Areas</h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.growthPotential.developmentAreas.map((area: string, i: number) => (
              <li key={i}>{area}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.growthPotential.recommendations.map((rec: string, i: number) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
