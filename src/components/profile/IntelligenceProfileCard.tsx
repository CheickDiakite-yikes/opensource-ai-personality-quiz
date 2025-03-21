
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

interface IntelligenceProfileCardProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const IntelligenceProfileCard: React.FC<IntelligenceProfileCardProps> = ({ analysis, itemVariants }) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden gradient-border">
        <CardHeader className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 pb-4">
          <CardTitle className="flex items-center text-foreground">
            <Brain className="h-5 w-5 mr-2 text-orange-500" /> Intelligence Profile
          </CardTitle>
          <CardDescription className="text-foreground/80">Your cognitive strengths and intelligence type</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 items-center`}>
            <div className={`relative ${isMobile ? 'w-24 h-24 mb-2' : 'w-32 h-32'} flex-shrink-0`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 animate-pulse-subtle"></div>
              <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                <div className="text-center">
                  <div className={isMobile ? "text-2xl font-bold" : "text-3xl font-bold"}>{analysis.intelligenceScore}</div>
                  <div className="text-xs text-muted-foreground">Intelligence</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-2 flex items-center`}>
                {analysis.intelligence.type} <Sparkles className="h-5 w-5 ml-2 text-amber-500" />
              </h3>
              <p className="text-muted-foreground mb-4">{analysis.intelligence.description}</p>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <h4 className="text-sm font-medium">Emotional Intelligence</h4>
                  <span className="text-sm font-semibold">{analysis.emotionalIntelligenceScore}/100</span>
                </div>
                <Progress value={analysis.emotionalIntelligenceScore} className="h-1.5" indicatorClassName="bg-orange-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntelligenceProfileCard;
