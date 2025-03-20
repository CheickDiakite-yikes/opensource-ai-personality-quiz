
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface GrowthPathwayCardProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const GrowthPathwayCard: React.FC<GrowthPathwayCardProps> = ({ analysis, itemVariants }) => (
  <motion.div variants={itemVariants}>
    <Card className="overflow-hidden gradient-border">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Your Growth Pathway
        </CardTitle>
        <CardDescription>Personalized development opportunities</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="italic text-muted-foreground border-l-4 border-primary/30 pl-4 py-2">
            "{analysis.roadmap.split('.')[0]}."
          </p>
          
          <h4 className="font-semibold mt-4">Recommended Learning Pathways:</h4>
          <ul className="space-y-2">
            {analysis.learningPathways.slice(0, 3).map((pathway, index) => (
              <li key={index} className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3 mt-0.5">
                  {index + 1}
                </div>
                <span>{pathway}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default GrowthPathwayCard;
