
import React from "react";
import { motion } from "framer-motion";
import { useDeepInsightResults } from "@/features/deep-insight/hooks/useDeepInsightResults";
import { ResultsLoading } from "@/features/deep-insight/components/ResultsLoading";
import { ResultsError } from "@/features/deep-insight/components/ResultsError";
import { ResultsHeader } from "@/features/deep-insight/components/ResultsHeader";
import { PersonalOverviewCard } from "@/features/deep-insight/components/PersonalOverviewCard";
import { ResultsTabs } from "@/features/deep-insight/components/ResultsTabs";
import { StrengthsChallengesCards } from "@/features/deep-insight/components/StrengthsChallengesCards";
import { ResultsActions } from "@/features/deep-insight/components/ResultsActions";

// Result component
const DeepInsightResults: React.FC = () => {
  const { analysis, loading, error, saveAnalysis } = useDeepInsightResults();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  if (loading) {
    return <ResultsLoading />;
  }
  
  if (error || !analysis) {
    return <ResultsError error={error || "No analysis data found"} />;
  }
  
  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-8">
        <ResultsHeader />
        
        {/* Personal Overview */}
        <PersonalOverviewCard analysis={analysis} itemVariants={itemVariants} />
        
        {/* Detailed Analysis Tabs */}
        <ResultsTabs analysis={analysis} itemVariants={itemVariants} />
        
        {/* Strengths and Challenges */}
        <StrengthsChallengesCards analysis={analysis} itemVariants={itemVariants} />
        
        {/* Actions */}
        <ResultsActions onSave={saveAnalysis} itemVariants={itemVariants} />
      </div>
    </motion.div>
  );
};

export default DeepInsightResults;
