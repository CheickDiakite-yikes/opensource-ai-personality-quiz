
import React from "react";
import { Card } from "@/components/ui/card";
import { safeString, ensureStringItems, StringOrObject } from "@/utils/formatUtils";

interface MotivatorItem {
  name: string;
  description: string;
}

interface ComprehensiveMotivationSectionProps {
  motivators: Array<StringOrObject>;
  inhibitors: Array<StringOrObject>;
}

const ComprehensiveMotivationSection: React.FC<ComprehensiveMotivationSectionProps> = ({
  motivators = [],
  inhibitors = []
}) => {
  // Convert any object items to strings
  const safeMotivators = ensureStringItems(motivators);
  const safeInhibitors = ensureStringItems(inhibitors);
  
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Motivation Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Key Motivators</h3>
          <ul className="space-y-3">
            {safeMotivators.map((motivator, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 h-6 w-6 text-sm text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{motivator}</span>
              </li>
            ))}
            {safeMotivators.length === 0 && (
              <li className="text-muted-foreground italic">No key motivators identified</li>
            )}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Inhibitors</h3>
          <ul className="space-y-3">
            {safeInhibitors.map((inhibitor, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 h-6 w-6 text-sm text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{inhibitor}</span>
              </li>
            ))}
            {safeInhibitors.length === 0 && (
              <li className="text-muted-foreground italic">No inhibitors identified</li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ComprehensiveMotivationSection;
