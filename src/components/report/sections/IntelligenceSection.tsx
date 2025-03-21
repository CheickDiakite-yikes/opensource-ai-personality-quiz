
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
  // Ensure intelligence data exists
  const hasIntelligenceData = intelligence && intelligence.type && intelligence.domains;
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
        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 pb-4">
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" /> Intelligence Profile
          </CardTitle>
          <CardDescription>Your cognitive strengths and style</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {hasScores ? (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">Intelligence Score</h3>
                <span className="font-semibold">{intelligenceScore}/100</span>
              </div>
              <Progress value={intelligenceScore} className="h-2" />
              
              <div className="mt-4 flex justify-between mb-1">
                <h3 className="font-medium">Emotional Intelligence</h3>
                <span className="font-semibold">{emotionalIntelligenceScore}/100</span>
              </div>
              <Progress value={emotionalIntelligenceScore} className="h-2" />
            </div>
          ) : (
            <div className="p-4 mb-4 bg-amber-50 text-amber-800 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">Intelligence scores not available</p>
            </div>
          )}
          
          {hasIntelligenceData ? (
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Type: {intelligence.type}</h3>
              <p className="text-muted-foreground mb-4">{intelligence.description}</p>
              
              <h4 className="font-medium text-md mb-3 flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-primary" />
                Intelligence Domains
              </h4>
              
              <IntelligenceDomainChart domains={intelligence.domains} />
            </div>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">Intelligence profile data not available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntelligenceSection;
