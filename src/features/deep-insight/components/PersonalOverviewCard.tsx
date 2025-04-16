
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnalysisData } from "../hooks/useDeepInsightResults";

interface PersonalOverviewCardProps {
  analysis: AnalysisData;
  itemVariants: any;
}

export const PersonalOverviewCard: React.FC<PersonalOverviewCardProps> = ({ analysis, itemVariants }) => {
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
        <CardContent>
          <p>{analysis.overview}</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
