
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
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
import { ChartBar, PieChart, Activity, ArrowLeft } from "lucide-react";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { PersonalityAnalysis } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Result component
const DeepInsightResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analysis: latestAnalysis, loading: latestLoading, error: latestError, saveAnalysis } = useDeepInsightResults();
  const { getAnalysisById, isLoading: analysisLoading } = useAIAnalysis();
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // If we have an ID, fetch that specific analysis
  useEffect(() => {
    const loadAnalysis = async () => {
      if (id) {
        try {
          setLoading(true);
          console.log(`Loading Deep Insight analysis with ID: ${id}`);
          const specificAnalysis = await getAnalysisById(id);
          
          if (specificAnalysis) {
            console.log(`Successfully loaded analysis: ${specificAnalysis.id}`);
            setAnalysis(specificAnalysis);
            setError(null);
          } else {
            console.error(`Analysis with ID ${id} not found`);
            setError(`Analysis with ID ${id} not found`);
            toast.error("Could not find the requested analysis", {
              description: "Please try a different analysis or take a new assessment"
            });
          }
        } catch (err) {
          console.error("Error loading analysis by ID:", err);
          setError(err instanceof Error ? err.message : "Failed to load analysis");
          toast.error("Error loading analysis", {
            description: "Please try again later"
          });
        } finally {
          setLoading(false);
        }
      } else if (latestAnalysis) {
        // If no ID is provided, use the latest analysis
        setAnalysis(latestAnalysis);
        setLoading(false);
        setError(null);
      }
    };

    loadAnalysis();
  }, [id, getAnalysisById, latestAnalysis]);
  
  // Use either the specific analysis (if ID provided) or the latest analysis
  const displayLoading = loading || (latestLoading && !id);
  const displayError = error || (!id && latestError);
  const displayAnalysis = analysis || (!id && latestAnalysis);
  
  if (displayLoading) {
    return <ResultsLoading />;
  }
  
  if (displayError || !displayAnalysis) {
    return <ResultsError error={displayError || "No analysis data found"} />;
  }

  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-8">
        {/* Back button when viewing a specific analysis */}
        {id && (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => navigate('/deep-insight')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Deep Insight
            </Button>
            
            <div className="ml-auto text-sm text-muted-foreground">
              {new Date(displayAnalysis.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
        
        <ResultsHeader />
        
        {/* Personal Overview */}
        <PersonalOverviewCard analysis={displayAnalysis} itemVariants={itemVariants} />
        
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
              <PersonalityTraitsChart traits={displayAnalysis.traits} />
            </TabsContent>
            
            <TabsContent value="patterns" className="mt-0">
              {displayAnalysis.responsePatterns ? (
                <ResponsePatternChart patternData={displayAnalysis.responsePatterns} />
              ) : (
                <div className="text-center p-6 bg-muted/20 rounded-md">
                  <p>Response pattern data is not available for this analysis.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cognitive" className="mt-0">
              <CognitiveStrengthsChart analysis={displayAnalysis} />
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Detailed Analysis Tabs */}
        <ResultsTabs analysis={displayAnalysis} itemVariants={itemVariants} />
        
        {/* Strengths and Challenges */}
        <StrengthsChallengesCards analysis={displayAnalysis} itemVariants={itemVariants} />
        
        {/* Actions - Only show save button for latest analysis, not historical ones */}
        {!id && <ResultsActions onSave={saveAnalysis} itemVariants={itemVariants} />}
      </div>
    </motion.div>
  );
};

export default DeepInsightResults;
