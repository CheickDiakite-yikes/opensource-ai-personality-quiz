
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Minus } from "lucide-react";
import { safeString } from "@/utils/formatUtils";

interface MotivationSectionProps {
  motivators: string[] | Array<{name: string, description: string}>;
  inhibitors: string[] | Array<{name: string, description: string}>;
}

const MotivationSection: React.FC<MotivationSectionProps> = ({ motivators, inhibitors }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          <span>Motivation Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Key Motivators</h3>
            <ul className="space-y-2 marker:text-primary list-disc pl-5">
              {motivators?.slice(0, 5).map((item, index) => (
                <li key={index}>{safeString(item)}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Inhibitors</h3>
            <ul className="space-y-2 marker:text-red-500 list-disc pl-5">
              {inhibitors?.slice(0, 5).map((item, index) => (
                <li key={index}>{safeString(item)}</li>
              ))}
            </ul>
            {(!inhibitors || inhibitors.length === 0) && (
              <div className="flex items-center justify-center text-muted-foreground h-20">
                <span className="flex items-center gap-2">
                  <Minus className="h-4 w-4" />
                  <span>No inhibitors identified</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationSection;
