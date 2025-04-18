
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InterpersonalDynamicsProps {
  data: {
    attachmentStyle: string;
    communicationPattern: string;
    conflictResolution: string;
  } | null;
}

const InterpersonalDynamicsSection: React.FC<InterpersonalDynamicsProps> = ({ data }) => {
  const defaultData = {
    attachmentStyle: "You form meaningful connections with others while maintaining healthy boundaries.",
    communicationPattern: "Your communication style is thoughtful and precise, focusing on clarity and accuracy.",
    conflictResolution: "You approach conflicts with a problem-solving mindset, seeking fair and logical resolutions."
  };
  
  const interpersonalData = data || defaultData;
  
  return (
    <div className="space-y-6">
      <Card className="border-orange-200 dark:border-orange-900">
        <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
          <CardTitle className="text-orange-700 dark:text-orange-400">Attachment Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{interpersonalData.attachmentStyle}</p>
        </CardContent>
      </Card>
      
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
          <CardTitle className="text-indigo-700 dark:text-indigo-400">Communication Pattern</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{interpersonalData.communicationPattern}</p>
        </CardContent>
      </Card>
      
      <Card className="border-teal-200 dark:border-teal-900">
        <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
          <CardTitle className="text-teal-700 dark:text-teal-400">Conflict Resolution</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{interpersonalData.conflictResolution}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterpersonalDynamicsSection;
