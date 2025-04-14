
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { safeString, ensureStringItems, StringOrObject } from "@/utils/formatUtils";

interface CareerValuesSectionProps {
  careerSuggestions: StringOrObject[];
  valueSystem: StringOrObject[] | any;
}

const CareerValuesSection: React.FC<CareerValuesSectionProps> = ({ careerSuggestions = [], valueSystem = [] }) => {
  // Convert any object items to strings
  const safeCareers = ensureStringItems(careerSuggestions);
  
  // Handle various formats of valueSystem
  const values = Array.isArray(valueSystem) 
    ? ensureStringItems(valueSystem)
    : ensureStringItems(valueSystem?.strengths || []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>Career & Values</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Career Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {safeCareers.slice(0, 6).map((career, index) => (
                <div 
                  key={index} 
                  className="border border-border/40 py-2 px-3 rounded-md text-center"
                >
                  {career}
                </div>
              ))}
            </div>
            {(!safeCareers || safeCareers.length === 0) && (
              <p className="text-muted-foreground italic">No career suggestions available</p>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Core Values</h3>
            <div className="flex flex-wrap gap-2">
              {values.slice(0, 8).map((value, index) => (
                <div 
                  key={index} 
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {value}
                </div>
              ))}
            </div>
            {(!values || values.length === 0) && (
              <p className="text-muted-foreground italic">No core values identified</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerValuesSection;
