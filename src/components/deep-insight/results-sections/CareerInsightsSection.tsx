
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface CareerInsightsSectionProps {
  careerInsights: {
    naturalStrengths?: string[];
    workplaceNeeds?: string[];
    leadershipStyle?: string;
    careerPathways?: (string | Record<string, string>)[];
  };
}

const CareerInsightsSection = ({ careerInsights }: CareerInsightsSectionProps) => {
  // Safely process career pathways to handle both string and object values
  const getPathwayText = (pathway: string | Record<string, string>): string => {
    if (typeof pathway === 'string') {
      return pathway;
    } else if (pathway && typeof pathway === 'object') {
      // If it's an object, convert it to a string by taking the first key/value pair
      const key = Object.keys(pathway)[0];
      return key ? `${key}: ${pathway[key]}` : "Unknown pathway";
    }
    return "Unknown pathway";
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-primary" /> Career Insights
        </CardTitle>
        <CardDescription>Professional opportunities and potential</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {careerInsights.careerPathways && careerInsights.careerPathways.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Recommended Career Paths</h3>
              <ul className="space-y-2">
                {careerInsights.careerPathways.map((path, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{getPathwayText(path)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {careerInsights.leadershipStyle && (
            <div>
              <h3 className="text-lg font-medium mb-3">Leadership Style</h3>
              <p className="text-muted-foreground">{careerInsights.leadershipStyle}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerInsightsSection;
