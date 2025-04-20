
import React, { useEffect, useState } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DeepInsightAnalysis } from "../types/deepInsight";
import PersonalityOverview from "./PersonalityOverview";
import AnalysisScores from "./AnalysisScores";
import TopTraitsSection from "../results-sections/TopTraitsSection";
import DeepInsightTabs from "./DeepInsightTabs";
import AnalysisActions from "./AnalysisActions";
import { toast } from "sonner";

interface AnalysisProcessingStateProps {
  error: string;
  isRetrying: boolean;
  onRetry: () => void;
  analysis: DeepInsightAnalysis;
}

const AnalysisProcessingState: React.FC<AnalysisProcessingStateProps> = ({
  error,
  isRetrying,
  onRetry,
  analysis,
}) => {
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  
  // Auto-retry up to 3 times, every 30 seconds
  useEffect(() => {
    if (autoRetryCount < 3 && !isRetrying) {
      const timer = setTimeout(() => {
        console.log(`Auto-retrying analysis fetch (attempt ${autoRetryCount + 1}/3)`);
        onRetry();
        setAutoRetryCount(prev => prev + 1);
      }, 30000); // 30 seconds
      
      return () => clearTimeout(timer);
    }
    
    // If we've reached max auto-retries, show a notification
    if (autoRetryCount === 3) {
      toast.info("We're still processing your analysis", {
        description: "It's taking longer than expected. You can manually check for updates.",
        duration: 8000
      });
    }
  }, [autoRetryCount, isRetrying, onRetry]);

  return (
    <>
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Processing Status</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry} 
              disabled={isRetrying}
              className="flex items-center gap-2"
            >
              {isRetrying ? "Checking..." : "Check Again"}
              <RefreshCcw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
            </Button>
            {autoRetryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Auto-checking {autoRetryCount}/3 completed. {autoRetryCount === 3 ? 'You can continue to check manually.' : 'Checking again soon...'}
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>
      
      {analysis && (
        <>
          <PersonalityOverview overview={analysis.overview || "Your complete analysis is still being generated. We'll display your full results when they're ready."} />
          
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
    </>
  );
};

export default AnalysisProcessingState;
