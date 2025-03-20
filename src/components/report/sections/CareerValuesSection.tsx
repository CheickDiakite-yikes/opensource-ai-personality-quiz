
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Award } from "lucide-react";
import { ValueSystemType } from "@/utils/types";

interface CareerValuesSectionProps {
  careerSuggestions: string[];
  valueSystem: ValueSystemType;
}

const CareerValuesSection: React.FC<CareerValuesSectionProps> = ({ 
  careerSuggestions,
  valueSystem 
}) => {
  // Type guard to check if valueSystem is an object
  const isValueSystemObject = (system: ValueSystemType): system is {
    strengths: string[];
    challenges: string[];
    compatibleTypes: string[];
  } => {
    return typeof system === 'object' && !Array.isArray(system) && 'strengths' in system;
  };

  // Extract values to display based on valueSystem type
  const valuesToDisplay = isValueSystemObject(valueSystem) 
    ? valueSystem.strengths 
    : valueSystem;

  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    }} className="grid md:grid-cols-2 gap-6">
      {/* Career Suggestions Card */}
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pb-4">
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-primary" /> Career Suggestions
          </CardTitle>
          <CardDescription>Potential career paths that match your profile</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {careerSuggestions.map((career, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{career}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Values Card */}
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-4">
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" /> Your Core Values
          </CardTitle>
          <CardDescription>Principles that guide your decisions</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {valuesToDisplay.map((value, index) => (
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
    </motion.div>
  );
};

export default CareerValuesSection;
