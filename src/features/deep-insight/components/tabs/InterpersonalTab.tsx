
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Sparkles } from "lucide-react";
import { AnalysisData } from "../../utils/analysis/types";

interface InterpersonalTabProps {
  analysis: AnalysisData;
}

export const InterpersonalTab: React.FC<InterpersonalTabProps> = ({ analysis }) => {
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
          <p className="text-muted-foreground leading-relaxed">{analysis.interpersonalDynamics.attachmentStyle}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Communication Pattern</h3>
          <p className="text-muted-foreground leading-relaxed">{analysis.interpersonalDynamics.communicationPattern}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg">Conflict Resolution</h3>
          <p className="text-muted-foreground leading-relaxed">{analysis.interpersonalDynamics.conflictResolution}</p>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-lg flex items-center">
            <Sparkles className="h-4 w-4 text-primary mr-1" />
            Relationship Compatibility
          </h3>
          <div className="bg-secondary/10 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Most Compatible Types</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {analysis.relationshipPatterns && 
               typeof analysis.relationshipPatterns === 'object' && 
               'compatibleTypes' in analysis.relationshipPatterns && 
               analysis.relationshipPatterns.compatibleTypes?.map((type, index) => (
                <li key={index} className="text-muted-foreground">{type}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
