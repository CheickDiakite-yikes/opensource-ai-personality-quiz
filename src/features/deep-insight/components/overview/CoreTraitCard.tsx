
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CoreTraitCardProps {
  title: string;
  value?: string;
}

export const CoreTraitCard: React.FC<CoreTraitCardProps> = ({ title, value }) => {
  // Handle undefined or empty values
  const displayValue = value || "Not specified";
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pb-4 pt-6 flex-1 flex flex-col">
        <div className="text-center mb-2">
          <h3 className="font-semibold text-primary">{title}</h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center font-medium text-lg">
            {displayValue}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
