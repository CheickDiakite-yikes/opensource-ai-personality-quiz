
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
import { ValueSystemType } from "@/utils/types";
import { isValueSystemObject } from "../utils/typeGuards";
import { useIsMobile } from "@/hooks/use-mobile";

interface CoreValuesSectionProps {
  valueSystem: ValueSystemType;
}

const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ valueSystem }) => {
  const isMobile = useIsMobile();
  
  // Extract values to display based on valueSystem type
  const valuesToDisplay = isValueSystemObject(valueSystem) 
    ? valueSystem.strengths 
    : valueSystem;

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className={`bg-gradient-to-r from-indigo-500/10 to-purple-500/10 ${isMobile ? 'px-3 py-2' : 'pb-3 md:pb-4'}`}>
        <CardTitle className={`flex items-center ${isMobile ? 'text-base' : ''}`}>
          <Award className="h-5 w-5 mr-2 text-primary" /> Your Core Values
        </CardTitle>
        <CardDescription>Principles that guide your decisions</CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-3 py-2' : 'pt-3 md:pt-6'}`}>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-1.5' : 'sm:grid-cols-2 gap-2'} max-w-full`}>
          {valuesToDisplay.map((value, index) => (
            <div
              key={index}
              className={`border border-border/40 ${isMobile ? 'p-1.5' : 'p-2 md:p-3'} rounded-md flex items-center bg-card/30`}
            >
              <span className={`inline-flex items-center justify-center rounded-full bg-primary/10 ${isMobile ? 'h-5 w-5 text-xs mr-1.5 flex-shrink-0' : 'h-6 w-6 text-sm mr-2 md:mr-3'} text-primary flex-shrink-0`}>
                {index + 1}
              </span>
              <span className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} break-words truncate`}>{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoreValuesSection;
