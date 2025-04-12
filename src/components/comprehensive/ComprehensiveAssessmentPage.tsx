
import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, BookOpen, AlertTriangle, Check } from "lucide-react";

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
      
      <Card className="p-6 md:p-8 mb-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">About the Comprehensive Assessment</h2>
            <p className="text-muted-foreground">
              The comprehensive assessment expands on our standard assessment by offering 100 questions 
              across a wider range of categories. This provides a more nuanced and detailed analysis of 
              your personality, intelligence, and behavioral patterns.
            </p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <p>More detailed trait analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <p>Deeper insights into cognitive patterns</p>
          </div>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <p>Advanced relationship compatibility metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <p>Expanded career suggestion algorithm</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4 mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm">
            This assessment takes approximately 25-30 minutes to complete. For best results, choose a 
            time when you can answer thoughtfully without interruptions.
          </p>
        </div>
      </Card>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 border border-dashed rounded-lg">
          <div className="flex justify-center mb-4">
            <Clipboard className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-3">Coming Soon!</h3>
          <p className="text-muted-foreground mb-6">
            We're currently building our comprehensive 100-question assessment.
            Check back soon for a more in-depth personality analysis experience.
          </p>
          <Button 
            onClick={() => toast.info("Coming Soon!", { 
              description: "We'll notify you when the comprehensive assessment is ready." 
            })}
          >
            Notify Me When Ready
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAssessmentPage;
