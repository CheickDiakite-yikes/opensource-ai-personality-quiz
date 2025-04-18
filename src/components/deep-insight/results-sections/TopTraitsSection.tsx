
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stars } from "lucide-react";

interface TopTraitsSectionProps {
  coreTraits?: {
    primary?: string;
    secondary?: string;
    tertiaryTraits?: string[];
  };
}

const TopTraitsSection = ({ coreTraits }: TopTraitsSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardTitle className="flex items-center">
          <Stars className="h-5 w-5 mr-2 text-primary" /> Top Personality Traits
        </CardTitle>
        <CardDescription>Your most distinctive characteristics</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {coreTraits?.primary && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Primary Trait</h3>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              {coreTraits.primary}
            </div>
          </div>
        )}
        
        {coreTraits?.tertiaryTraits && coreTraits.tertiaryTraits.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Key Characteristics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {coreTraits.tertiaryTraits.slice(0, 10).map((trait, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-md border border-border/40 bg-card/30"
                >
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3">
                    {index + 1}
                  </span>
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopTraitsSection;
