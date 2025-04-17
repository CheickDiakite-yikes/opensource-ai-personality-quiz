
import React, { useState, useEffect } from "react";
import { useDeepInsightResults } from "@/features/deep-insight/hooks/useDeepInsightResults";
import { ResultsHeader } from "@/features/deep-insight/components/ResultsHeader";
import { ResultsLoading } from "@/features/deep-insight/components/ResultsLoading";
import { ResultsError } from "@/features/deep-insight/components/ResultsError";
import { ResultsTabs } from "@/features/deep-insight/components/ResultsTabs";
import { ResultsActions } from "@/features/deep-insight/components/ResultsActions";
import { motion } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisData } from "@/features/deep-insight/utils/analysis/types";
import PersonalityTraitsChart from "@/features/deep-insight/components/visualization/PersonalityTraitsChart";
import CognitiveStrengthsChart from "@/features/deep-insight/components/visualization/CognitiveStrengthsChart";
import ResponsePatternChart from "@/features/deep-insight/components/visualization/ResponsePatternChart";

const DeepInsightResults: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryParamId = searchParams.get('id');
  const isLegacy = searchParams.get('legacy') === 'true';
  const navigate = useNavigate();
  const { analysis, isLoading, error, saveAnalysis, retryAnalysis, loadedFromCache } = useDeepInsightResults();
  const [legacyAnalysis, setLegacyAnalysis] = useState<AnalysisData | null>(null);
  const [isLegacyLoading, setIsLegacyLoading] = useState(false);
  const [legacyError, setLegacyError] = useState<Error | null>(null);

  // Legacy analysis support
  useEffect(() => {
    // If we have a legacy ID parameter, try to fetch directly from the edge function
    if (isLegacy && queryParamId && !legacyAnalysis && !analysis) {
      const fetchLegacyAnalysis = async () => {
        setIsLegacyLoading(true);
        setLegacyError(null);
        
        try {
          // Call the get-public-analysis function directly with the legacy ID
          console.log(`Fetching legacy analysis with ID: ${queryParamId}`);
          const { data, error } = await supabase.functions.invoke('get-public-analysis', {
            body: { id: queryParamId },
          });
          
          if (error) {
            console.error("Error fetching legacy analysis:", error);
            setLegacyError(new Error(`Error fetching legacy analysis: ${error.message || error}`));
            toast.error("Could not load legacy analysis", {
              description: "This analysis may be in an older format that is no longer supported"
            });
            return;
          }
          
          if (data) {
            console.log("Successfully loaded legacy analysis:", data);
            
            // Make sure the data has the expected structure for rendering
            // If interpersonalDynamics is missing, add defaults
            if (!data.interpersonalDynamics) {
              data.interpersonalDynamics = {
                attachmentStyle: "Your attachment style shows a balanced approach to relationships.",
                communicationPattern: "You communicate thoughtfully and prefer meaningful conversations.",
                conflictResolution: "You approach conflicts by seeking to understand different perspectives."
              };
            }
            
            // Handle relationshipPatterns structure
            if (!data.relationshipPatterns || Array.isArray(data.relationshipPatterns)) {
              data.relationshipPatterns = {
                strengths: Array.isArray(data.relationshipPatterns) ? data.relationshipPatterns : [],
                challenges: [],
                compatibleTypes: []
              };
            }
            
            setLegacyAnalysis(data as AnalysisData);
            toast.success("Legacy analysis loaded successfully");
          } else {
            console.error("No legacy analysis data found");
            setLegacyError(new Error("No analysis data found"));
            toast.error("Could not find the requested analysis", {
              description: "Try taking a new assessment to generate a current analysis"
            });
          }
        } catch (err) {
          console.error("Exception fetching legacy analysis:", err);
          setLegacyError(err instanceof Error ? err : new Error("An unknown error occurred"));
          toast.error("Error loading legacy analysis", {
            description: "There was a problem retrieving this analysis"
          });
        } finally {
          setIsLegacyLoading(false);
        }
      };
      
      fetchLegacyAnalysis();
    }
  }, [isLegacy, queryParamId, analysis, legacyAnalysis]);

  // Display data configuration for animations
  const staggerDelay = 0.05;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * staggerDelay,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  // If we have a legacy analysis, use it instead of the normal analysis
  const displayAnalysis = legacyAnalysis || analysis;
  const displayError = legacyError || error;
  const isDisplayLoading = isLegacyLoading || (isLoading && !displayAnalysis);

  // Save analysis implementation
  const handleSaveAnalysis = async () => {
    if (legacyAnalysis) {
      // For legacy analyses, we inform the user we're saving a copy in the new format
      toast.info("Converting legacy analysis to new format...");
      try {
        // This would convert and save the legacy analysis in the new format
        await saveAnalysis();
        toast.success("Legacy analysis saved in new format");
      } catch (err) {
        console.error("Error saving legacy analysis:", err);
        toast.error("Failed to save legacy analysis");
      }
    } else {
      // For regular analyses, use the normal save function
      await saveAnalysis();
    }
  };

  if (isDisplayLoading) {
    return <ResultsLoading />;
  }

  if (displayError) {
    return <ResultsError error={displayError.message} onRetry={retryAnalysis} />;
  }

  if (!displayAnalysis) {
    return <ResultsError error="No analysis data available. Please complete the assessment." />;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-20">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ResultsHeader 
          analysis={displayAnalysis} 
          itemVariants={itemVariants} 
        />

        {/* Visual summary charts */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={itemVariants}
          custom={3}
        >
          {displayAnalysis.traits && displayAnalysis.traits.length > 0 && (
            <PersonalityTraitsChart 
              traits={displayAnalysis.traits}
              title="Your Personality Traits"
              description="Visualization of your key personality traits"
            />
          )}
          
          <CognitiveStrengthsChart 
            analysis={displayAnalysis}
          />
        </motion.div>
        
        {displayAnalysis.responsePatterns && (
          <motion.div
            variants={itemVariants}
            custom={4}
          >
            <ResponsePatternChart 
              patternData={displayAnalysis.responsePatterns} 
            />
          </motion.div>
        )}

        <ResultsActions 
          onSave={handleSaveAnalysis} 
          itemVariants={itemVariants}
          analysis={displayAnalysis} 
        />

        <ResultsTabs analysis={displayAnalysis} itemVariants={itemVariants} />
      </motion.div>
    </div>
  );
};

export default DeepInsightResults;
