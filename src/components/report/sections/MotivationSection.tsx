
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MotivationSectionProps {
  motivators: string[];
  inhibitors: string[];
}

const MotivationSection: React.FC<MotivationSectionProps> = ({ 
  motivators,
  inhibitors 
}) => {
  const isMobile = useIsMobile();
  const [motivatorsOpen, setMotivatorsOpen] = React.useState(!isMobile);
  const [inhibitorsOpen, setInhibitorsOpen] = React.useState(!isMobile);
  
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
      <Card className="glass-panel overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-emerald-500/10 to-green-500/10 ${isMobile ? 'px-3 py-2' : 'pb-4'}`}>
          <CardTitle className={`flex items-center ${isMobile ? 'text-base' : ''}`}>
            <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Motivators
          </CardTitle>
          <CardDescription>What drives you forward</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <Collapsible open={motivatorsOpen} onOpenChange={setMotivatorsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between py-1 px-3 border-t"
                size="sm"
              >
                <span className="text-xs">
                  {motivatorsOpen ? "Collapse" : "Expand"} ({motivators.length})
                </span>
                {motivatorsOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2 pb-2 px-3">
                <ul className="space-y-1.5">
                  {motivators.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-5 w-5 text-xs text-primary mr-2 mt-0.5 flex-shrink-0">
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
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {motivators.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
      
      <Card className="glass-panel overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-red-500/10 to-orange-500/10 ${isMobile ? 'px-3 py-2' : 'pb-4'}`}>
          <CardTitle className={`flex items-center ${isMobile ? 'text-base' : ''}`}>
            <Heart className="h-5 w-5 mr-2 text-primary" /> Inhibitors
          </CardTitle>
          <CardDescription>What may hold you back</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <Collapsible open={inhibitorsOpen} onOpenChange={setInhibitorsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between py-1 px-3 border-t"
                size="sm"
              >
                <span className="text-xs">
                  {inhibitorsOpen ? "Collapse" : "Expand"} ({inhibitors.length})
                </span>
                {inhibitorsOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-2 pb-2 px-3">
                <ul className="space-y-1.5">
                  {inhibitors.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-5 w-5 text-xs text-primary mr-2 mt-0.5 flex-shrink-0">
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
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {inhibitors.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default MotivationSection;
