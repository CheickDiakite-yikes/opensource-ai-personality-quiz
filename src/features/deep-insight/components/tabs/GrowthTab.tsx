
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";

interface GrowthTabProps {
  analysis: PersonalityAnalysis;
}

export const GrowthTab: React.FC<GrowthTabProps> = ({ analysis }) => {
  // Ensure growthPotential exists and has valid arrays
  const growthPotential = analysis.growthPotential || {
    developmentAreas: [
      "Self-Awareness: Deepening understanding of emotional triggers",
      "Communication: Expressing needs more directly",
      "Balance: Finding equilibrium between work and rest"
    ],
    recommendations: [
      "Practice mindfulness meditation for 10 minutes daily",
      "Seek feedback from trusted colleagues on communication style",
      "Establish clear boundaries between work and personal time"
    ]
  };

  // Ensure developmentAreas and recommendations are arrays
  const developmentAreas = Array.isArray(growthPotential.developmentAreas)
    ? growthPotential.developmentAreas
    : typeof growthPotential.developmentAreas === 'string'
      ? [growthPotential.developmentAreas] // Convert single string to array
      : [
          "Self-Awareness: Deepening understanding of emotional triggers",
          "Communication: Expressing needs more directly",
          "Balance: Finding equilibrium between work and rest"
        ];

  const recommendations = Array.isArray(growthPotential.recommendations)
    ? growthPotential.recommendations
    : typeof growthPotential.recommendations === 'string'
      ? [growthPotential.recommendations] // Convert single string to array
      : [
          "Practice mindfulness meditation for 10 minutes daily",
          "Seek feedback from trusted colleagues on communication style",
          "Establish clear boundaries between work and personal time"
        ];

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
            {developmentAreas.map((area: string, i: number) => (
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
            {recommendations.map((rec: string, i: number) => (
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
