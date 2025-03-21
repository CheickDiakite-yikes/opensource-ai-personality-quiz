
import React from "react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const AssessmentHeader: React.FC = () => {
  return (
    <motion.div 
      className="mb-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold">Who Am I? Assessment</h1>
      <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
        Answer thoughtfully for the most accurate personality insights
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Your responses help our AI understand your personality traits, emotional intelligence, and cognitive strengths. Take your time with each question for the most accurate results.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </p>
    </motion.div>
  );
};

export default AssessmentHeader;
