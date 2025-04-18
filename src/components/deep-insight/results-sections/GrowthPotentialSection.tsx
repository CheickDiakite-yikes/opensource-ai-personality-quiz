
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GrowthPotentialProps {
  data: {
    developmentAreas: string[];
    recommendations: string[];
  } | null;
}

const GrowthPotentialSection: React.FC<GrowthPotentialProps> = ({ data }) => {
  const defaultData = {
    developmentAreas: ["Finding balance between analysis and action", "Developing comfort with ambiguity", "Building resilience to setbacks"],
    recommendations: ["Practice time-bounded decision making", "Engage in mindfulness to reduce overthinking", "Seek feedback from diverse perspectives"]
  };
  
  const growthData = data || defaultData;
  
  return (
    <div className="space-y-6">
      <Card className="border-violet-200 dark:border-violet-900">
        <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
          <CardTitle className="text-violet-700 dark:text-violet-400">Development Areas</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {growthData.developmentAreas.map((area, index) => (
              <li key={index} className="text-muted-foreground">{area}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-lime-200 dark:border-lime-900">
        <CardHeader className="bg-lime-50 dark:bg-lime-900/20">
          <CardTitle className="text-lime-700 dark:text-lime-400">Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {growthData.recommendations.map((recommendation, index) => (
              <li key={index} className="text-muted-foreground">{recommendation}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthPotentialSection;
