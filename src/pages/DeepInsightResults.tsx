
import React, { useEffect } from "react";
import { useDeepInsightResults } from "@/features/deep-insight/hooks/useDeepInsightResults";
import { ResultsLoadingState } from "@/features/deep-insight/components/results/ResultsLoadingState";
import { ResultsErrorState } from "@/features/deep-insight/components/results/ResultsErrorState";
import { ResultsHeader } from "@/features/deep-insight/components/ResultsHeader";
import { ResultsTabs } from "@/features/deep-insight/components/ResultsTabs";
import { ResultsActions } from "@/features/deep-insight/components/ResultsActions";
import { motion } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useLegacyAnalysis } from "@/features/deep-insight/hooks/results/useLegacyAnalysis";
import PersonalityTraitsChart from "@/features/deep-insight/components/visualization/PersonalityTraitsChart";
import CognitiveStrengthsChart from "@/features/deep-insight/components/visualization/CognitiveStrengthsChart";
import ResponsePatternChart from "@/features/deep-insight/components/visualization/ResponsePatternChart";

const DeepInsightResults: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryParamId = searchParams.get('id');
  const isLegacy = searchParams.get('legacy') === 'true';
  const isFresh = searchParams.get('fresh') === 'true';
  const navigate = useNavigate();
  
  const { analysis, isLoading, error, saveAnalysis, retryAnalysis, loadedFromCache } = useDeepInsightResults();
  const { legacyAnalysis, isLegacyLoading, legacyError } = useLegacyAnalysis(isLegacy, queryParamId);

  useEffect(() => {
    if (isFresh && loadedFromCache) {
      toast.info("Using newly generated analysis", {
        description: "Your analysis has been freshly generated based on your responses"
      });
    } else if (loadedFromCache) {
      toast.info("Using cached analysis", {
        description: "This is a previously generated analysis. For a fresh analysis, use the 'Refresh Analysis' option."
      });
    }
  }, [isFresh, loadedFromCache]);

  const handleRefreshAnalysis = () => {
    toast.info("Generating fresh analysis...");
    navigate("/deep-insight/results?fresh=true");
  };

  const displayAnalysis = legacyAnalysis || analysis;
  const displayError = legacyError || error;
  const isDisplayLoading = isLegacyLoading || (isLoading && !displayAnalysis);

  if (isDisplayLoading) {
    return <ResultsLoadingState />;
  }

  if (displayError) {
    return <ResultsErrorState error={displayError.message} onRetry={retryAnalysis} />;
  }

  if (!displayAnalysis) {
    return <ResultsErrorState error="No analysis data available. Please complete the assessment." onRetry={retryAnalysis} />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-20">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ResultsHeader analysis={displayAnalysis} itemVariants={itemVariants} />

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
          <CognitiveStrengthsChart analysis={displayAnalysis} />
        </motion.div>
        
        {displayAnalysis.responsePatterns && (
          <motion.div variants={itemVariants} custom={4}>
            <ResponsePatternChart patternData={displayAnalysis.responsePatterns} />
          </motion.div>
        )}

        <ResultsActions 
          onSave={saveAnalysis} 
          itemVariants={itemVariants}
          analysis={displayAnalysis}
          onRefresh={handleRefreshAnalysis}
          loadedFromCache={loadedFromCache}
        />

        <ResultsTabs analysis={displayAnalysis} itemVariants={itemVariants} />
      </motion.div>
    </div>
  );
};

export default DeepInsightResults;
