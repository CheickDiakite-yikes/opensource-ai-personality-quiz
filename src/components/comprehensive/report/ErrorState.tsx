
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw, Bug } from "lucide-react";

interface ErrorStateProps {
  error: string;
  id?: string;
  onRetry: () => void;
  onGoBack: () => void;
  debugInfo: string | null;
  onToggleAdvancedOptions: () => void;
  showAdvancedOptions: boolean;
  isCreatingTest: boolean;
  testPrompt: string;
  onTestPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCreateTestAnalysis: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  id,
  onRetry,
  onGoBack,
  debugInfo,
  onToggleAdvancedOptions,
  showAdvancedOptions,
  isCreatingTest,
  testPrompt,
  onTestPromptChange,
  onCreateTestAnalysis
}) => {
  return (
    <div className="container py-6 md:py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
        <p className="text-muted-foreground">
          ID: {id || "No report ID provided"}
        </p>
      </div>
      
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Unable to Load Report</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {error}
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button variant="outline" onClick={onGoBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Reports
            </Button>
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
            <Button 
              variant="secondary" 
              onClick={onToggleAdvancedOptions} 
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" /> Advanced Options
            </Button>
          </div>
          
          {showAdvancedOptions && (
            <div className="mt-6 p-6 bg-muted rounded-md w-full max-w-lg mx-auto">
              <h3 className="font-medium mb-3">Create Test Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="testPrompt" className="block text-sm font-medium mb-1">
                    Custom Personality Description (Optional)
                  </label>
                  <textarea 
                    id="testPrompt"
                    value={testPrompt}
                    onChange={onTestPromptChange}
                    placeholder="Describe your personality traits, preferences, and characteristics..."
                    className="w-full p-3 border rounded-md h-24"
                  />
                </div>
                <Button 
                  onClick={onCreateTestAnalysis} 
                  disabled={isCreatingTest}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  {isCreatingTest ? "Creating..." : "Generate Test Analysis"}
                </Button>
              </div>
            </div>
          )}
          
          {debugInfo && (
            <div className="mt-6 p-4 bg-muted rounded-md w-full max-w-lg mx-auto">
              <p className="text-sm font-medium mb-2">Debug Information:</p>
              <pre className="text-xs overflow-auto text-left whitespace-pre-wrap">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ErrorState;
