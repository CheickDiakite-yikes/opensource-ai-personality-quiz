
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export const ResultsLoadingState = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto max-w-4xl px-2 md:px-4 py-4 md:py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl p-4 md:p-8 flex flex-col items-center justify-center space-y-4 md:space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 md:space-y-6"
        >
          <Spinner size={isMobile ? "lg" : "xl"} className="text-primary" />
          
          <h2 className="text-xl md:text-2xl font-bold text-center">
            Generating Your Analysis
          </h2>
          
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-md px-2 md:px-0">
            Our AI is analyzing your responses and creating personalized insights.
            This may take a moment as we generate a comprehensive analysis.
          </p>
        </motion.div>
      </Card>
    </div>
  );
};
