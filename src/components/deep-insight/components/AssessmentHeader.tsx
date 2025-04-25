
import React from "react";
import { Brain } from "lucide-react";

const AssessmentHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-3">
        <Brain className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold">Deep Insight Assessment</h1>
      <p className="text-muted-foreground mt-2">
        Complete this comprehensive assessment to receive your detailed personality analysis
      </p>
    </div>
  );
};

export default AssessmentHeader;
