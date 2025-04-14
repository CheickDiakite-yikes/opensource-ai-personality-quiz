
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CognitiveStyle } from "@/utils/types";
import { InfoIcon } from "lucide-react";

interface OverviewSectionProps {
  overview: string;
  cognitiveStyle: CognitiveStyle | string;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ overview, cognitiveStyle }) => {
  // Determine if cognitiveStyle is an object or string
  const cognitiveDescription = React.useMemo(() => {
    if (typeof cognitiveStyle === 'string') {
      return cognitiveStyle;
    }
    if (cognitiveStyle && typeof cognitiveStyle === 'object') {
      return `${cognitiveStyle.primary || ''} ${cognitiveStyle.secondary || ''}`.trim();
    }
    return '';
  }, [cognitiveStyle]);

  // Split overview into paragraphs for better readability
  const paragraphs = React.useMemo(() => {
    if (!overview) return [];
    return overview
      .split(/\n+/)
      .filter(Boolean)
      .map(p => p.trim());
  }, [overview]);

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 pb-4">
        <CardTitle className="flex items-center">
          <InfoIcon className="h-5 w-5 mr-2 text-primary" /> Analysis Overview
        </CardTitle>
        <CardDescription>
          Your comprehensive personality profile
          {cognitiveDescription && (
            <>
              {" · "}
              <span className="font-medium">
                Cognitive Style: {cognitiveDescription}
              </span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground">
              Your personality analysis shows a unique combination of traits and cognitive patterns. This overview will be generated based on your assessment responses and will provide insights into your personality style, strengths, and growth areas.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewSection;
