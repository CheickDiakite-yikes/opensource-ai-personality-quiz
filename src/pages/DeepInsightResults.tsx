
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
import { ChartBar, PieChart, Activity, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AssessmentErrorHandler } from "@/components/assessment/AssessmentErrorHandler";

// Result component
const DeepInsightResults: React.FC = () => {
  const { 
    analysis, 
    isLoading, 
    error, 
    saveAnalysis, 
    retryAnalysis,
    loadedFromCache 
  } = useDeepInsightResults();
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
  
  // Show notification when using cached analysis
  useEffect(() => {
    if (loadedFromCache && analysis) {
      toast.info("Using cached analysis results", {
        description: "Your previous analysis results have been loaded from cache",
        duration: 5000
      });
    }
  }, [loadedFromCache, analysis]);
  
  // Handle retry by using the retryAnalysis function
  const handleRetry = () => {
    if (retryAnalysis) {
      toast.loading("Retrying analysis generation one more time...");
      retryAnalysis();
    } else {
      toast.loading("Reloading analysis...");
      // Use location.reload() rather than window.location.reload() to reset state completely
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };
  
  if (isLoading) {
    return <ResultsLoading onRetry={handleRetry} />;
  }
  
  if (error || !analysis) {
    return (
      <ResultsError 
        error={error?.message || "No analysis data found"} 
        onRetry={handleRetry} 
      />
    );
  }
  
  // Last resort error handling if analysis is malformed
  const isAnalysisComplete = 
    analysis && 
    analysis.traits && 
    analysis.traits.length > 0 && 
    analysis.overview && 
    analysis.coreTraits;
    
  if (!isAnalysisComplete) {
    return (
      <div className="container max-w-4xl py-8">
        <AssessmentErrorHandler
          title="Incomplete Analysis Data"
          description="The analysis was generated but appears to be incomplete. This can sometimes happen due to processing errors."
          showRetry={true}
          onRetry={handleRetry}
          errorDetails={`Analysis ID: ${analysis?.id || 'unknown'}, Missing data: ${!analysis?.traits ? 'traits' : ''} ${!analysis?.overview ? 'overview' : ''} ${!analysis?.coreTraits ? 'coreTraits' : ''}`}
        />
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate("/deep-insight/quiz")}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retake Assessment
          </Button>
        </div>
      </div>
    );
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
