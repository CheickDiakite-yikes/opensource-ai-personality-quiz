
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDeepInsightQuestions } from "@/utils/deep-insight/questionBank";
import { useDeepInsightState } from "../hooks/useDeepInsightState";

interface AnalysisErrorStateProps {
  error: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const AnalysisErrorState: React.FC<AnalysisErrorStateProps> = ({ 
  error,
  onRetry,
  isRetrying = false
}) => {
  const navigate = useNavigate();
  const { resetResponses } = useDeepInsightState(getDeepInsightQuestions(100));

  const handleStartOver = () => {
    resetResponses();
    navigate("/deep-insight");
  };

  // Cleanse error message to be more user-friendly
  const sanitizeErrorMessage = (error: string): string => {
    // Hide technical details and API keys
    if (!error) return "Unknown error occurred";
    
    let cleanedError = error;
    
    // Remove any potential API keys or tokens
    cleanedError = cleanedError.replace(/Bearer [a-zA-Z0-9._-]+/g, 'Bearer [HIDDEN]');
    cleanedError = cleanedError.replace(/sk-[a-zA-Z0-9]{10,}/g, 'sk-[HIDDEN]');
    
    // Replace technical errors with user-friendly messages
    if (cleanedError.includes("timeout") || cleanedError.includes("ECONN")) {
      return "The analysis is taking longer than expected. Please try again.";
    }
    
    if (cleanedError.includes("rate limit") || cleanedError.includes("429")) {
      return "Our analysis service is experiencing high demand. Please try again in a few minutes.";
    }
    
    if (cleanedError.includes("ENOTFOUND") || cleanedError.includes("ENOENT")) {
      return "There was a network connection issue. Please check your internet connection and try again.";
    }
    
    if (cleanedError.length > 150) {
      return cleanedError.substring(0, 150) + "...";
    }
    
    return cleanedError;
  };

  return (
    <div className="container max-w-3xl py-8 md:py-12 px-4 md:px-6">
      <div className="mb-8 text-center space-y-2">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold">Analysis Error</h1>
        <p className="text-muted-foreground">
          We encountered an issue while processing your analysis.
        </p>
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error Details</AlertTitle>
        <AlertDescription className="whitespace-pre-wrap">{sanitizeErrorMessage(error)}</AlertDescription>
      </Alert>

      <div className="bg-card p-6 rounded-lg border mb-6">
        <h2 className="font-semibold mb-3">Suggested Solutions:</h2>
        <ul className="list-disc pl-4 space-y-2 mb-6">
          <li>Click the "Try Again" button to attempt to retrieve your analysis</li>
          <li>Our AI model may be experiencing high demand, try again in a few minutes</li>
          <li>Start fresh with a new assessment for best results</li>
          <li>If problems persist, try using a different browser or device</li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {onRetry && (
            <Button 
              onClick={onRetry}
              disabled={isRetrying}
              variant="default"
              className="flex-1 flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Trying...' : 'Try Again'}
            </Button>
          )}
          <Button 
            onClick={handleStartOver}
            variant="outline"
            className="flex-1"
          >
            Start Fresh Assessment
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Our team is automatically notified of analysis errors and is working to resolve them.
        If this issue persists, please try again later.
      </p>
    </div>
  );
};

export default AnalysisErrorState;
