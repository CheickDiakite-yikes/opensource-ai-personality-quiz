
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Compass } from "lucide-react";

interface PurposeSectionProps {
  lifePurposeThemes?: string[];
}

const PurposeSection: React.FC<PurposeSectionProps> = ({ 
  lifePurposeThemes = []
}) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          Life Purpose Themes
        </CardTitle>
        <CardDescription>
          Core themes that may guide your career choices and life direction
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lifePurposeThemes && lifePurposeThemes.length > 0 ? (
          <div className="space-y-4">
            {lifePurposeThemes.map((theme, index) => (
              <div key={index} className="p-3 border rounded-md bg-card/50">
                <p>{typeof theme === 'string' ? theme : String(theme)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No life purpose themes available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PurposeSection;
