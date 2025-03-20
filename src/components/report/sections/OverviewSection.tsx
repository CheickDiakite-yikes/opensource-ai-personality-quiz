
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CognitiveStyleType } from "@/utils/types";
import { Brain } from "lucide-react";

interface OverviewSectionProps {
  overview: string;
  cognitiveStyle: CognitiveStyleType;
}

// Type guard to check if cognitiveStyle is an object or string
const isCognitiveStyleObject = (style: CognitiveStyleType): style is {
  primary: string;
  secondary: string;
  description: string;
} => {
  return typeof style === 'object' && 'primary' in style;
};

const OverviewSection: React.FC<OverviewSectionProps> = ({ overview, cognitiveStyle }) => {
  // Process the overview text into paragraphs
  const paragraphs = overview.split('\n\n').filter(p => p.trim().length > 0);
  
  // Extract cognitive style information
  let primaryStyle = '';
  let secondaryStyle = '';
  let styleDescription = '';
  
  if (isCognitiveStyleObject(cognitiveStyle)) {
    primaryStyle = cognitiveStyle.primary;
    secondaryStyle = cognitiveStyle.secondary;
    styleDescription = cognitiveStyle.description;
  } else {
    // If it's just a string, use it as the primary style
    primaryStyle = cognitiveStyle;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Personality Overview</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={index !== 0 ? "mt-4" : ""}>
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Brain className="w-5 h-5 mr-2 text-primary" />
              <h3 className="font-semibold text-lg">Cognitive Style</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Primary</span>
                <p className="font-medium">{primaryStyle}</p>
              </div>
              
              {secondaryStyle && (
                <div>
                  <span className="text-sm text-muted-foreground">Secondary</span>
                  <p className="font-medium">{secondaryStyle}</p>
                </div>
              )}
              
              {styleDescription && (
                <p className="text-sm mt-2">{styleDescription}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewSection;
