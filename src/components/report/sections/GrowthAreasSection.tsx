
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, ArrowUpCircle, AlertTriangle } from "lucide-react";
import { safeString } from "@/utils/formatUtils";

interface GrowthAreasSectionProps {
  weaknesses: string[] | Array<{name: string, description: string}>;
  growthAreas: string[] | Array<{name: string, description: string}>;
}

const GrowthAreasSection: React.FC<GrowthAreasSectionProps> = ({ weaknesses = [], growthAreas = [] }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <span>Growth Opportunities</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Current Challenges
            </h3>
            <ul className="space-y-2 marker:text-amber-500 list-disc pl-5">
              {weaknesses?.slice(0, 5).map((item, index) => (
                <li key={index}>{safeString(item)}</li>
              ))}
            </ul>
            {(!weaknesses || weaknesses.length === 0) && (
              <p className="text-muted-foreground italic">No significant challenges identified</p>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
              Areas for Development
            </h3>
            <ul className="space-y-2 marker:text-green-500 list-disc pl-5">
              {growthAreas?.slice(0, 5).map((item, index) => (
                <li key={index}>{safeString(item)}</li>
              ))}
            </ul>
            {(!growthAreas || growthAreas.length === 0) && (
              <p className="text-muted-foreground italic">No specific growth areas identified</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthAreasSection;
