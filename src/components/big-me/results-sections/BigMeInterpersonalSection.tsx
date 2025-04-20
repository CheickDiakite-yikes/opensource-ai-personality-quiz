
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterpersonalDynamics } from "@/utils/big-me/types";

interface BigMeInterpersonalSectionProps {
  data: InterpersonalDynamics;
}

const BigMeInterpersonalSection: React.FC<BigMeInterpersonalSectionProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Interpersonal Dynamics</h2>
      
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-700 dark:text-blue-400">Attachment Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.attachmentStyle}</p>
        </CardContent>
      </Card>
      
      <Card className="border-sky-200 dark:border-sky-900">
        <CardHeader className="bg-sky-50 dark:bg-sky-900/20">
          <CardTitle className="text-sky-700 dark:text-sky-400">Communication Pattern</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.communicationPattern}</p>
        </CardContent>
      </Card>
      
      <Card className="border-cyan-200 dark:border-cyan-900">
        <CardHeader className="bg-cyan-50 dark:bg-cyan-900/20">
          <CardTitle className="text-cyan-700 dark:text-cyan-400">Conflict Resolution</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.conflictResolution}</p>
        </CardContent>
      </Card>
      
      <Card className="border-teal-200 dark:border-teal-900">
        <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
          <CardTitle className="text-teal-700 dark:text-teal-400">Relationship Needs</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.relationshipNeeds}</p>
        </CardContent>
      </Card>
      
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
          <CardTitle className="text-emerald-700 dark:text-emerald-400">Social Boundaries</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.socialBoundaries}</p>
        </CardContent>
      </Card>
      
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-green-700 dark:text-green-400">Group Dynamics</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.groupDynamics}</p>
        </CardContent>
      </Card>
      
      <Card className="border-lime-200 dark:border-lime-900">
        <CardHeader className="bg-lime-50 dark:bg-lime-900/20">
          <CardTitle className="text-lime-700 dark:text-lime-400">Compatibility Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.compatibilityProfile}</p>
          
          <div className="mt-6">
            <h4 className="font-semibold text-lime-700 dark:text-lime-400 mb-3">Most Compatible Types</h4>
            <ul className="list-disc ml-6 space-y-2">
              {data.compatibleTypes.map((type, index) => (
                <li key={index} className="text-muted-foreground">{type}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-rose-700 dark:text-rose-400 mb-3">Potential Challenges</h4>
            <ul className="list-disc ml-6 space-y-2">
              {data.challengingRelationships.map((challenge, index) => (
                <li key={index} className="text-muted-foreground">{challenge}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BigMeInterpersonalSection;
