
import React from "react";
import { AlertCircle, ArrowLeft, RefreshCw, ClipboardList } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsErrorProps {
  error: string;
  onRetry?: () => void;
}

export const ResultsError: React.FC<ResultsErrorProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();
  
  const isNoResponsesError = error.includes("No responses found") || 
                            error.toLowerCase().includes("assessment") || 
                            error.toLowerCase().includes("complete");
  
  const isIncompleteError = error.includes("Incomplete responses");
  
  return (
    <motion.div 
      className="container max-w-4xl py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{isIncompleteError ? "Incomplete Assessment" : "Error Processing Your Responses"}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What happened?</CardTitle>
        </CardHeader>
        <CardContent>
          {isNoResponsesError || isIncompleteError ? (
            <p>
              You need to complete all 100 questions in the Deep Insight assessment before viewing results. 
              This ensures your analysis is comprehensive and accurate.
              {isIncompleteError && (
                <span className="block mt-2 font-medium">
                  Please complete the remaining questions to receive your personalized analysis.
                </span>
              )}
            </p>
          ) : (
            <div className="space-y-4">
              <p>
                We encountered an issue while generating your analysis. This could be due to:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>A temporary issue with our analysis system</li>
                <li>An unexpected error processing your responses</li>
                <li>A problem with the data format</li>
              </ul>
              <p className="mt-2">
                You can try again using the retry button below, or return to the assessment to review your answers.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {onRetry && !isNoResponsesError && !isIncompleteError && (
          <Button onClick={onRetry} variant="default" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        )}
        
        <Button 
          onClick={() => navigate("/deep-insight/quiz")} 
          variant="default" 
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" /> Continue Assessment
        </Button>
        
        <Button onClick={() => navigate("/deep-insight")} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Return to Deep Insight
        </Button>
      </div>
    </motion.div>
  );
};
