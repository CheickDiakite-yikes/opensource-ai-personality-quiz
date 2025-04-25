
import React from "react";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ReportErrorProps {
  title?: string;
  description?: string;
  showRetryButton?: boolean;
  onRetry?: () => void;
  errorDetails?: string;
}

const ReportError: React.FC<ReportErrorProps> = ({
  title = "Could Not Load Analysis",
  description = "We couldn't find the requested analysis or there was an error loading it.",
  showRetryButton = true,
  onRetry,
  errorDetails
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-4xl py-8 px-4"
    >
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      
      {errorDetails && (
        <div className="bg-muted p-4 rounded-md my-4 overflow-auto text-xs">
          <pre className="whitespace-pre-wrap">{errorDetails}</pre>
        </div>
      )}
      
      <p className="text-muted-foreground mb-6">
        You can try refreshing the page, going back to your dashboard, or taking the assessment again.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {showRetryButton && onRetry && (
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Retry Loading
          </Button>
        )}
        
        <Button 
          onClick={() => navigate("/assessment")} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Take Assessment
        </Button>
        
        <Button 
          onClick={() => navigate("/")} 
          variant="secondary"
          className="flex items-center gap-2"
        >
          Go to Dashboard
        </Button>
      </div>
    </motion.div>
  );
};

export default ReportError;
