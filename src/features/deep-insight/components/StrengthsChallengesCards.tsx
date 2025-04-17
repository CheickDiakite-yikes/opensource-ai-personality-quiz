
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { CheckCircle2, XCircle, ArrowUpRight } from "lucide-react";

interface StrengthsChallengesCardsProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

export const StrengthsChallengesCards: React.FC<StrengthsChallengesCardsProps> = ({ analysis, itemVariants }) => {
  // Properly extract strengths and challenges, ensuring they are arrays
  const strengths = Array.isArray(analysis.coreTraits?.strengths) 
    ? analysis.coreTraits?.strengths 
    : (Array.isArray(analysis.traits) 
      ? analysis.traits.map(trait => trait.strengths?.[0]).filter(Boolean)
      : []);
  
  const challenges = Array.isArray(analysis.coreTraits?.challenges) 
    ? analysis.coreTraits?.challenges 
    : (Array.isArray(analysis.weaknesses) ? analysis.weaknesses : []);
  
  // Get recommendations, ensuring they're an array
  const growthPotentialRecs = Array.isArray(analysis.growthPotential?.recommendations) 
    ? analysis.growthPotential?.recommendations 
    : [];
  
  const growthAreas = Array.isArray(analysis.growthAreas) 
    ? analysis.growthAreas 
    : [];
  
  // Combine recommendations from both sources, ensuring we have an array
  const recommendations = [...growthPotentialRecs, ...growthAreas].filter(Boolean);

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={5}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-xl">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <div className="h-6 w-6 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <span>{String(strength)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-xl">
            <XCircle className="h-5 w-5 text-orange-500 mr-2" />
            Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {challenges.map((challenge, index) => (
              <li key={index} className="flex items-start">
                <div className="h-6 w-6 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                </div>
                <span>{String(challenge)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-xl">
            <ArrowUpRight className="h-5 w-5 text-blue-500 mr-2" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <div className="h-6 w-6 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <span>{String(recommendation)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};
