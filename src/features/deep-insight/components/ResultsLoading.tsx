
import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const ResultsLoading: React.FC = () => {
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
            <div className="bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Processing cognitive patterns</span>
              <span>Complete</span>
            </div>
            <div className="bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Evaluating emotional intelligence</span>
              <span>Complete</span>
            </div>
            <div className="bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Identifying value systems</span>
              <span>In progress</span>
            </div>
            <div className="bg-muted rounded-full h-2">
              <motion.div 
                className="bg-primary h-2 rounded-full" 
                initial={{ width: "0%" }}
                animate={{ width: "65%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              ></motion.div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Generating comprehensive insights</span>
              <span>Pending</span>
            </div>
            <div className="bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
