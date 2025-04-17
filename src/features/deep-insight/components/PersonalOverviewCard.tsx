
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AnalysisData } from "../utils/analysis/types";
import { CoreTraitCard } from "./overview/CoreTraitCard";
import { IntelligenceScoreCard } from "./overview/IntelligenceScoreCard";
import { PersonalityTraitsList } from "./overview/PersonalityTraitsList";

interface PersonalOverviewCardProps {
  analysis: AnalysisData;
  itemVariants: any;
}

export const PersonalOverviewCard: React.FC<PersonalOverviewCardProps> = ({ analysis, itemVariants }) => {
  // Safely access overview with fallback
  const overview = typeof analysis.overview === 'string' ? analysis.overview : 'No overview available';
  
  // Safely access core traits with fallbacks
  const primaryType = analysis.coreTraits?.primary || 'Not specified';
  const secondaryType = analysis.coreTraits?.secondary || 'Not specified';
  
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={3}
    >
      <Card>
        <CardHeader>
          <CardTitle>Personal Overview</CardTitle>
          <CardDescription>A summary of your core personality traits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{overview}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CoreTraitCard 
              title="Primary Type"
              value={primaryType}
            />
            <CoreTraitCard 
              title="Secondary Type"
              value={secondaryType}
            />
            <IntelligenceScoreCard 
              cognitiveScore={analysis.intelligenceScore}
              emotionalScore={analysis.emotionalIntelligenceScore}
            />
          </div>
          
          <PersonalityTraitsList traits={analysis.traits} />
        </CardContent>
      </Card>
    </motion.div>
  );
};
