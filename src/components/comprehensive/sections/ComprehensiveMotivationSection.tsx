
import React from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb, AlertCircle } from "lucide-react";

interface MotivatorItem {
  name?: string;
  description?: string;
}

interface ComprehensiveMotivationSectionProps {
  motivators: string[] | MotivatorItem[];
  inhibitors: string[] | MotivatorItem[];
}

const ComprehensiveMotivationSection: React.FC<ComprehensiveMotivationSectionProps> = ({
  motivators,
  inhibitors
}) => {
  // Helper function to safely render motivator/inhibitor items
  const renderItem = (item: string | MotivatorItem) => {
    if (typeof item === 'string') {
      return item;
    } else if (item && typeof item === 'object') {
      // Ensure we return a string, not an object
      return item.name || item.description || 'Unnamed item';
    }
    // Convert any other types to string
    return String(item);
  };

  // Helper function to get description if available
  const getDescription = (item: string | MotivatorItem): string | null => {
    if (typeof item === 'object' && item && item.description) {
      // Ensure we return a string, not an object
      return String(item.description);
    }
    return null;
  };

  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Motivation Analysis</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Lightbulb className="h-5 w-5 text-primary mr-2" />
            Key Motivators
          </h3>
          
          <div className="space-y-4">
            {Array.isArray(motivators) && motivators.map((motivator, index) => (
              <div key={index} className="border-l-4 border-primary pl-4 py-1">
                <p className="font-medium">
                  {renderItem(motivator)}
                </p>
                {getDescription(motivator) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {getDescription(motivator)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            Inhibiting Factors
          </h3>
          
          <div className="space-y-4">
            {Array.isArray(inhibitors) && inhibitors.map((inhibitor, index) => (
              <div key={index} className="border-l-4 border-destructive/60 pl-4 py-1">
                <p className="font-medium">
                  {renderItem(inhibitor)}
                </p>
                {getDescription(inhibitor) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {getDescription(inhibitor)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComprehensiveMotivationSection;
