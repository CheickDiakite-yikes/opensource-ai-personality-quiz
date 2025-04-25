
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, XCircle } from "lucide-react";

interface MotivationSectionProps {
  motivators?: (string | Record<string, string>)[];
  inhibitors?: (string | Record<string, string>)[];
}

const MotivationSection = ({ motivators, inhibitors }: MotivationSectionProps) => {
  // Helper function to safely get text from string or object
  const getText = (item: string | Record<string, string>): string => {
    if (typeof item === 'string') {
      return item;
    } else if (item && typeof item === 'object') {
      const key = Object.keys(item)[0];
      return key ? `${key}: ${item[key]}` : "Unknown item";
    }
    return "Unknown item";
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <CardTitle className="flex items-center">
          <Flame className="h-5 w-5 mr-2 text-primary" /> Motivation Profile
        </CardTitle>
        <CardDescription>Key drivers and potential blockers</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Flame className="h-4 w-4 mr-2 text-orange-500" /> Primary Motivators
            </h3>
            <ul className="space-y-2">
              {motivators?.map((motivator, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-orange-500/10 h-6 w-6 text-sm text-orange-600 mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{getText(motivator)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <XCircle className="h-4 w-4 mr-2 text-red-500" /> Potential Inhibitors
            </h3>
            <ul className="space-y-2">
              {inhibitors?.map((inhibitor, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-red-500/10 h-6 w-6 text-sm text-red-600 mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{getText(inhibitor)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationSection;
