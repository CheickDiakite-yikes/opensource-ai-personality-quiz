
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, BarChart, AlertCircle, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { IntelligenceType } from "@/utils/types";
import IntelligenceDomainChart from "../IntelligenceDomainChart";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IntelligenceSectionProps {
  intelligence: IntelligenceType;
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
}

const IntelligenceSection: React.FC<IntelligenceSectionProps> = ({ 
  intelligence,
  intelligenceScore,
  emotionalIntelligenceScore
}) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = React.useState(!isMobile);
  
  // Ensure intelligence data exists
  const hasIntelligenceData = intelligence && intelligence.type && intelligence.domains && intelligence.domains.length > 0;
  const hasScores = typeof intelligenceScore === 'number' && typeof emotionalIntelligenceScore === 'number';
  
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
    }}>
      <Card className="glass-panel overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-amber-500/20 to-orange-500/20 ${isMobile ? 'p-3 pb-2' : 'pb-4'}`}>
          <CardTitle className="flex items-center text-foreground text-base md:text-xl">
            <Brain className="h-5 w-5 mr-2 text-orange-500" /> Cognitive Processing Profile
          </CardTitle>
          <CardDescription className="text-foreground/80">Your thinking style and cognitive approaches</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <>
            <Collapsible open={expanded} onOpenChange={setExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between py-1 px-3 border-t"
                  size="sm"
                >
                  <span className="text-xs">{expanded ? "Collapse" : "Expand"} profile</span>
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-3 overflow-hidden">
                  {hasScores ? (
                    <div className="mb-3">
                      <div className="flex justify-between mb-0.5 items-center">
                        <h3 className="font-medium text-xs text-foreground flex items-center">
                          Cognitive Flexibility Score
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[250px]">
                                <p className="text-xs">Measures how efficiently you process information and adapt thinking strategies based on your assessment responses, not academic knowledge.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        <span className="font-semibold text-xs text-foreground">{intelligenceScore}/100</span>
                      </div>
                      <Progress value={intelligenceScore} className="h-1.5 bg-foreground/20" indicatorClassName="bg-orange-500" />
                      
                      <div className="mt-3 flex justify-between mb-0.5 items-center">
                        <h3 className="font-medium text-xs text-foreground flex items-center">
                          Emotional Intelligence
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[250px]">
                                <p className="text-xs">Measures your ability to understand and manage emotions, both your own and others', based on your assessment responses.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </h3>
                        <span className="font-semibold text-xs text-foreground">{emotionalIntelligenceScore}/100</span>
                      </div>
                      <Progress value={emotionalIntelligenceScore} className="h-1.5 bg-foreground/20" indicatorClassName="bg-orange-500" />
                    </div>
                  ) : (
                    <div className="p-2 mb-2 bg-amber-900/20 text-amber-200 rounded-md flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <p className="text-[0.65rem]">Cognitive scores not available</p>
                    </div>
                  )}
                  
                  {hasIntelligenceData ? (
                    <div className="mt-3">
                      <h3 className="font-medium text-xs mb-1 text-foreground">Type: {intelligence.type}</h3>
                      <p className="text-[0.65rem] text-foreground/80 mb-2">{intelligence.description}</p>
                      
                      <div className="bg-secondary/20 rounded-md p-2 mb-2">
                        <p className="text-[0.65rem] text-foreground/80">
                          This profile reflects how you approach problems and process information, not academic ability. Different cognitive styles excel in different contexts.
                        </p>
                      </div>
                      
                      <h4 className="font-medium text-xs mb-1 flex items-center text-foreground">
                        <BarChart className="h-3 w-3 mr-1 text-orange-500" />
                        Cognitive Domains
                      </h4>
                      
                      <div className="w-full overflow-x-auto">
                        <div className="min-w-[280px]">
                          <IntelligenceDomainChart domains={intelligence.domains} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 bg-amber-900/20 text-amber-200 rounded-md flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <p className="text-[0.65rem]">Cognitive profile data not available</p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <CardContent className="pt-6">
            {hasScores ? (
              <div className="mb-4">
                <div className="flex justify-between mb-1 items-center">
                  <h3 className="font-medium text-sm md:text-base text-foreground flex items-center">
                    Cognitive Flexibility Score
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-sm">Measures how efficiently you process information and adapt thinking strategies based on your assessment responses, not academic knowledge.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <span className="font-semibold text-sm md:text-base text-foreground">{intelligenceScore}/100</span>
                </div>
                <Progress value={intelligenceScore} className="h-2 bg-foreground/20" indicatorClassName="bg-orange-500" />
                
                <div className="mt-4 flex justify-between mb-1 items-center">
                  <h3 className="font-medium text-sm md:text-base text-foreground flex items-center">
                    Emotional Intelligence
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="text-sm">Measures your ability to understand and manage emotions, both your own and others', based on your assessment responses.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <span className="font-semibold text-sm md:text-base text-foreground">{emotionalIntelligenceScore}/100</span>
                </div>
                <Progress value={emotionalIntelligenceScore} className="h-2 bg-foreground/20" indicatorClassName="bg-orange-500" />
              </div>
            ) : (
              <div className="p-3 md:p-4 mb-3 md:mb-4 bg-amber-900/20 text-amber-200 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <p className="text-xs md:text-sm">Cognitive scores not available</p>
              </div>
            )}
            
            {hasIntelligenceData ? (
              <div className="mt-4 md:mt-6">
                <h3 className="font-medium text-base md:text-lg mb-2 text-foreground">Type: {intelligence.type}</h3>
                <p className="text-sm md:text-base text-foreground/80 mb-3 md:mb-4">{intelligence.description}</p>
                
                <div className="bg-secondary/20 rounded-md p-3 md:p-4 mb-4">
                  <p className="text-sm text-foreground/80">
                    <strong>About this profile:</strong> This assessment measures your cognitive approaches and flexibility, not academic ability. It evaluates how you process information, recognize patterns, and adapt to new challenges based on your assessment responses. Different cognitive styles excel in different contexts and environments.
                  </p>
                </div>
                
                <h4 className="font-medium text-sm md:text-md mb-2 md:mb-3 flex items-center text-foreground">
                  <BarChart className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 text-orange-500" />
                  Cognitive Domains
                </h4>
                
                <div className={isMobile ? "w-full overflow-x-auto -mx-2 px-2" : ""}>
                  <div className={isMobile ? "min-w-[300px]" : ""}>
                    <IntelligenceDomainChart domains={intelligence.domains} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 md:p-4 bg-amber-900/20 text-amber-200 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <p className="text-xs md:text-sm">Cognitive profile data not available</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default IntelligenceSection;
