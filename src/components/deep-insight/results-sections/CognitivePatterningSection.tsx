
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CognitivePatterns } from "../types/deepInsight";

interface CognitivePatterningProps {
  data: CognitivePatterns | null;
}

const CognitivePatterningSection: React.FC<CognitivePatterningProps> = ({ data }) => {
  const defaultData = {
    decisionMaking: "You tend to gather information methodically before making decisions. You value logical consistency and consider multiple perspectives when evaluating options.",
    learningStyle: "You learn best through structured, systematic approaches with clear objectives.",
    attention: "You have a focused attention style that allows you to concentrate deeply on tasks of interest.",
    problemSolvingApproach: "You approach problems systematically, breaking them down into manageable components.",
    informationProcessing: "You process information thoroughly, connecting new concepts to existing knowledge.",
    analyticalTendencies: "You have strong analytical skills, noticing patterns and inconsistencies."
  };
  
  const cognitiveData = data || defaultData;
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-700 dark:text-blue-400">Decision Making</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.decisionMaking || "")}</p>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="text-purple-700 dark:text-purple-400">Learning Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.learningStyle || "")}</p>
        </CardContent>
      </Card>
      
      <Card className="border-cyan-200 dark:border-cyan-900">
        <CardHeader className="bg-cyan-50 dark:bg-cyan-900/20">
          <CardTitle className="text-cyan-700 dark:text-cyan-400">Attention Pattern</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.attention || "")}</p>
        </CardContent>
      </Card>

      {cognitiveData.problemSolvingApproach && (
        <Card className="border-amber-200 dark:border-amber-900">
          <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
            <CardTitle className="text-amber-700 dark:text-amber-400">Problem Solving Approach</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.problemSolvingApproach)}</p>
          </CardContent>
        </Card>
      )}

      {cognitiveData.informationProcessing && (
        <Card className="border-lime-200 dark:border-lime-900">
          <CardHeader className="bg-lime-50 dark:bg-lime-900/20">
            <CardTitle className="text-lime-700 dark:text-lime-400">Information Processing</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.informationProcessing)}</p>
          </CardContent>
        </Card>
      )}

      {cognitiveData.analyticalTendencies && (
        <Card className="border-rose-200 dark:border-rose-900">
          <CardHeader className="bg-rose-50 dark:bg-rose-900/20">
            <CardTitle className="text-rose-700 dark:text-rose-400">Analytical Tendencies</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.analyticalTendencies)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CognitivePatterningSection;
