
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
  const navigate = useNavigate();
  const { resetResponses } = useDeepInsightState(getDeepInsightQuestions(100));

  const handleReset = () => {
    resetResponses();
    toast.info("Starting a fresh assessment");
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

  // Ensure core_traits exists with required properties
  const ensureTraits = () => {
    let traits = analysis.core_traits || {};
    
    // Ensure strengths and challenges exist and are arrays
    if (!traits.strengths || !Array.isArray(traits.strengths) || traits.strengths.length === 0) {
      traits = {
        ...traits,
        strengths: ["Adaptability", "Critical thinking", "Creative problem solving"]
      };
    }
    
    if (!traits.challenges || !Array.isArray(traits.challenges) || traits.challenges.length === 0) {
      traits = {
        ...traits,
        challenges: ["Perfectionism", "Overthinking", "Difficulty with uncertainty"]
      };
    }
    
    return traits;
  };

  const enhancedAnalysis = {
    ...analysis,
    core_traits: ensureTraits()
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
      
      {enhancedAnalysis && (
        <>
          <PersonalityOverview overview={enhancedAnalysis.overview || "Your complete analysis is still being generated. We'll display your full results when they're ready."} />
          
          <AnalysisScores 
            intelligenceScore={enhancedAnalysis.intelligence_score || 75}
            emotionalIntelligenceScore={enhancedAnalysis.emotional_intelligence_score || 72}
            responsePatterns={enhancedAnalysis.response_patterns}
          />
          
          <TopTraitsSection coreTraits={enhancedAnalysis.core_traits} />
          
          <DeepInsightTabs analysis={enhancedAnalysis} />
          
          <AnalysisActions analysis={enhancedAnalysis} />
        </>
      )}
    </>
  );
};

export default AnalysisProcessingState;
