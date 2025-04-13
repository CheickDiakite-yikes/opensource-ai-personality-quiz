
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { ValueSystemType, CareerPathway } from "@/utils/types";
import CareerSuggestions from "../CareerSuggestions";

interface CareerValuesSectionProps {
  careerSuggestions: string[] | CareerPathway[];
  valueSystem: ValueSystemType;
}

const CareerValuesSection: React.FC<CareerValuesSectionProps> = ({ 
  careerSuggestions,
  valueSystem
}) => {
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
            where you're likely to find both fulfillment and success.
          </p>
          
          <CareerSuggestions careers={careerSuggestions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerValuesSection;
