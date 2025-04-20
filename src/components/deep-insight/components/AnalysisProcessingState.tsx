import React from "react";
import { AlertTriangle, RefreshCcw, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DeepInsightAnalysis } from "../types/deepInsight";
import PersonalityOverview from "./PersonalityOverview";
import AnalysisScores from "./AnalysisScores";
import TopTraitsSection from "../results-sections/TopTraitsSection";
import DeepInsightTabs from "./DeepInsightTabs";
import AnalysisActions from "./AnalysisActions";
import { useDeepInsightState } from "../hooks/useDeepInsightState";
import { getDeepInsightQuestions } from "@/utils/deep-insight/questionBank";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { resetResponses } = useDeepInsightState(getDeepInsightQuestions(100));

  const handleReset = () => {
    resetResponses();
    navigate("/deep-insight");
  };

  // Format error message to be more user-friendly
  const formatErrorMessage = (error: string): string => {
    if (!error) return "Still generating your analysis...";
    
    let message = error;
    
    // Check for timeout-related errors
    if (message.includes("timeout") || message.includes("too long") || message.includes("taking longer")) {
      return "Your analysis is complex and taking longer than expected. We're working on it! You can see the partial results below while waiting.";
    }
    
    // Check for model-related errors
    if (message.includes("model")) {
      return "We're optimizing your analysis with an alternative AI model. This may take a few moments longer.";
    }
    
    // Keep the message short and user-friendly
    if (message.length > 120) {
      message = message.substring(0, 120) + "...";
    }
    
    return message;
  };

  return (
    <>
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Processing Status</AlertTitle>
        <AlertDescription>
          {formatErrorMessage(error)}
          <div className="mt-2 space-x-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              Start Fresh
              <RefreshCw className="h-3 w-3" />
            </Button>
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
