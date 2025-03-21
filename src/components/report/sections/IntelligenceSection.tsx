
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
import { Brain, BarChart, AlertCircle } from "lucide-react";
import { IntelligenceType } from "@/utils/types";
import IntelligenceDomainChart from "../IntelligenceDomainChart";
import { useIsMobile } from "@/hooks/use-mobile";

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
      <Card className="glass-panel overflow-hidden bg-[#231815]">
        <CardHeader className={`bg-gradient-to-r from-amber-500/20 to-orange-500/20 ${isMobile ? 'p-4 pb-3' : 'pb-4'}`}>
          <CardTitle className="flex items-center text-foreground text-lg md:text-xl">
            <Brain className="h-5 w-5 mr-2 text-orange-500" /> Intelligence Profile
          </CardTitle>
          <CardDescription className="text-foreground/80">Your cognitive strengths and style</CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "p-4 pt-3" : "pt-6"}>
          {hasScores ? (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium text-sm md:text-base text-foreground">Intelligence Score</h3>
                <span className="font-semibold text-sm md:text-base text-foreground">{intelligenceScore}/100</span>
              </div>
              <Progress value={intelligenceScore} className="h-2 bg-foreground/20" indicatorClassName="bg-orange-500" />
              
              <div className="mt-4 flex justify-between mb-1">
                <h3 className="font-medium text-sm md:text-base text-foreground">Emotional Intelligence</h3>
                <span className="font-semibold text-sm md:text-base text-foreground">{emotionalIntelligenceScore}/100</span>
              </div>
              <Progress value={emotionalIntelligenceScore} className="h-2 bg-foreground/20" indicatorClassName="bg-orange-500" />
            </div>
          ) : (
            <div className="p-3 md:p-4 mb-3 md:mb-4 bg-amber-900/20 text-amber-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <p className="text-xs md:text-sm">Intelligence scores not available</p>
            </div>
          )}
          
          {hasIntelligenceData ? (
            <div className="mt-5 md:mt-6">
              <h3 className="font-medium text-base md:text-lg mb-2 text-foreground">Type: {intelligence.type}</h3>
              <p className="text-sm md:text-base text-foreground/80 mb-3 md:mb-4">{intelligence.description}</p>
              
              <h4 className="font-medium text-sm md:text-md mb-2 md:mb-3 flex items-center text-foreground">
                <BarChart className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 text-orange-500" />
                Intelligence Domains
              </h4>
              
              <IntelligenceDomainChart domains={intelligence.domains} />
            </div>
          ) : (
            <div className="p-3 md:p-4 bg-amber-900/20 text-amber-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <p className="text-xs md:text-sm">Intelligence profile data not available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntelligenceSection;
