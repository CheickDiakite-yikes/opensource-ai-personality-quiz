
import React from "react";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import ProfileStats from "./ProfileStats";

interface InsightsCardProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ analysis, itemVariants }) => (
  <motion.div variants={itemVariants}>
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle className="flex items-center">
          <ChartBar className="h-5 w-5 mr-2 text-primary" /> Key Insights & Stats
        </CardTitle>
        <CardDescription>A deeper look at your personality metrics</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ProfileStats analysis={analysis} />
      </CardContent>
    </Card>
  </motion.div>
);

export default InsightsCard;
