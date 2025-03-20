
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from "lucide-react";
import TopTraitsTable from "./TopTraitsTable";

interface TraitsCardProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const TraitsCard: React.FC<TraitsCardProps> = ({ analysis, itemVariants }) => (
  <motion.div variants={itemVariants}>
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" /> Your Top 10 Personality Traits
        </CardTitle>
        <CardDescription>Based on your assessment results</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <TopTraitsTable traits={analysis.traits.slice(0, 10)} />
      </CardContent>
    </Card>
  </motion.div>
);

export default TraitsCard;
