
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";

export const ResultsLoadingState = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-2xl p-8 flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <Spinner size="xl" className="text-primary h-16 w-16" />
          
          <h2 className="text-2xl font-bold text-center">Generating Your Analysis</h2>
          
          <p className="text-muted-foreground text-center max-w-md">
            Our AI is analyzing your responses and creating personalized insights.
            This may take a moment as we generate a comprehensive analysis.
          </p>
        </motion.div>
      </Card>
    </div>
  );
};
