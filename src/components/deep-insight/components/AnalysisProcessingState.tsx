
import React from "react";
import { AlertTriangle, RefreshCcw, Database, ToggleLeft, ToggleRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DeepInsightAnalysis } from "../types/deepInsight";
import PersonalityOverview from "./PersonalityOverview";
import AnalysisScores from "./AnalysisScores";
import TopTraitsSection from "../results-sections/TopTraitsSection";
import DeepInsightTabs from "./DeepInsightTabs";
import AnalysisActions from "./AnalysisActions";

interface AnalysisProcessingStateProps {
  error: string;
  isRetrying: boolean;
  onRetry: () => void;
  analysis: DeepInsightAnalysis;
  onDirectFetch?: () => void;
  autoRetryEnabled?: boolean;
  onToggleAutoRetry?: () => void;
  retryCount?: number;
}

const AnalysisProcessingState: React.FC<AnalysisProcessingStateProps> = ({
  error,
  isRetrying,
  onRetry,
  analysis,
  onDirectFetch,
  autoRetryEnabled = false,
  onToggleAutoRetry,
  retryCount = 0,
}) => {
  return (
    <>
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Processing Status</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error}</p>
          
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground">
              Automatic retry attempt: {retryCount}/5
            </p>
          )}
          
          <div className="mt-2 space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry} 
              disabled={isRetrying}
              className="flex items-center gap-2 mr-2"
            >
              {isRetrying ? "Checking..." : "Check Again"}
              <RefreshCcw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
            </Button>
            
            {onDirectFetch && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onDirectFetch} 
                disabled={isRetrying}
                className="flex items-center gap-2"
              >
                Direct Database Check
                <Database className="h-3 w-3" />
              </Button>
            )}
            
            {onToggleAutoRetry && (
              <div className="flex items-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleAutoRetry}
                  className="flex items-center gap-2 text-xs"
                >
                  {autoRetryEnabled ? (
                    <>
                      <ToggleRight className="h-3 w-3 text-green-500" />
                      Auto-retry enabled
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-3 w-3" />
                      Auto-retry disabled
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
      
      {analysis && (
        <>
          <PersonalityOverview overview={analysis.overview || "Your Deep Insight analysis is still processing. We'll display your complete results as soon as they're ready."} />
          
          <AnalysisScores 
            intelligenceScore={analysis.intelligence_score}
            emotionalIntelligenceScore={analysis.emotional_intelligence_score}
            responsePatterns={analysis.response_patterns}
          />
          
          {analysis.core_traits && Object.keys(analysis.core_traits).length > 0 && (
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
