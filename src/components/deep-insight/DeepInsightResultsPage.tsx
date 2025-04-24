
import React, { useState, useEffect } from "react";
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
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  const [autoRetryCount, setAutoRetryCount] = useState<number>(0);
  
  // Auto-retry for incomplete analysis
  useEffect(() => {
    // Clear any existing timeout when component unmounts or analysis changes
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  // Setup auto-retry if analysis exists but is incomplete
  useEffect(() => {
    if (loading || !analysis || autoRetryCount >= 3) return;
    
    // Check for incomplete analysis that needs auto-retry
    const needsAutoRetry = 
      analysis && 
      (!analysis.overview || 
        analysis.overview.includes("preliminary") ||
        analysis.overview.includes("processing") || 
        !analysis.core_traits?.primary ||
        analysis.error_occurred);
        
    if (needsAutoRetry && autoRetryCount < 3) {
      const timeout = setTimeout(() => {
        console.log(`Auto-retrying analysis fetch (attempt ${autoRetryCount + 1}/3)...`);
        setAutoRetryCount(prev => prev + 1);
        fetchAnalysis();
      }, 5000 * (autoRetryCount + 1)); // Gradually increase delay
      
      setRetryTimeout(timeout);
    }
  }, [analysis, loading, autoRetryCount, fetchAnalysis]);

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

  if (error && !analysis) {
    return <AnalysisErrorState error={error} onRetry={handleManualRetry} />;
  }
  
  // Handle partial analysis with error
  if (error && analysis) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <DeepInsightHeader />
          <AnalysisProcessingState 
            error={error}
            isRetrying={isRetrying}
            onRetry={handleManualRetry}
            analysis={analysis}
          />
        </div>
      </PageTransition>
    );
  }

  // Additional validation for incomplete analysis
  const isAnalysisIncomplete = analysis && 
     (!analysis.overview || 
      analysis.overview.includes("processing") || 
      analysis.overview.includes("preliminary") ||
      !analysis.core_traits || 
      (typeof analysis.core_traits === 'object' && 
       analysis.core_traits !== null &&
       (!('primary' in analysis.core_traits) || !analysis.core_traits.primary)));
  
  if (isAnalysisIncomplete) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <DeepInsightHeader />
          <AnalysisProcessingState 
            error="Your analysis is still being processed. Please check back in a few minutes or click 'Check Again' below."
            isRetrying={isRetrying}
            onRetry={handleManualRetry}
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
            <PersonalityOverview overview={analysis.overview || "Your Deep Insight Analysis reveals a multifaceted personality with unique cognitive patterns and emotional depths."} />
            
            <IntelligenceScores 
              intelligenceScore={analysis.intelligence_score}
              emotionalIntelligenceScore={analysis.emotional_intelligence_score}
            />
            
            <AnalysisInsights analysis={analysis} />
            
            <DeepInsightTabs analysis={analysis} />
            
            <AnalysisActions analysis={analysis} />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
