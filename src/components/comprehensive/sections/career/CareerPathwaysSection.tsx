
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { CareerPathway } from "@/utils/types";
import CareerPathCard from './CareerPathCard';

interface CareerPathwaysSectionProps {
  careerPaths: CareerPathway[];
}

const CareerPathwaysSection: React.FC<CareerPathwaysSectionProps> = ({ careerPaths }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Career Pathways
        </CardTitle>
        <CardDescription>
          Professional directions aligned with your personality profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {careerPaths.map((career, index) => (
            <CareerPathCard key={index} career={career} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerPathwaysSection;
