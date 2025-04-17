
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Compass, Lightbulb } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";

interface GrowthTabProps {
  analysis: PersonalityAnalysis;
}

export const GrowthTab: React.FC<GrowthTabProps> = ({ analysis }) => {
  // Ensure growthPotential exists with enhanced fallback data
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
    ],
    longTermGoals: [
      "Develop deeper emotional resilience",
      "Build more authentic connections with others",
      "Create sustainable work-life integration"
    ],
    personalInsights: "Your growth journey is uniquely yours, with patterns that reflect your individual experiences and aspirations."
  };

  // Ensure developmentAreas is an array
  const developmentAreas = Array.isArray(growthPotential.developmentAreas)
    ? growthPotential.developmentAreas
    : typeof growthPotential.developmentAreas === 'string'
      ? [growthPotential.developmentAreas] // Convert single string to array
      : [
          "Self-Awareness: Deepening understanding of emotional triggers",
          "Communication: Expressing needs more directly",
          "Balance: Finding equilibrium between work and rest"
        ];

  // Ensure recommendations is an array
  const recommendations = Array.isArray(growthPotential.recommendations)
    ? growthPotential.recommendations
    : typeof growthPotential.recommendations === 'string'
      ? [growthPotential.recommendations] // Convert single string to array
      : [
          "Practice mindfulness meditation for 10 minutes daily",
          "Seek feedback from trusted colleagues on communication style",
          "Establish clear boundaries between work and personal time"
        ];

  // Extract long term goals if available
  const longTermGoals = Array.isArray(growthPotential.longTermGoals)
    ? growthPotential.longTermGoals
    : [];
    
  // Extract personal insights if available
  const personalInsights = typeof growthPotential.personalInsights === 'string'
    ? growthPotential.personalInsights
    : "";

  // Process development areas to ensure they have the correct format (with colon separator)
  const processedDevelopmentAreas = developmentAreas.map(area => {
    if (typeof area !== 'string') return "Development Area: Details not available";
    if (area.includes(':')) return area;
    return `Area: ${area}`;
  });

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
            {processedDevelopmentAreas.map((area: string, i: number) => (
              <li key={i} className="text-muted-foreground leading-relaxed pl-2">
                {area.includes(':') ? (
                  <>
                    <span className="text-foreground font-medium">{area.split(':')[0]}:</span>
                    {area.split(':').slice(1).join(':')}
                  </>
                ) : area}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Recommendations</h3>
          <ul className="list-disc list-inside space-y-2">
            {recommendations.map((rec: string, i: number) => (
              <li key={i} className="text-muted-foreground leading-relaxed pl-2">
                <span className="text-foreground font-medium">{i + 1}.</span> {rec}
              </li>
            ))}
          </ul>
        </div>
        
        {longTermGoals.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-lg flex items-center">
              <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
              Long-Term Growth Goals
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {longTermGoals.map((goal: string, i: number) => (
                <li key={i} className="text-muted-foreground leading-relaxed pl-2">{goal}</li>
              ))}
            </ul>
          </div>
        )}
        
        {personalInsights && (
          <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
            <h3 className="font-medium mb-2 text-sm uppercase text-muted-foreground">Personal Growth Insight</h3>
            <p className="italic">{personalInsights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
