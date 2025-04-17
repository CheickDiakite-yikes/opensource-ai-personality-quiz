
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
  // Safely extract strengths and challenges with proper fallbacks
  const extractStrengths = (): string[] => {
    // Check for coreTraits.strengths array first
    if (analysis.coreTraits?.strengths && Array.isArray(analysis.coreTraits.strengths)) {
      return analysis.coreTraits.strengths;
    }
    
    // Extract strengths from traits if available
    if (Array.isArray(analysis.traits)) {
      const traitStrengths = analysis.traits
        .filter(trait => trait && typeof trait === 'object')
        .map(trait => trait.strengths?.[0])
        .filter(Boolean) as string[];
        
      if (traitStrengths.length > 0) {
        return traitStrengths;
      }
    }
    
    // Return default if no strengths found
    return ["Analytical thinking", "Problem-solving", "Attention to detail"];
  };
  
  const extractChallenges = (): string[] => {
    // Check for coreTraits.challenges array first
    if (analysis.coreTraits?.challenges && Array.isArray(analysis.coreTraits.challenges)) {
      return analysis.coreTraits.challenges;
    }
    
    // Check for weaknesses array
    if (Array.isArray(analysis.weaknesses)) {
      return analysis.weaknesses;
    }
    
    // Return default if no challenges found
    return ["May overthink decisions", "Could struggle with ambiguity", "Balancing logic and emotion"];
  };
  
  const extractRecommendations = (): string[] => {
    // Combine recommendations from multiple sources with proper checks
    const growthPotentialRecs = Array.isArray(analysis.growthPotential?.recommendations) 
      ? analysis.growthPotential.recommendations
      : [];
      
    const growthAreas = Array.isArray(analysis.growthAreas)
      ? analysis.growthAreas
      : [];
      
    // Combine all valid recommendations
    const allRecs = [...growthPotentialRecs, ...growthAreas].filter(Boolean);
    
    // Return combined recommendations or default
    return allRecs.length > 0 
      ? allRecs
      : ["Practice mindfulness techniques", "Seek diverse perspectives", "Balance analytical thinking with intuition"];
  };

  // Process the data
  const strengths = extractStrengths();
  const challenges = extractChallenges();
  const recommendations = extractRecommendations();

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
                <span>{typeof strength === 'string' ? strength : String(strength)}</span>
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
                <span>{typeof challenge === 'string' ? challenge : String(challenge)}</span>
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
                <span>{typeof recommendation === 'string' ? recommendation : String(recommendation)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};
