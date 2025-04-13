
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Sparkles, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IntelligenceProfileCardProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const IntelligenceProfileCard: React.FC<IntelligenceProfileCardProps> = ({ analysis, itemVariants }) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden gradient-border">
        <CardHeader className={`bg-gradient-to-r from-amber-500/20 to-orange-500/20 ${isMobile ? 'p-4 pb-3' : 'pb-4'}`}>
          <CardTitle className="flex items-center text-foreground">
            <Brain className="h-5 w-5 mr-2 text-orange-500" /> Cognitive Processing Profile
          </CardTitle>
          <CardDescription className="text-foreground/80">Your thinking style and information processing approaches</CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4 pt-3' : 'pt-6'}`}>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} gap-6 items-center`}>
            <div className={`relative ${isMobile ? 'w-24 h-24 mx-auto mb-2' : 'w-32 h-32'} flex-shrink-0`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 animate-pulse-subtle"></div>
              <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{analysis.intelligenceScore}</div>
                  <div className="text-xs text-muted-foreground">Flexibility Score</div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <h3 className={`${isMobile ? 'text-lg text-center' : 'text-xl'} font-semibold mb-2 flex items-center justify-center md:justify-start`}>
                {analysis.intelligence.type} <Sparkles className="h-5 w-5 ml-2 text-amber-500" />
              </h3>
              <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-sm text-center' : ''}`}>{analysis.intelligence.description}</p>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1 items-center">
                  <h4 className="text-sm font-medium flex items-center">
                    Emotional Intelligence
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[250px]">
                          <p className="text-xs">Measures your ability to understand, manage emotions and connect with others based on your assessment responses.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h4>
                  <span className="text-sm font-semibold">{analysis.emotionalIntelligenceScore}/100</span>
                </div>
                <Progress value={analysis.emotionalIntelligenceScore} className="h-1.5" indicatorClassName="bg-orange-500" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <strong>About this score:</strong> The Cognitive Processing Profile assesses how you approach problems and process information, not academic knowledge. It evaluates flexibility, pattern recognition, and adaptability based on your assessment responses.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntelligenceProfileCard;
