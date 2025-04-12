
import React from "react";
import { Card } from "@/components/ui/card";

interface ComprehensiveCareerSectionProps {
  careerSuggestions: string[];
  roadmap: string;
}

const ComprehensiveCareerSection: React.FC<ComprehensiveCareerSectionProps> = ({
  careerSuggestions,
  roadmap
}) => {
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Career Insights</h2>
      
      <h3 className="text-lg font-medium mb-3">Suggested Career Paths</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {careerSuggestions?.map((career, index) => (
          <div key={index} className="border p-4 rounded-md bg-background/50 hover:bg-background/80 transition-colors">
            <p>{career}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Career Development Roadmap</h3>
        <p className="whitespace-pre-line text-muted-foreground">
          {roadmap}
        </p>
      </div>
    </Card>
  );
};

export default ComprehensiveCareerSection;
