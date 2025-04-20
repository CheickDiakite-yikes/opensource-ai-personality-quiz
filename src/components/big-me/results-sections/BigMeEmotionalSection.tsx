
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionalArchitecture } from "@/utils/big-me/types";

interface BigMeEmotionalSectionProps {
  data: EmotionalArchitecture;
}

const BigMeEmotionalSection: React.FC<BigMeEmotionalSectionProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Emotional Architecture</h2>
      
      <Card className="border-rose-200 dark:border-rose-900">
        <CardHeader className="bg-rose-50 dark:bg-rose-900/20">
          <CardTitle className="text-rose-700 dark:text-rose-400">Emotional Awareness</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.emotionalAwareness}</p>
        </CardContent>
      </Card>
      
      <Card className="border-pink-200 dark:border-pink-900">
        <CardHeader className="bg-pink-50 dark:bg-pink-900/20">
          <CardTitle className="text-pink-700 dark:text-pink-400">Regulation Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.regulationStyle}</p>
        </CardContent>
      </Card>
      
      <Card className="border-fuchsia-200 dark:border-fuchsia-900">
        <CardHeader className="bg-fuchsia-50 dark:bg-fuchsia-900/20">
          <CardTitle className="text-fuchsia-700 dark:text-fuchsia-400">Empathic Capacity</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.empathicCapacity}</p>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="text-purple-700 dark:text-purple-400">Emotional Complexity</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.emotionalComplexity}</p>
        </CardContent>
      </Card>
      
      <Card className="border-violet-200 dark:border-violet-900">
        <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
          <CardTitle className="text-violet-700 dark:text-violet-400">Stress Response</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.stressResponse}</p>
        </CardContent>
      </Card>
      
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
          <CardTitle className="text-indigo-700 dark:text-indigo-400">Emotional Resilience</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.emotionalResilience}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BigMeEmotionalSection;
