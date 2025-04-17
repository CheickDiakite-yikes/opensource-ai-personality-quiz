
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ResultsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ResultsErrorState = ({ error, onRetry }: ResultsErrorStateProps) => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-2xl p-8 flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-bold text-center">Error Loading Analysis</h2>
          
          <p className="text-muted-foreground text-center max-w-md">
            {error || "There was a problem generating your analysis. Please try again."}
          </p>
          
          <Button onClick={onRetry} variant="default" size="lg">
            Retry Analysis
          </Button>
        </motion.div>
      </Card>
    </div>
  );
};
