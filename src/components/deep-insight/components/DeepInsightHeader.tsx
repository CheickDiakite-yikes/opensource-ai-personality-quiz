
import React from "react";
import { Brain } from "lucide-react";

const DeepInsightHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-4">
        <Brain className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-center">Your Deep Insight Analysis</h1>
      <p className="text-muted-foreground text-center mt-2">
        A comprehensive analysis of your personality traits, cognitive patterns, and emotional architecture
      </p>
    </div>
  );
};

export default DeepInsightHeader;
