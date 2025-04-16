
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { AnalysisData } from "../utils/analysisGenerator";

interface PersonalOverviewCardProps {
  analysis: AnalysisData;
  itemVariants: any;
}

export const PersonalOverviewCard: React.FC<PersonalOverviewCardProps> = ({ analysis, itemVariants }) => {
  const [expanded, setExpanded] = React.useState(false);

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
          <p>{analysis.overview}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary/20 p-4 rounded-md">
              <h3 className="font-semibold mb-2 flex items-center">
                <div className="bg-primary/20 p-1.5 rounded-full mr-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                Primary Type
              </h3>
              <p>{analysis.coreTraits.primary}</p>
            </div>
            
            <div className="bg-secondary/20 p-4 rounded-md">
              <h3 className="font-semibold mb-2 flex items-center">
                <div className="bg-primary/20 p-1.5 rounded-full mr-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                Secondary Type
              </h3>
              <p>{analysis.coreTraits.secondary}</p>
            </div>
            
            <div className="bg-secondary/20 p-4 rounded-md">
              <h3 className="font-semibold mb-2 flex items-center">
                <div className="bg-primary/20 p-1.5 rounded-full mr-2">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                Intelligence Score
              </h3>
              <div className="flex justify-between">
                <span>Cognitive: {analysis.intelligenceScore}</span>
                <span>Emotional: {analysis.emotionalIntelligenceScore}</span>
              </div>
            </div>
          </div>
          
          {/* Top Personality Traits Section */}
          <div>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full py-2 text-left font-medium border-b"
            >
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-primary" />
                <span>Top Personality Traits</span>
              </div>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expanded && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 animate-in fade-in">
                {analysis.traits.slice(0, 9).map((trait, index) => (
                  <div key={index} className="bg-secondary/10 p-2 rounded-md">
                    <div className="font-medium flex items-center">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs text-primary">
                        {index + 1}
                      </div>
                      {trait.trait}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{trait.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
