
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { ValueSystemType, CareerPathway } from "@/utils/types";
import CareerSuggestions from "@/components/report/CareerSuggestions";

interface CareerValuesSectionProps {
  careerSuggestions: string[] | CareerPathway[];
  valueSystem: ValueSystemType;
}

const CareerValuesSection: React.FC<CareerValuesSectionProps> = ({ 
  careerSuggestions,
  valueSystem
}) => {
  // Process value system to handle both string[] and object formats
  let valuesList: React.ReactNode = null;
  
  if (valueSystem) {
    if (Array.isArray(valueSystem)) {
      // Handle array of strings
      valuesList = (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3">Core Values That Drive Career Decisions</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {valueSystem.map((value, i) => (
              <li key={i} className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>{typeof value === 'string' ? value : String(value)}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (valueSystem && typeof valueSystem === 'object') {
      // Handle object with strengths
      valuesList = (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-3">Core Values That Drive Career Decisions</h3>
          {valueSystem.strengths && Array.isArray(valueSystem.strengths) && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {valueSystem.strengths.map((value, i) => (
                <li key={i} className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>{typeof value === 'string' ? value : String(value)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-xl flex items-center gap-2 relative z-20">
            <Briefcase className="h-5 w-5 text-primary" /> 
            Career & Values
          </CardTitle>
          <CardDescription>
            Exploring potential career paths aligned with your personality profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-8">
            Your career suggestions are derived from analyzing your personality traits,
            cognitive patterns, and value system. These recommendations highlight paths 
            where you're likely to find both fulfillment and success based on your unique
            combination of strengths, interests, and core values.
          </p>
          
          {valuesList}
          
          <CareerSuggestions careers={careerSuggestions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerValuesSection;
