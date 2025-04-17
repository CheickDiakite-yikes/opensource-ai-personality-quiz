
import React from "react";
import { AlertCircle, ArrowLeft, RefreshCw, ClipboardList } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ResultsErrorProps {
  error: string;
  onRetry?: () => void;
}

export const ResultsError: React.FC<ResultsErrorProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();
  
  const isNoResponsesError = error.includes("No responses found") || 
                            error.toLowerCase().includes("assessment") || 
                            error.toLowerCase().includes("complete");
  
  return (
    <motion.div 
      className="container max-w-4xl py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Processing Your Responses</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      
      <p className="text-muted-foreground mb-8">
        {isNoResponsesError ? (
          "You need to complete the Deep Insight assessment before viewing results. Please take the assessment to receive your personalized analysis."
        ) : (
          "We apologize for the inconvenience. This could be due to a temporary issue with our analysis system or a problem with the response data. You can try again or return to the assessment."
        )}
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {onRetry && !isNoResponsesError && (
          <Button onClick={onRetry} variant="default" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        )}
        
        <Button 
          onClick={() => navigate("/deep-insight/quiz")} 
          variant="default" 
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" /> Take the Assessment
        </Button>
        
        <Button onClick={() => navigate("/deep-insight")} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Return to Deep Insight
        </Button>
      </div>
    </motion.div>
  );
};
