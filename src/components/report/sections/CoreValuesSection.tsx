
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award } from "lucide-react";

interface CoreValuesSectionProps {
  valueSystem: string[];
}

const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ valueSystem }) => {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-4">
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" /> Your Core Values
        </CardTitle>
        <CardDescription>Principles that guide your decisions</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {valueSystem.map((value, index) => (
            <div
              key={index}
              className="border border-border/40 p-3 rounded-md flex items-center bg-card/30"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 flex-shrink-0">
                {index + 1}
              </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreValuesSection;
