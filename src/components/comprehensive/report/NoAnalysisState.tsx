
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bug, Sparkles } from "lucide-react";

interface NoAnalysisStateProps {
  id?: string;
  onGoBack: () => void;
  showAdvancedOptions: boolean;
  onToggleAdvancedOptions: () => void;
  isCreatingTest: boolean;
  testPrompt: string;
  onTestPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCreateTestAnalysis: () => void;
  isUserLoggedIn: boolean;
}

const NoAnalysisState: React.FC<NoAnalysisStateProps> = ({
  id,
  onGoBack,
  showAdvancedOptions,
  onToggleAdvancedOptions,
  isCreatingTest,
  testPrompt,
  onTestPromptChange,
  onCreateTestAnalysis,
  isUserLoggedIn
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
        <h2 className="text-xl mb-4">No Analysis Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find a comprehensive analysis with the provided ID.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" onClick={onGoBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Reports
          </Button>
          {isUserLoggedIn && (
            <Button 
              onClick={onToggleAdvancedOptions} 
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" /> {showAdvancedOptions ? "Hide Options" : "Create Test Analysis"}
            </Button>
          )}
        </div>
        
        {showAdvancedOptions && (
          <div className="mt-8 p-6 bg-muted rounded-md max-w-lg mx-auto">
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
                <p className="text-xs text-muted-foreground mt-1">
                  The AI will analyze this text to generate a detailed personality profile.
                </p>
              </div>
              <Button 
                onClick={onCreateTestAnalysis} 
                disabled={isCreatingTest}
                className="w-full flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isCreatingTest ? "Creating..." : "Generate Test Analysis"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NoAnalysisState;
