
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageTransition from "@/components/ui/PageTransition";
import DeepInsightHeader from "./components/DeepInsightHeader";
import PersonalityOverview from "./components/PersonalityOverview";
import AnalysisScores from "./components/AnalysisScores";
import DeepInsightTabs from "./components/DeepInsightTabs";
import AnalysisActions from "./components/AnalysisActions";
import TopTraitsSection from "./results-sections/TopTraitsSection";
import AnalysisLoadingState from "./components/AnalysisLoadingState";
import AnalysisErrorState from "./components/AnalysisErrorState";
import AnalysisProcessingState from "./components/AnalysisProcessingState";
import { useAnalysisFetching } from "./hooks/useAnalysisFetching";

const DeepInsightResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysis, loading, error, fetchAnalysis } = useAnalysisFetching();
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      toast.info("Retrying analysis fetch...");
      await fetchAnalysis();
      toast.success("Analysis refreshed!");
    } catch (err) {
      toast.error("Failed to refresh analysis");
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading) {
    return <AnalysisLoadingState />;
  }

  if (error && !analysis) {
    return <AnalysisErrorState error={error} />;
  }
  
  // Show partial analysis with an error message
  if (error && analysis) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <DeepInsightHeader />
          <AnalysisProcessingState 
            error={error}
            isRetrying={isRetrying}
            onRetry={handleRetry}
            analysis={analysis}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
        <DeepInsightHeader />
        
        {analysis && (
          <>
            <PersonalityOverview overview={analysis.overview || ""} />
            
            <AnalysisScores 
              intelligenceScore={analysis.intelligence_score}
              emotionalIntelligenceScore={analysis.emotional_intelligence_score}
              responsePatterns={analysis.response_patterns}
            />
            
            <TopTraitsSection coreTraits={analysis.core_traits} />
            
            <DeepInsightTabs analysis={analysis} />
            
            <AnalysisActions analysis={analysis} />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
