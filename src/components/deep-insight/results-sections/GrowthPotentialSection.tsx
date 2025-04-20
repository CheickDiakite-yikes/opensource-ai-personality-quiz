
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrowthPotential } from "../types/deepInsight";
import { Lightbulb, Target } from "lucide-react";

interface GrowthPotentialProps {
  data: GrowthPotential | null;
}

const GrowthPotentialSection: React.FC<GrowthPotentialProps> = ({ data }) => {
  const defaultData = {
    developmentAreas: [
      "Finding balance between analysis and action", 
      "Developing comfort with ambiguity", 
      "Building resilience to setbacks",
      "Enhancing adaptability in changing environments",
      "Cultivating proactive learning mindset"
    ],
    recommendations: [
      "Practice time-bounded decision making",
      "Engage in mindfulness to reduce overthinking", 
      "Seek diverse perspectives through mentorship",
      "Develop systematic approach to personal growth",
      "Create iterative learning and feedback loops"
    ]
  };
  
  const growthData = data || defaultData;
  
  // Ensure arrays are properly handled with robust fallback
  const safeDevelopmentAreas = Array.isArray(growthData.developmentAreas)
    ? growthData.developmentAreas.filter(item => typeof item === 'string')
    : defaultData.developmentAreas;
    
  const safeRecommendations = Array.isArray(growthData.recommendations)
    ? growthData.recommendations.filter(item => typeof item === 'string')
    : defaultData.recommendations;
  
  return (
    <div className="space-y-6">
      <Card className="border-violet-200 dark:border-violet-900">
        <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
          <CardTitle className="text-violet-700 dark:text-violet-400 flex items-center">
            <Target className="h-5 w-5 mr-2" /> Development Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {safeDevelopmentAreas.slice(0, 5).map((area, index) => (
              <li key={index} className="text-muted-foreground">
                {area}
              </li>
            ))}
          </ul>
          {safeDevelopmentAreas.length === 0 && (
            <p className="text-muted-foreground italic text-center">
              No specific development areas identified
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-lime-200 dark:border-lime-900">
        <CardHeader className="bg-lime-50 dark:bg-lime-900/20">
          <CardTitle className="text-lime-700 dark:text-lime-400 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" /> Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {safeRecommendations.slice(0, 5).map((recommendation, index) => (
              <li key={index} className="text-muted-foreground">
                {recommendation}
              </li>
            ))}
          </ul>
          {safeRecommendations.length === 0 && (
            <p className="text-muted-foreground italic text-center">
              No specific recommendations available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthPotentialSection;
