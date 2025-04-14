
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PersonalityTrait } from "@/utils/types";
import { formatTraitScore } from "@/utils/formatUtils";

interface ComprehensiveTraitsSectionProps {
  traits: PersonalityTrait[];
}

const ComprehensiveTraitsSection: React.FC<ComprehensiveTraitsSectionProps> = ({ traits }) => {
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Personality Traits</h2>
      <div className="space-y-6">
        {traits?.map((trait, index) => (
          <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">{trait.name || trait.trait}</h3>
              <Badge variant={trait.score > 7 ? "default" : "outline"} className="px-3 py-1">
                {formatTraitScore(trait.score)}
              </Badge>
            </div>
            <p className="mb-4 text-muted-foreground">{trait.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                <ul className="space-y-1 text-sm">
                  {trait.strengths?.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="flex gap-2">
                      <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Growth Suggestions</h4>
                <ul className="space-y-1 text-sm">
                  {trait.growthSuggestions?.slice(0, 2).map((suggestion, idx) => (
                    <li key={idx} className="flex gap-2">
                      <div className="h-4 w-4 rounded-full border border-primary shrink-0 mt-0.5"></div>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ComprehensiveTraitsSection;
