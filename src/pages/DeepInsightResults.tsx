
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDeepInsightResults } from "@/features/deep-insight/hooks/useDeepInsightResults";
import { ResultsLoading } from "@/features/deep-insight/components/ResultsLoading";
import { ResultsError } from "@/features/deep-insight/components/ResultsError";
import { ResultsHeader } from "@/features/deep-insight/components/ResultsHeader";
import { PersonalOverviewCard } from "@/features/deep-insight/components/PersonalOverviewCard";
import { ResultsTabs } from "@/features/deep-insight/components/ResultsTabs";
import { StrengthsChallengesCards } from "@/features/deep-insight/components/StrengthsChallengesCards";
import { ResultsActions } from "@/features/deep-insight/components/ResultsActions";
import PersonalityTraitsChart from "@/features/deep-insight/components/visualization/PersonalityTraitsChart";
import ResponsePatternChart from "@/features/deep-insight/components/visualization/ResponsePatternChart";
import CognitiveStrengthsChart from "@/features/deep-insight/components/visualization/CognitiveStrengthsChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartBar, PieChart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Result component
const DeepInsightResults: React.FC = () => {
  const { analysis, isLoading, error, saveAnalysis, retryAnalysis } = useDeepInsightResults();
  const navigate = useNavigate();
  
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
  
  // Handle retry by reloading the page or using the retryAnalysis function
  const handleRetry = () => {
    if (retryAnalysis) {
      retryAnalysis();
    } else {
      window.location.reload();
    }
  };
  
  if (isLoading) {
    return <ResultsLoading onRetry={handleRetry} />;
  }
  
  if (error || !analysis) {
    return <ResultsError 
      error={error?.message || "No analysis data found"} 
      onRetry={handleRetry} 
    />;
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
        
        {/* Visualizations Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <h2 className="text-2xl font-bold mb-4">Visualized Insights</h2>
          
          <Tabs defaultValue="traits" className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="traits" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                <span>Personality Traits</span>
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>Response Patterns</span>
              </TabsTrigger>
              <TabsTrigger value="cognitive" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Cognitive Profile</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="traits" className="mt-0">
              <PersonalityTraitsChart traits={analysis.traits} />
            </TabsContent>
            
            <TabsContent value="patterns" className="mt-0">
              <ResponsePatternChart patternData={analysis.responsePatterns} />
            </TabsContent>
            
            <TabsContent value="cognitive" className="mt-0">
              <CognitiveStrengthsChart analysis={analysis} />
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Detailed Analysis Tabs */}
        <ResultsTabs analysis={analysis} itemVariants={itemVariants} />
        
        {/* Strengths and Challenges */}
        <StrengthsChallengesCards analysis={analysis} itemVariants={itemVariants} />
        
        {/* Actions */}
        <ResultsActions onSave={saveAnalysis} itemVariants={itemVariants} analysis={analysis} />
      </div>
    </motion.div>
  );
};

export default DeepInsightResults;
