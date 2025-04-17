
import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ResultsLoadingProps {
  onRetry?: () => void;
}

export const ResultsLoading: React.FC<ResultsLoadingProps> = ({ onRetry }) => {
  const [showRetry, setShowRetry] = useState(false);
  const [progress, setProgress] = useState({
    traits: 100,
    patterns: 100,
    emotional: 100,
    values: 0,
    insights: 0
  });
  
  // Show retry button after 15 seconds, but don't automatically retry
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowRetry(true);
      // Show a toast notification to inform the user
      toast.info("This is taking longer than expected", {
        description: "You can try again using the retry button below",
        duration: 5000
      });
    }, 15000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Animate progress bars
  useEffect(() => {
    // Start values progress after 3 seconds
    const valuesTimer = setTimeout(() => {
      setProgress(prev => ({ ...prev, values: 100 }));
    }, 3000);
    
    // Start insights progress after 6 seconds
    const insightsTimer = setTimeout(() => {
      setProgress(prev => ({ ...prev, insights: 65 }));
      
      // After a bit more time, increase to 85%
      const finalTimer = setTimeout(() => {
        setProgress(prev => ({ ...prev, insights: 85 }));
      }, 4000);
      
      return () => clearTimeout(finalTimer);
    }, 6000);
    
    return () => {
      clearTimeout(valuesTimer);
      clearTimeout(insightsTimer);
    };
  }, []);

  const handleRetry = () => {
    if (onRetry) {
      toast.loading("Retrying analysis generation...");
      onRetry();
    }
  };

  return (
    <motion.div 
      className="container max-w-4xl py-16 flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16 text-primary" />
        </motion.div>
      </div>
      <h2 className="text-2xl font-bold text-center">Generating your deep insight analysis...</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Our AI is carefully analyzing your responses to create a comprehensive personality profile 
        based on all 100 questions you answered.
      </p>
      
      <div className="w-full max-w-md mt-4">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Analyzing personality traits</span>
              <span>Complete</span>
            </div>
            <Progress value={progress.traits} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Processing cognitive patterns</span>
              <span>Complete</span>
            </div>
            <Progress value={progress.patterns} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Evaluating emotional intelligence</span>
              <span>Complete</span>
            </div>
            <Progress value={progress.emotional} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Identifying value systems</span>
              <span>{progress.values === 100 ? 'Complete' : 'In progress'}</span>
            </div>
            <Progress value={progress.values} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Generating comprehensive insights</span>
              <span>{progress.insights === 0 ? 'Pending' : progress.insights >= 85 ? 'Almost complete' : 'In progress'}</span>
            </div>
            <Progress value={progress.insights} />
          </div>
        </div>
      </div>
      
      {showRetry && onRetry && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-2 text-center">
            This is taking longer than expected. Would you like to try again?
          </p>
          <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Retry Analysis Generation
          </Button>
        </div>
      )}
    </motion.div>
  );
};
