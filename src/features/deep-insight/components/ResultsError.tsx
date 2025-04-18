
import React from "react";
import { Button } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsErrorProps {
  error: string;
  retryAction?: () => void;
}

export const ResultsError: React.FC<ResultsErrorProps> = ({ 
  error,
  retryAction 
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (retryAction) {
      retryAction();
    } else {
      navigate("/deep-insight/quiz");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error}
      </p>
      <div className="flex gap-4">
        <Button onClick={handleRetry} className="bg-primary text-white">
          Take Assessment
        </Button>
        <Button onClick={() => navigate("/")} variant="outline">
          Go to Home
        </Button>
      </div>
    </div>
  );
};
