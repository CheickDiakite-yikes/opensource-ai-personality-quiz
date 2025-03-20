
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface LearningPathwaysProps {
  pathways: string[];
}

const LearningPathways: React.FC<LearningPathwaysProps> = ({ pathways }) => {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 pb-4">
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-primary" /> Learning Pathways
        </CardTitle>
        <CardDescription>
          Educational directions that align with your cognitive style
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {pathways.map((pathway, index) => (
            <li
              key={index}
              className="flex items-start p-3 rounded-md border border-border/40 bg-card/30"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              <span>{pathway}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LearningPathways;
