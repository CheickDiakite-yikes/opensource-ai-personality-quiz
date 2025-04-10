
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useIsMobile, useViewport } from "@/hooks/use-mobile";

interface TraitsCardProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const TraitsCard: React.FC<TraitsCardProps> = ({ analysis, itemVariants }) => {
  // Get top 5 traits
  const topTraits = analysis.traits?.slice(0, 5) || [];
  const isMobile = useIsMobile();
  const { width } = useViewport();
  
  // Use a more specific check for very small screens
  const isVerySmallScreen = width < 380;
  
  // Format trait score for consistent display
  const formatTraitScore = (score: number): number => {
    // If score is already between 0 and 10 (but greater than 1), use it directly
    if (score > 1 && score <= 10) {
      return Math.round(score);
    }
    // If score is between 0 and 1, scale to 0-10
    else if (score >= 0 && score <= 1) {
      return Math.round(score * 10);
    }
    // If score is greater than 10 (e.g., 0-100 scale), convert to 0-10
    else {
      return Math.round((score / 100) * 10);
    }
  };
  
  return (
    <Card className="overflow-hidden gradient-border">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle className="flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-primary" /> Top Personality Traits
        </CardTitle>
        <CardDescription>Your most prominent personality characteristics</CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'pt-3 px-3' : 'pt-6'}`}>
        {topTraits.length > 0 ? (
          <div className="space-y-4">
            {topTraits.map((trait, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`font-medium ${isVerySmallScreen ? 'text-xs' : isMobile ? 'text-sm' : ''}`}>{trait.trait}</span>
                    <Badge variant="outline" className={`${isVerySmallScreen ? 'text-xs px-1.5 py-0' : isMobile ? 'text-xs px-1.5 py-0' : ''}`}>
                      {formatTraitScore(trait.score)}/10
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={trait.score <= 1 ? trait.score * 100 : trait.score <= 10 ? trait.score * 10 : trait.score}
                  className="h-2"
                  indicatorClassName="bg-primary"
                />
                <p className={`${isVerySmallScreen ? 'text-2xs' : isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{trait.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No trait data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TraitsCard;
