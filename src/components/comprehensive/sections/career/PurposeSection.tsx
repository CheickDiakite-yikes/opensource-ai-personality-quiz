
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface PurposeSectionProps {
  lifePurposeThemes?: string[];
}

const PurposeSection: React.FC<PurposeSectionProps> = ({ lifePurposeThemes = [] }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader className="relative">
        <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-bl-full -z-0" />
        <CardTitle className="flex items-center gap-2 z-10">
          <Target className="h-5 w-5 text-primary" />
          Purpose & Life Direction
        </CardTitle>
        <CardDescription>
          Key themes that may provide meaning and direction in your life
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lifePurposeThemes && lifePurposeThemes.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {lifePurposeThemes.map((theme, index) => (
                <Badge key={index} variant="outline" className="bg-primary/5 text-primary border-primary/30 px-3 py-1.5">
                  {typeof theme === 'string' ? theme : String(theme)}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              These themes represent potential areas of purpose and meaning that align with your personality structure, values, and motivational patterns. They aren't prescriptive but may guide your exploration of fulfilling life directions.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Based on your profile, you may find meaning in pursuits that combine intellectual exploration with making tangible contributions. Consider areas where you can apply your analytical strengths while connecting with values that matter deeply to you.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PurposeSection;
