
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase, ScrollText } from "lucide-react";
import { AnalysisData } from "../../utils/analysis/types";

interface CareerTabProps {
  analysis: AnalysisData;
}

export const CareerTab: React.FC<CareerTabProps> = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Career Insights
        </CardTitle>
        <CardDescription>Career paths and workplace dynamics that align with your personality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Recommended Career Paths</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.careerSuggestions.map((career, i) => (
              <div key={i} className="flex items-center bg-secondary/10 p-2 rounded-md">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs text-primary">
                  {i + 1}
                </div>
                <span>{career}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Learning Pathways</h3>
          <div className="grid grid-cols-1 gap-2">
            {analysis.learningPathways.map((pathway, i) => (
              <div key={i} className="flex items-center bg-secondary/10 p-2 rounded-md">
                <ScrollText className="h-4 w-4 text-primary mr-2" />
                <span>{pathway}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
