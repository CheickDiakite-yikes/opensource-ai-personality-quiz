
import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ComprehensiveAssessmentPage: React.FC = () => {
  return (
    <div className="container max-w-3xl py-8 md:py-12 px-4 md:px-6 min-h-screen flex flex-col">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-3">
          <img 
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
            alt="Who Am I Logo" 
            className="h-10 w-auto" 
          />
        </div>
        <h1 className="text-3xl font-bold">Comprehensive Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Our in-depth 100-question personality assessment for detailed insights
        </p>
      </motion.div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="mb-4">This feature is coming soon!</p>
          <p className="text-muted-foreground">
            We're currently building our comprehensive 100-question assessment.
            Check back soon for a more in-depth personality analysis experience.
          </p>
          <button 
            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            onClick={() => toast.info("Coming Soon!", { 
              description: "We'll notify you when the comprehensive assessment is ready." 
            })}
          >
            Notify Me When Ready
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAssessmentPage;
