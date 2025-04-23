
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface PersonalityOverviewProps {
  overview: string;
}

const PersonalityOverview: React.FC<PersonalityOverviewProps> = ({ overview }) => {
  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>Personality Overview</CardTitle>
        <CardDescription>Summary of your core personality traits and tendencies</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg leading-relaxed">
          {overview || "Your Deep Insight Analysis reveals a multifaceted personality with unique cognitive patterns and emotional depths. The following sections break down the key components of your psychological profile."}
        </p>
      </CardContent>
    </Card>
  );
};

export default PersonalityOverview;
