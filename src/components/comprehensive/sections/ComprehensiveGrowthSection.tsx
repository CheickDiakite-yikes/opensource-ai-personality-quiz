
import React from "react";
import { Card } from "@/components/ui/card";
import { safeString } from "@/utils/formatUtils";

interface ComprehensiveGrowthSectionProps {
  growthAreas: string[];
  weaknesses: string[];
  learningPathways: string[];
}

const ComprehensiveGrowthSection: React.FC<ComprehensiveGrowthSectionProps> = ({
  growthAreas,
  weaknesses,
  learningPathways
}) => {
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Growth Areas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Areas for Development</h3>
          <ul className="space-y-3">
            {growthAreas?.map((area, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{safeString(area)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Current Weaknesses</h3>
          <ul className="space-y-3">
            {weaknesses?.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{safeString(weakness)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Learning Pathways</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {learningPathways?.slice(0, 6).map((pathway, index) => (
            <div key={index} className="bg-muted/50 p-3 rounded-md">
              <p>{safeString(pathway)}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ComprehensiveGrowthSection;
