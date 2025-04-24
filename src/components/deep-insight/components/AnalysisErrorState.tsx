
import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/ui/PageTransition";

interface AnalysisErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const AnalysisErrorState: React.FC<AnalysisErrorStateProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();
  
  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6 flex flex-col items-center">
        <Brain className="h-16 w-16 text-muted mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-center">Analysis Unavailable</h1>
        <p className="text-muted-foreground text-center mb-6">{error}</p>
        <div className="flex gap-4">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Retry
            </Button>
          )}
          <Button onClick={() => navigate("/deep-insight")}>
            Take the Assessment
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default AnalysisErrorState;
