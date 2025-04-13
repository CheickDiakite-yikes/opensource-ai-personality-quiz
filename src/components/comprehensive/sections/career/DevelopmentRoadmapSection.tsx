
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface DevelopmentRoadmapSectionProps {
  roadmap: string;
}

const DevelopmentRoadmapSection: React.FC<DevelopmentRoadmapSectionProps> = ({ roadmap }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Development Roadmap
        </CardTitle>
        <CardDescription>
          Your path to personal and professional growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roadmap ? (
          <div className="text-sm space-y-4">
            {(typeof roadmap === 'string' ? roadmap : String(roadmap)).split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your development roadmap focuses on leveraging your analytical strengths while building confidence in your intuitive decision-making. Focus on setting clearer boundaries and embracing the concept of "good enough" to overcome perfectionist tendencies. Explore opportunities that combine your analytical abilities with creative problem-solving.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DevelopmentRoadmapSection;
