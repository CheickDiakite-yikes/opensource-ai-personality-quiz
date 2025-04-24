
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalityOverviewProps {
  overview: string;
}

const PersonalityOverview: React.FC<PersonalityOverviewProps> = ({ overview }) => {
  return (
    <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="p-6 pt-6">
        <h2 className="text-2xl font-semibold mb-4 text-primary/90 font-serif">Deep Insight Overview</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {overview || "Your deep insight analysis is being generated. This comprehensive assessment will reveal key patterns in your cognitive style, emotional architecture, and interpersonal dynamics."}
        </p>
      </CardContent>
    </Card>
  );
};

export default PersonalityOverview;
