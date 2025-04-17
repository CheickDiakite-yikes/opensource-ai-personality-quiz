
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ResultsErrorState: React.FC<ResultsErrorStateProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const isNoResponsesError = error.includes("No responses found") || 
                           error.toLowerCase().includes("assessment") || 
                           error.toLowerCase().includes("complete");
  
  return (
    <motion.div 
      className="container max-w-4xl py-4 md:py-8 px-2 md:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Alert variant="destructive" className="mb-4 md:mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm md:text-base">Error Processing Your Results</AlertTitle>
        <AlertDescription className="text-xs md:text-sm mt-1">{error}</AlertDescription>
      </Alert>
      
      <Card className="mb-4 md:mb-6">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">What happened?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base">
            {isNoResponsesError ? (
              "You need to complete the Deep Insight assessment before viewing results. This ensures your analysis is comprehensive and accurate."
            ) : (
              "We encountered an issue while generating your analysis. You can try again using the retry button below."
            )}
          </p>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
        {!isNoResponsesError && (
          <Button 
            onClick={onRetry} 
            variant="default" 
            className="flex items-center gap-2"
            size={isMobile ? "sm" : "default"}
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        )}
        
        <Button 
          onClick={() => navigate("/deep-insight/quiz")} 
          variant="outline" 
          className="flex items-center gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="h-4 w-4" /> Return to Assessment
        </Button>
      </div>
    </motion.div>
  );
};
