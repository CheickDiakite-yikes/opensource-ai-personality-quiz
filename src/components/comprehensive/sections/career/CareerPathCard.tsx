
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CareerPathway } from "@/utils/types";
import { Lightbulb, TrendingUp, BarChart3, GraduationCap } from "lucide-react";

interface CareerPathCardProps {
  career: CareerPathway;
  index: number;
}

const CareerPathCard: React.FC<CareerPathCardProps> = ({ career, index }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted/30 p-4 border-b">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center rounded-full bg-primary/10 h-8 w-8 text-sm text-primary font-medium mt-0.5 flex-shrink-0">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-medium">{career.title || career.field || "Career Path"}</h3>
            {career.field && career.title && career.field !== career.title && (
              <p className="text-sm text-muted-foreground mt-0.5">Field: {career.field}</p>
            )}
          </div>
        </div>
      </div>
                
      <div className="p-4 space-y-4">
        {career.description && (
          <p className="text-sm">{typeof career.description === 'string' ? career.description : String(career.description)}</p>
        )}
                  
        {career.alignment && (
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Alignment</p>
              <p className="text-sm text-muted-foreground">{typeof career.alignment === 'string' ? career.alignment : String(career.alignment)}</p>
            </div>
          </div>
        )}
                  
        {(career.keyTraits && career.keyTraits.length > 0) && (
          <div className="flex items-start gap-2">
            <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Key Traits</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {career.keyTraits.map((trait, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {typeof trait === 'string' ? trait : String(trait)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
                  
        {(career.traits && career.traits.length > 0 && !career.keyTraits) && (
          <div className="flex items-start gap-2">
            <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Key Traits</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {career.traits.map((trait, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {typeof trait === 'string' ? trait : String(trait)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
                  
        {career.growth && (
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Growth Potential</p>
              <p className="text-sm text-muted-foreground">{typeof career.growth === 'string' ? career.growth : String(career.growth)}</p>
            </div>
          </div>
        )}
                  
        {(career.skills && career.skills.length > 0) && (
          <div className="flex items-start gap-2">
            <GraduationCap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Skills to Develop</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {career.skills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {typeof skill === 'string' ? skill : String(skill)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPathCard;
