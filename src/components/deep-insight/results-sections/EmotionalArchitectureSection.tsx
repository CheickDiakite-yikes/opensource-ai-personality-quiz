
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmotionalArchitectureProps {
  data: {
    emotionalAwareness: string;
    regulationStyle: string;
    empathicCapacity: string;
  } | null;
}

const EmotionalArchitectureSection: React.FC<EmotionalArchitectureProps> = ({ data }) => {
  const defaultData = {
    emotionalAwareness: "You have strong awareness of your emotional states and can generally identify what you're feeling in the moment.",
    regulationStyle: "You manage emotions through a combination of analytical processing and practical coping strategies.",
    empathicCapacity: "You can understand others' emotional experiences, particularly when they're clearly communicated."
  };
  
  const emotionalData = data || defaultData;
  
  return (
    <div className="space-y-6">
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
          <CardTitle className="text-amber-700 dark:text-amber-400">Emotional Awareness</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{emotionalData.emotionalAwareness}</p>
        </CardContent>
      </Card>
      
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
          <CardTitle className="text-emerald-700 dark:text-emerald-400">Regulation Style</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{emotionalData.regulationStyle}</p>
        </CardContent>
      </Card>
      
      <Card className="border-pink-200 dark:border-pink-900">
        <CardHeader className="bg-pink-50 dark:bg-pink-900/20">
          <CardTitle className="text-pink-700 dark:text-pink-400">Empathic Capacity</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">{emotionalData.empathicCapacity}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionalArchitectureSection;
