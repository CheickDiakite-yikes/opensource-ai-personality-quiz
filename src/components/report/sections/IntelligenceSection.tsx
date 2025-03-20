
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
import { Brain, BarChart } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";
import IntelligenceDomainChart from "../IntelligenceDomainChart";

interface IntelligenceSectionProps {
  analysis: PersonalityAnalysis;
}

const IntelligenceSection: React.FC<IntelligenceSectionProps> = ({ analysis }) => {
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
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <h3 className="font-medium">Intelligence Score</h3>
              <span className="font-semibold">{analysis.intelligenceScore}/100</span>
            </div>
            <Progress value={analysis.intelligenceScore} className="h-2" />
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-2">Type: {analysis.intelligence.type}</h3>
            <p className="text-muted-foreground mb-4">{analysis.intelligence.description}</p>
            
            <h4 className="font-medium text-md mb-3 flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-primary" />
              Intelligence Domains
            </h4>
            
            <IntelligenceDomainChart domains={analysis.intelligence.domains} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntelligenceSection;
