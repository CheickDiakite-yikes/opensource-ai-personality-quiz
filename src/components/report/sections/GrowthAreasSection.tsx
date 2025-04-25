
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrowthAreasSectionProps {
  weaknesses: string[];
  growthAreas: string[];
}

const GrowthAreasSection: React.FC<GrowthAreasSectionProps> = ({ 
  weaknesses,
  growthAreas 
}) => {
  const isMobile = useIsMobile();
  const [weaknessesOpen, setWeaknessesOpen] = React.useState(true); // Changed to default open
  const [growthOpen, setGrowthOpen] = React.useState(!isMobile);
  
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
    }} className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'md:grid-cols-2 gap-6'}`}>
      <Card className="glass-panel overflow-hidden border-rose-500/30"> 
        <CardHeader className={`bg-gradient-to-r from-rose-500/15 to-red-500/15 ${isMobile ? 'px-3 py-2 pb-2' : 'pb-3 md:pb-4'}`}>
          <CardTitle className={isMobile ? 'text-base' : ''}>Areas for Improvement</CardTitle>
          <CardDescription>Honest assessment of challenges</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <Collapsible open={weaknessesOpen} onOpenChange={setWeaknessesOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between py-1 px-3 border-t"
                size="sm"
              >
                <span className="text-xs">
                  {weaknessesOpen ? "Collapse" : "Expand"} ({weaknesses.length})
                </span>
                {weaknessesOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2 pb-2 px-3">
                <ul className="space-y-1.5">
                  {weaknesses.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-rose-500/20 h-4 w-4 text-[0.65rem] text-rose-700 mr-1.5 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <CardContent className="pt-3 md:pt-6">
            <ul className="space-y-2">
              {weaknesses.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-rose-500/20 h-6 w-6 text-sm text-rose-700 mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
      
      <Card className="glass-panel overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-blue-500/10 to-indigo-500/10 ${isMobile ? 'px-3 py-2 pb-2' : 'pb-3 md:pb-4'}`}>
          <CardTitle className={isMobile ? 'text-base' : ''}>Growth Areas</CardTitle>
          <CardDescription>Opportunities for development</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <Collapsible open={growthOpen} onOpenChange={setGrowthOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between py-1 px-3 border-t"
                size="sm"
              >
                <span className="text-xs">
                  {growthOpen ? "Collapse" : "Expand"} ({growthAreas.length})
                </span>
                {growthOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2 pb-2 px-3">
                <ul className="space-y-1.5">
                  {growthAreas.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-4 w-4 text-[0.65rem] text-primary mr-1.5 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <CardContent className="pt-3 md:pt-6">
            <ul className="space-y-2">
              {growthAreas.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default GrowthAreasSection;
