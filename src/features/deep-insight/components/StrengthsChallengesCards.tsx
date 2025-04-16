import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AnalysisData } from "../utils/analysis/analysisGenerator";
import { CircleStar, Rocket, XCircle, Briefcase } from "lucide-react";

interface StrengthsChallengesCardsProps {
  analysis: AnalysisData;
  itemVariants: any;
}

export const StrengthsChallengesCards: React.FC<StrengthsChallengesCardsProps> = ({ analysis, itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={5}
      className="space-y-6"
    >
      {/* Core Strengths and Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleStar className="h-5 w-5 text-primary" />
              Core Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysis.coreTraits.strengths.map((strength: string, i: number) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-primary" />
              Growth Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysis.coreTraits.challenges.map((challenge: string, i: number) => (
                <li key={i}>{challenge}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Motivators and Inhibitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Key Motivators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysis.motivators.slice(0, 5).map((motivator: string, i: number) => (
                <li key={i}>{motivator}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-primary" />
              Potential Inhibitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysis.inhibitors.slice(0, 5).map((inhibitor: string, i: number) => (
                <li key={i}>{inhibitor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Career Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Career Path Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {analysis.careerSuggestions.map((career: string, i: number) => (
              <div 
                key={i}
                className="bg-secondary/10 p-3 rounded-md flex items-center"
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs text-primary">
                  {i + 1}
                </div>
                <span className="text-sm">{career}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
