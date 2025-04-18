
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChevronRight, ShieldCheck, ShieldAlert, GraduationCap, ArrowUpRight } from "lucide-react";
import { AnalysisData } from "../utils/analysis/types";

interface StrengthsChallengesCardsProps {
  analysis: AnalysisData;
  itemVariants: any;
}

export const StrengthsChallengesCards: React.FC<StrengthsChallengesCardsProps> = ({ analysis, itemVariants }) => {
  // Add safe fallbacks for potentially missing data
  const coreTraits = analysis.coreTraits || { strengths: [], challenges: [] };
  const growthPotential = analysis.growthPotential || { developmentAreas: [], recommendations: [] };
  
  // Check if there are any strengths or challenges
  const hasStrengths = coreTraits.strengths && coreTraits.strengths.length > 0;
  const hasChallenges = coreTraits.challenges && coreTraits.challenges.length > 0;
  const hasGrowthAreas = growthPotential.developmentAreas && growthPotential.developmentAreas.length > 0;
  const hasRecommendations = growthPotential.recommendations && growthPotential.recommendations.length > 0;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={6}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Strengths & Development Areas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
              Core Strengths
            </CardTitle>
            <CardDescription>Your key personality strengths from the assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {hasStrengths ? (
              <ul className="space-y-2">
                {coreTraits.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No strengths data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Challenges Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <ShieldAlert className="h-5 w-5 mr-2 text-amber-500" />
              Potential Challenges
            </CardTitle>
            <CardDescription>Areas where you might face some difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            {hasChallenges ? (
              <ul className="space-y-2">
                {coreTraits.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No challenges data available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth Areas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
              Growth Areas
            </CardTitle>
            <CardDescription>Key areas for personal development</CardDescription>
          </CardHeader>
          <CardContent>
            {hasGrowthAreas ? (
              <ul className="space-y-2">
                {growthPotential.developmentAreas.map((area, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No growth areas data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recommendations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <ArrowUpRight className="h-5 w-5 mr-2 text-purple-500" />
              Recommendations
            </CardTitle>
            <CardDescription>Suggested actions for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            {hasRecommendations ? (
              <ul className="space-y-2">
                {growthPotential.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No recommendations data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
