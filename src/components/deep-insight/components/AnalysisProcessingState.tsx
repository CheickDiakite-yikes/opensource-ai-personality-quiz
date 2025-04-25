
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DeepInsightAnalysis } from "../types/deepInsight";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  analysis
}) => {
  // Determine if we have partial data we can show
  const hasPartialData = Boolean(
    analysis?.core_traits?.primary || 
    analysis?.intelligence_score || 
    analysis?.overview
  );
  
  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTitle className="flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Your analysis is still processing
        </AlertTitle>
        <AlertDescription>
          {error || "Please wait while we finish processing your analysis. This may take a few moments."}
        </AlertDescription>
      </Alert>

      <Button 
        onClick={onRetry} 
        disabled={isRetrying}
        variant="outline"
        className="w-full"
      >
        {isRetrying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Retrying...
          </>
        ) : (
          'Refresh Analysis'
        )}
      </Button>
      
      {hasPartialData && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Partial Results Available</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Some analysis data is available while we finish processing. The complete results will be shown soon.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisProcessingState;
