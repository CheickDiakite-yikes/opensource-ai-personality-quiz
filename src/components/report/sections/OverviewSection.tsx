
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Brain, Heart, PieChart } from "lucide-react";
import { AIAnalysis } from "@/utils/types";

interface OverviewSectionProps {
  analysis: AIAnalysis;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ analysis }) => {
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
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pb-4">
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" /> Overview
          </CardTitle>
          <CardDescription>Your personality at a glance</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">{analysis.overview}</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card/30 p-4 rounded-lg border border-border/40">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-sm font-medium">Intelligence Score</h3>
              </div>
              <div className="text-2xl font-bold">{analysis.intelligenceScore}/100</div>
            </div>
            
            <div className="bg-card/30 p-4 rounded-lg border border-border/40">
              <div className="flex items-center mb-2">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-sm font-medium">Emotional Intelligence</h3>
              </div>
              <div className="text-2xl font-bold">{analysis.emotionalIntelligenceScore}/100</div>
            </div>
            
            <div className="bg-card/30 p-4 rounded-lg border border-border/40">
              <div className="flex items-center mb-2">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-sm font-medium">Cognitive Style</h3>
              </div>
              <div className="text-md font-medium">{analysis.cognitiveStyle.primary}</div>
              <div className="text-sm text-muted-foreground">{analysis.cognitiveStyle.secondary}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OverviewSection;
