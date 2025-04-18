
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CognitivePatterningProps {
  data: {
    decisionMaking: string;
    learningStyle: string;
    attention: string;
  } | null;
}

const CognitivePatterningSection: React.FC<CognitivePatterningProps> = ({ data }) => {
  const defaultData = {
    decisionMaking: "You tend to gather information methodically before making decisions. You value logical consistency and consider multiple perspectives when evaluating options.",
    learningStyle: "You learn best through structured, systematic approaches with clear objectives.",
    attention: "You have a focused attention style that allows you to concentrate deeply on tasks of interest."
  };
  
  const cognitiveData = data || defaultData;
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-700 dark:text-blue-400">Decision Making</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.decisionMaking)}</p>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="text-purple-700 dark:text-purple-400">Learning Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.learningStyle)}</p>
        </CardContent>
      </Card>
      
      <Card className="border-cyan-200 dark:border-cyan-900">
        <CardHeader className="bg-cyan-50 dark:bg-cyan-900/20">
          <CardTitle className="text-cyan-700 dark:text-cyan-400">Attention Pattern</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{String(cognitiveData.attention)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CognitivePatterningSection;
