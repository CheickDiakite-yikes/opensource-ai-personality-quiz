
import React from "react";
import { AlertTriangle, RefreshCcw, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DeepInsightAnalysis } from "../types/deepInsight";
import PersonalityOverview from "./PersonalityOverview";
import AnalysisScores from "./AnalysisScores";
import TopTraitsSection from "../results-sections/TopTraitsSection";
import DeepInsightTabs from "./DeepInsightTabs";
import AnalysisActions from "./AnalysisActions";
import { Progress } from "@/components/ui/progress";

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
  // Check if we're in a processing state or an error state
  const isProcessing = !error || error.toLowerCase().includes('still being processed') || error.toLowerCase().includes('processing');
  
  // Determine alert variant
  const alertVariant = isProcessing ? "default" : "warning";
  
  // Friendly message about what's happening
  const processingMessage = isProcessing 
    ? "Your deep insight analysis is still being processed. This may take a few minutes as our AI system generates comprehensive insights from your responses."
    : error;

  return (
    <>
      <Alert variant={alertVariant} className="mb-6">
        {isProcessing ? (
          <Clock className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        <AlertTitle>{isProcessing ? "Processing Your Analysis" : "Processing Status"}</AlertTitle>
        <AlertDescription>
          <div className="space-y-2">
            <p>{processingMessage}</p>
            {isProcessing && (
              <div className="mt-2">
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll refresh automatically when your results are ready.
                </p>
              </div>
            )}
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry} 
                disabled={isRetrying}
                className="flex items-center gap-2"
              >
                {isRetrying ? "Checking..." : "Check Status Now"}
                <RefreshCcw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
              </Button>
            </div>
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
