
import React from "react";
import { Card } from "@/components/ui/card";
import { IntelligenceType } from "@/utils/types";
import { formatTraitScore } from "@/utils/formatUtils";

interface ComprehensiveIntelligenceSectionProps {
  intelligence: IntelligenceType;
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
}

const ComprehensiveIntelligenceSection: React.FC<ComprehensiveIntelligenceSectionProps> = ({
  intelligence,
  intelligenceScore,
  emotionalIntelligenceScore
}) => {
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Intelligence Profile</h2>
      <div className="flex gap-6 flex-col md:flex-row">
        <div className="md:w-1/3">
          <h3 className="text-lg font-medium mb-3">{intelligence?.type}</h3>
          <p className="text-muted-foreground mb-4">{intelligence?.description}</p>
          
          <div className="space-y-4 mt-6">
            <div>
              <h4 className="font-medium">Intelligence Score</h4>
              <p className="text-2xl font-bold">{formatTraitScore(intelligenceScore || 0)}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Emotional Intelligence</h4>
              <p className="text-2xl font-bold">{formatTraitScore(emotionalIntelligenceScore || 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
          <h3 className="text-lg font-medium mb-4">Intelligence Domains</h3>
          <div className="space-y-4">
            {intelligence?.domains?.map((domain, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{domain.name}</h4>
                  <span className="text-sm font-semibold">{formatTraitScore(domain.score || 0, 'number')}/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(domain.score <= 10 ? domain.score : domain.score / 10) * 10}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComprehensiveIntelligenceSection;
