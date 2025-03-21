
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";

interface IntelligenceProfileCardProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const IntelligenceProfileCard: React.FC<IntelligenceProfileCardProps> = ({ analysis, itemVariants }) => (
  <motion.div variants={itemVariants}>
    <Card className="overflow-hidden gradient-border">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 pb-4">
        <CardTitle className="flex items-center text-foreground">
          <Brain className="h-5 w-5 mr-2 text-primary" /> Intelligence Profile
        </CardTitle>
        <CardDescription className="text-foreground/80">Your cognitive strengths and intelligence type</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-subtle"></div>
            <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{analysis.intelligenceScore}</div>
                <div className="text-xs text-muted-foreground">Intelligence</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              {analysis.intelligence.type} <Sparkles className="h-5 w-5 ml-2 text-amber-500" />
            </h3>
            <p className="text-muted-foreground">{analysis.intelligence.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default IntelligenceProfileCard;
