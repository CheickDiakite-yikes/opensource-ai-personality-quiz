
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTraitScore } from "@/utils/formatUtils";
import { PersonalityTrait } from "@/utils/types";

interface ComprehensiveOverviewSectionProps {
  overview: string;
  traits: PersonalityTrait[];
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  motivators: string[];
  growthAreas: string[];
}

const ComprehensiveOverviewSection: React.FC<ComprehensiveOverviewSectionProps> = ({
  overview,
  traits,
  intelligenceScore,
  emotionalIntelligenceScore,
  motivators,
  growthAreas
}) => {
  return (
    <>
      <Card className="p-6 md:p-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Personality Overview</h2>
        <p className="mb-6">{overview}</p>
        
        {/* Key traits section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">Key Personality Traits</h3>
          <div className="flex flex-wrap gap-2">
            {traits?.slice(0, 5).map((trait, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                {trait.trait}: {formatTraitScore(trait.score)}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Intelligence scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">Intelligence Score</h4>
            <p className="text-2xl font-bold">{formatTraitScore(intelligenceScore || 0)}</p>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">Emotional Intelligence</h4>
            <p className="text-2xl font-bold">{formatTraitScore(emotionalIntelligenceScore || 0)}</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-3">Motivators</h3>
          <ul className="space-y-2">
            {motivators?.slice(0, 4).map((motivator, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{motivator}</span>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card className="p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-3">Growth Areas</h3>
          <ul className="space-y-2">
            {growthAreas?.slice(0, 4).map((area, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
};

export default ComprehensiveOverviewSection;
