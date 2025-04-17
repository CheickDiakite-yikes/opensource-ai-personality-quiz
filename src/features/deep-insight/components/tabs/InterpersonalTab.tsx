
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Sparkles } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";

interface InterpersonalTabProps {
  analysis: PersonalityAnalysis;
}

export const InterpersonalTab: React.FC<InterpersonalTabProps> = ({ analysis }) => {
  const interpersonalDynamics = analysis.interpersonalDynamics || {
    attachmentStyle: "Your attachment style shows a balanced approach to relationships, valuing both connection and independence.",
    communicationPattern: "You communicate thoughtfully and prefer depth over small talk. You listen well and generally express your thoughts clearly.",
    conflictResolution: "Your approach to conflict emphasizes finding common ground while addressing issues directly but tactfully."
  };

  const relationshipPatterns = analysis.relationshipPatterns || {
    compatibleTypes: ["Thoughtful Collaborators", "Supportive Motivators", "Growth-Oriented Partners"]
  };

  const compatibleTypes = Array.isArray(relationshipPatterns) 
    ? relationshipPatterns 
    : ('compatibleTypes' in relationshipPatterns ? relationshipPatterns.compatibleTypes : []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Interpersonal Dynamics
        </CardTitle>
        <CardDescription>How you relate to and interact with others</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-lg">Attachment Style</h3>
          <p className="text-muted-foreground leading-relaxed">
            {interpersonalDynamics.attachmentStyle}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Communication Pattern</h3>
          <p className="text-muted-foreground leading-relaxed">
            {interpersonalDynamics.communicationPattern}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Conflict Resolution</h3>
          <p className="text-muted-foreground leading-relaxed">
            {interpersonalDynamics.conflictResolution}
          </p>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-lg flex items-center">
            <Sparkles className="h-4 w-4 text-primary mr-1" />
            Relationship Compatibility
          </h3>
          <div className="bg-secondary/10 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Most Compatible Types</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {compatibleTypes && compatibleTypes.map((type, index) => (
                <li key={index} className="text-muted-foreground">{type}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
