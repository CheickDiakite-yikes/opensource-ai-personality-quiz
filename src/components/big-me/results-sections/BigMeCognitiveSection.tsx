
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CognitivePatterning } from "@/utils/big-me/types";

interface BigMeCognitiveSectionProps {
  data: CognitivePatterning;
}

const BigMeCognitiveSection: React.FC<BigMeCognitiveSectionProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Cognitive Patterning</h2>
      
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
          <CardTitle className="text-indigo-700 dark:text-indigo-400">Decision Making</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.decisionMaking}</p>
        </CardContent>
      </Card>
      
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-700 dark:text-blue-400">Learning Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.learningStyle}</p>
        </CardContent>
      </Card>
      
      <Card className="border-cyan-200 dark:border-cyan-900">
        <CardHeader className="bg-cyan-50 dark:bg-cyan-900/20">
          <CardTitle className="text-cyan-700 dark:text-cyan-400">Attention Patterns</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.attention}</p>
        </CardContent>
      </Card>
      
      <Card className="border-teal-200 dark:border-teal-900">
        <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
          <CardTitle className="text-teal-700 dark:text-teal-400">Problem Solving Approach</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.problemSolvingApproach}</p>
        </CardContent>
      </Card>
      
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
          <CardTitle className="text-emerald-700 dark:text-emerald-400">Information Processing</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.informationProcessing}</p>
        </CardContent>
      </Card>
      
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-green-700 dark:text-green-400">Analytical Tendencies</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.analyticalTendencies}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BigMeCognitiveSection;
