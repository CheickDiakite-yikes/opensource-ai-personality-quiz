
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CognitiveStyleType } from "@/utils/types";

interface OverviewSectionProps {
  overview: string;
  cognitiveStyle: CognitiveStyleType;
}

// Type guard to check if cognitiveStyle is an object
const isCognitiveStyleObject = (style: CognitiveStyleType): style is {
  primary: string;
  secondary: string;
  description: string;
} => {
  return typeof style === 'object' && 'primary' in style;
};

const OverviewSection: React.FC<OverviewSectionProps> = ({
  overview,
  cognitiveStyle
}) => {
  // Format cognitive style for display based on type
  const formatCognitiveStyle = () => {
    if (isCognitiveStyleObject(cognitiveStyle)) {
      return (
        <>
          <span className="font-semibold text-primary">{cognitiveStyle.primary}</span>
          {" with "}
          <span className="font-semibold text-primary">{cognitiveStyle.secondary}</span>
          {" elements"}
        </>
      );
    } else {
      return <span className="font-semibold text-primary">{cognitiveStyle}</span>;
    }
  };
  
  // Split the overview into paragraphs
  const paragraphs = overview.split('\n\n');
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Personality Overview</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Cognitive Style</h3>
            <p className="text-muted-foreground">
              You tend to process information as a {formatCognitiveStyle()}
            </p>
            
            {isCognitiveStyleObject(cognitiveStyle) && cognitiveStyle.description && (
              <p className="mt-3 text-sm text-muted-foreground">
                {cognitiveStyle.description}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OverviewSection;
