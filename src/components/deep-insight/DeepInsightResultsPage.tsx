
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageTransition from "@/components/ui/PageTransition";
import DeepInsightHeader from "./components/DeepInsightHeader";
import PersonalityOverview from "./components/PersonalityOverview";
import AnalysisInsights from "./components/AnalysisInsights";
import IntelligenceScores from "./components/IntelligenceScores";
import DeepInsightTabs from "./components/DeepInsightTabs";
import AnalysisActions from "./components/AnalysisActions";
import AnalysisLoadingState from "./components/AnalysisLoadingState";
import AnalysisErrorState from "./components/AnalysisErrorState";
import AnalysisProcessingState from "./components/AnalysisProcessingState";
import { useAnalysisFetching } from "./hooks/useAnalysisFetching";

const DeepInsightResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysis, loading, error, fetchAnalysis } = useAnalysisFetching();
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  
  const handleManualRetry = async () => {
    setIsRetrying(true);
    try {
      toast.loading("Refreshing your analysis...");
      await fetchAnalysis();
      toast.success("Analysis refreshed successfully!");
    } catch (err) {
      console.error("Error refreshing analysis:", err);
      toast.error("Failed to refresh analysis");
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading) {
    return <AnalysisLoadingState />;
  }

  // Check for errors without analysis data
  if (error && !analysis) {
    return <AnalysisErrorState error={error} onRetry={handleManualRetry} />;
  }
  
  // Handle case where we have analysis but also an error (partial results)
  // This error might come from the hook or from the complete_analysis field
  const hasError = error || (analysis?.complete_analysis?.error_occurred === true);
  
  // Check if we have incomplete data (some parts are missing)
  const isDataIncomplete = analysis && (!analysis.core_traits || 
                                       !analysis.cognitive_patterning || 
                                       !analysis.emotional_architecture || 
                                       !analysis.interpersonal_dynamics ||
                                       !analysis.growth_potential);
                                       
  // Check if we're in a processing state
  const isProcessing = analysis?.complete_analysis?.status === 'processing' || isDataIncomplete;
  
  if ((hasError || isProcessing) && analysis) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <DeepInsightHeader />
          <AnalysisProcessingState 
            error={error || (analysis.complete_analysis?.error_message || isProcessing ? "Your analysis is still being processed" : "Processing incomplete")}
            isRetrying={isRetrying}
            onRetry={handleManualRetry}
            analysis={analysis}
          />
        </div>
      </PageTransition>
    );
  }

  // No results found
  if (!analysis) {
    return (
      <AnalysisErrorState 
        error="No analysis results found. Please complete the assessment first." 
        onRetry={() => navigate('/deep-insight')}
      />
    );
  }

  // All good, show complete results
  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
        <DeepInsightHeader />
        
        <PersonalityOverview overview={analysis.overview || ""} />
        
        <IntelligenceScores 
          intelligenceScore={analysis.intelligence_score}
          emotionalIntelligenceScore={analysis.emotional_intelligence_score}
        />
        
        <AnalysisInsights analysis={analysis} />
        
        <DeepInsightTabs analysis={analysis} />
        
        <AnalysisActions analysis={analysis} />
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
