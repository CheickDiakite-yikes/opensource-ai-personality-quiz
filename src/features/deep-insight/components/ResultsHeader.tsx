
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnalysisData } from "../utils/analysis/types";

interface ResultsHeaderProps {
  analysis: AnalysisData;
  itemVariants: any;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({ analysis, itemVariants }) => {
  return (
    <header className="text-center">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/deep-insight">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Button>
        </Link>
      </div>
      
      <motion.div 
        className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4"
        variants={itemVariants}
        custom={0}
      >
        <Sparkles className="h-6 w-6" />
      </motion.div>
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-2"
        variants={itemVariants}
        custom={1}
      >
        Your Deep Insight Analysis
      </motion.h1>
      <motion.p 
        className="text-muted-foreground max-w-2xl mx-auto"
        variants={itemVariants}
        custom={2}
      >
        Based on your responses, we've created a comprehensive analysis of your personality,
        cognitive patterns, and potential growth areas.
      </motion.p>
    </header>
  );
};
