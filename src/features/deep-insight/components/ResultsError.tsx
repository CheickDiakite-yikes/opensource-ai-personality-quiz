
import React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ResultsErrorProps {
  error: string;
  onRetry?: () => void;
}

export const ResultsError: React.FC<ResultsErrorProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl py-16">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      
      <div className="flex justify-center">
        <Button onClick={() => navigate("/deep-insight")} variant="default">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Deep Insight
        </Button>
      </div>
    </div>
  );
};
