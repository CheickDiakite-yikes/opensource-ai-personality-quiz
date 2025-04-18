
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InterpersonalDynamicsProps {
  data: {
    attachmentStyle: string;
    communicationPattern: string;
    conflictResolution: string;
    relationshipNeeds?: string;
    groupDynamics?: string;
    socialBoundaries?: string;
  } | null;
}

const InterpersonalDynamicsSection: React.FC<InterpersonalDynamicsProps> = ({ data }) => {
  const defaultData = {
    attachmentStyle: "You form meaningful connections with others while maintaining healthy boundaries.",
    communicationPattern: "Your communication style is thoughtful and precise, focusing on clarity and accuracy.",
    conflictResolution: "You approach conflicts with a problem-solving mindset, seeking fair and logical resolutions.",
    relationshipNeeds: "You value authentic connections with space for individual growth and mutual support.",
    socialBoundaries: "You establish clear boundaries that balance openness with appropriate privacy.",
    groupDynamics: "In groups, you tend to observe before contributing valuable insights."
  };
  
  const interpersonalData = data || defaultData;
  
  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-900">
        <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
          <CardTitle className="text-orange-700 dark:text-orange-400">Attachment Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(interpersonalData.attachmentStyle)}</p>
        </CardContent>
      </Card>
      
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
          <CardTitle className="text-indigo-700 dark:text-indigo-400">Communication Pattern</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(interpersonalData.communicationPattern)}</p>
        </CardContent>
      </Card>
      
      <Card className="border-teal-200 dark:border-teal-900">
        <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
          <CardTitle className="text-teal-700 dark:text-teal-400">Conflict Resolution</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(interpersonalData.conflictResolution)}</p>
        </CardContent>
      </Card>

      {interpersonalData.relationshipNeeds && (
        <Card className="border-pink-200 dark:border-pink-900">
          <CardHeader className="bg-pink-50 dark:bg-pink-900/20">
            <CardTitle className="text-pink-700 dark:text-pink-400">Relationship Needs</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{String(interpersonalData.relationshipNeeds)}</p>
          </CardContent>
        </Card>
      )}

      {interpersonalData.socialBoundaries && (
        <Card className="border-violet-200 dark:border-violet-900">
          <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
            <CardTitle className="text-violet-700 dark:text-violet-400">Social Boundaries</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{String(interpersonalData.socialBoundaries)}</p>
          </CardContent>
        </Card>
      )}

      {interpersonalData.groupDynamics && (
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
            <CardTitle className="text-emerald-700 dark:text-emerald-400">Group Dynamics</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{String(interpersonalData.groupDynamics)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterpersonalDynamicsSection;
