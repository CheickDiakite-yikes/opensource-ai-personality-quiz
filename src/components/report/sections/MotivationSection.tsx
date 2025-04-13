
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
  
  // Helper function to parse out any embedded explanations in motivators/inhibitors
  const parseItemWithExplanation = (item: string) => {
    const colonIndex = item.indexOf(':');
    if (colonIndex > 0 && colonIndex < item.length - 1) {
      return {
        key: item.substring(0, colonIndex).trim(),
        explanation: item.substring(colonIndex + 1).trim()
      };
    }
    return { key: item, explanation: '' };
  };
  
  // Process motivators and inhibitors to extract any embedded explanations
  const processedMotivators = motivators.map(parseItemWithExplanation);
  const processedInhibitors = inhibitors.map(parseItemWithExplanation);
  
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
                  {motivatorsOpen ? "Collapse" : "Expand"} ({processedMotivators.length})
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
                  {processedMotivators.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-5 w-5 text-xs text-primary mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-xs">{item.key}</span>
                        {item.explanation && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.explanation}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {processedMotivators.map((item, index) => (
                <li key={index} className="flex items-start group hover:bg-muted/30 p-2 rounded-md transition-colors">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0 group-hover:bg-primary/20">
                    {index + 1}
                  </span>
                  <div>
                    <span>{item.key}</span>
                    {item.explanation && (
                      <p className="text-sm text-muted-foreground mt-1">{item.explanation}</p>
                    )}
                  </div>
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
                  {inhibitorsOpen ? "Collapse" : "Expand"} ({processedInhibitors.length})
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
                  {processedInhibitors.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-5 w-5 text-xs text-primary mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-xs">{item.key}</span>
                        {item.explanation && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.explanation}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {processedInhibitors.map((item, index) => (
                <li key={index} className="flex items-start group hover:bg-muted/30 p-2 rounded-md transition-colors">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0 group-hover:bg-primary/20">
                    {index + 1}
                  </span>
                  <div>
                    <span>{item.key}</span>
                    {item.explanation && (
                      <p className="text-sm text-muted-foreground mt-1">{item.explanation}</p>
                    )}
                  </div>
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
