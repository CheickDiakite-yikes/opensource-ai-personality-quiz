
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Award } from "lucide-react";
import { ValueSystemType } from "@/utils/types";
import { isValueSystemObject } from "../utils/typeGuards";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CareerValuesSectionProps {
  careerSuggestions: string[];
  valueSystem: ValueSystemType;
}

const CareerValuesSection: React.FC<CareerValuesSectionProps> = ({ 
  careerSuggestions,
  valueSystem 
}) => {
  const isMobile = useIsMobile();
  const [careersOpen, setCareersOpen] = React.useState(!isMobile);
  const [valuesOpen, setValuesOpen] = React.useState(!isMobile);
  
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
    }} className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 gap-6'}`}>
      {/* Career Suggestions Card */}
      <Card className="glass-panel overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-blue-500/10 to-indigo-500/10 ${isMobile ? 'px-3 py-2' : 'pb-4'}`}>
          <CardTitle className={`flex items-center ${isMobile ? 'text-base' : ''}`}>
            <Briefcase className="h-5 w-5 mr-2 text-primary" /> Career Suggestions
          </CardTitle>
          <CardDescription>Potential career paths that match your profile</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <Collapsible open={careersOpen} onOpenChange={setCareersOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between py-1 px-3 border-t"
                size="sm"
              >
                <span className="text-xs">
                  {careersOpen ? "Collapse" : "Expand"} ({careerSuggestions.length})
                </span>
                {careersOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2 pb-2 px-3">
                <ul className="space-y-1.5">
                  {careerSuggestions.map((career, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-5 w-5 text-xs text-primary mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs">{career}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
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
        )}
      </Card>
      
      {/* Values Card */}
      <Card className="glass-panel overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-indigo-500/10 to-purple-500/10 ${isMobile ? 'px-3 py-2' : 'pb-4'}`}>
          <CardTitle className={`flex items-center ${isMobile ? 'text-base' : ''}`}>
            <Award className="h-5 w-5 mr-2 text-primary" /> Your Core Values
          </CardTitle>
          <CardDescription>Principles that guide your decisions</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <Collapsible open={valuesOpen} onOpenChange={setValuesOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between py-1 px-3 border-t"
                size="sm"
              >
                <span className="text-xs">
                  {valuesOpen ? "Collapse" : "Expand"} ({valuesToDisplay.length})
                </span>
                {valuesOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2 pb-2 px-3">
                <div className="grid grid-cols-1 gap-1.5">
                  {valuesToDisplay.map((value, index) => (
                    <div
                      key={index}
                      className="border border-border/40 p-1.5 rounded-md flex items-center bg-card/30"
                    >
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-5 w-5 text-xs text-primary mr-2 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
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
        )}
      </Card>
    </motion.div>
  );
};

export default CareerValuesSection;
