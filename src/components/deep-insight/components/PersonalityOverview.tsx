
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalityOverviewProps {
  overview: string;
}

const PersonalityOverview: React.FC<PersonalityOverviewProps> = ({ overview }) => {
  return (
    <Card className="mb-8 border-primary/30">
      <CardContent className="p-6 pt-6">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Personality Overview</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {overview}
        </p>
      </CardContent>
    </Card>
  );
};

export default PersonalityOverview;
