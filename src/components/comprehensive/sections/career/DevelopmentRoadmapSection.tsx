
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Map } from "lucide-react";

interface DevelopmentRoadmapSectionProps {
  roadmap: string;
}

const DevelopmentRoadmapSection: React.FC<DevelopmentRoadmapSectionProps> = ({ roadmap }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Development Roadmap
        </CardTitle>
        <CardDescription>
          A strategic pathway for your professional growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 whitespace-pre-wrap">
          {typeof roadmap === 'string' ? roadmap : String(roadmap)}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevelopmentRoadmapSection;
