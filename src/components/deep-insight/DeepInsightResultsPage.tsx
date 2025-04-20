
import React, { useState, useEffect } from "react";
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
  const [retryCount, setRetryCount] = useState<number>(0);
  const [retryInterval, setRetryInterval] = useState<number | null>(null);
  
  // Auto-retry mechanism for in-progress analyses
  useEffect(() => {
    // If analysis is processing and we haven't exceeded retry limits
    if (analysis && error && error.includes("processing") && retryCount < 5) {
      const interval = window.setTimeout(() => {
        console.log(`Auto-retrying analysis fetch (attempt ${retryCount + 1})...`);
        fetchAnalysis()
          .then(() => {
            console.log("Auto-retry completed");
          })
          .catch(err => {
            console.error("Auto-retry failed:", err);
          })
          .finally(() => {
            setRetryCount(prev => prev + 1);
          });
      }, 10000); // Wait 10 seconds between retries
      
      setRetryInterval(interval);
      
      return () => {
        if (retryInterval) {
          window.clearTimeout(retryInterval);
        }
      };
    }
    
    // Clear interval if processing completes or we hit retry limit
    return () => {
      if (retryInterval) {
        window.clearTimeout(retryInterval);
      }
    };
  }, [analysis, error, retryCount, fetchAnalysis]);
  
  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    try {
      toast.info("Retrying analysis fetch...");
      await fetchAnalysis();
      toast.success("Analysis refreshed!");
    } catch (err) {
      toast.error("Failed to refresh analysis");
      console.error("Manual retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading) {
    return <AnalysisLoadingState />;
  }

  if (error && !analysis) {
    return <AnalysisErrorState error={error} onRetry={handleRetry} isRetrying={isRetrying} />;
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
            
            {analysis.core_traits && (
              <TopTraitsSection coreTraits={analysis.core_traits} />
            )}
            
            <DeepInsightTabs analysis={analysis} />
            
            <AnalysisActions analysis={analysis} />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
