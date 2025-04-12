
import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, BookOpen, AlertTriangle, Check, Clock, BrainCircuit, Users, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

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
      
      {/* Comparison to Standard Assessment */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Why Choose the Comprehensive Assessment?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <BrainCircuit className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Deeper Cognitive Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Our comprehensive assessment dives deeper into your thinking patterns, problem-solving approach, and intellectual strengths.
            </p>
          </Card>
          
          <Card className="p-5 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Enhanced Relationship Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Gain a more nuanced understanding of your interpersonal dynamics, communication style, and relationship compatibility.
            </p>
          </Card>
          
          <Card className="p-5 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Advanced Career Matching</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover more specific career recommendations aligned with your unique personality profile and strengths.
            </p>
          </Card>
          
          <Card className="p-5 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">More Questions, More Accuracy</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              With 100 questions (versus 25 in the standard assessment), your results will be more accurate and detailed.
            </p>
          </Card>
        </div>
      </motion.div>
      
      {/* Coming Soon Section */}
      <motion.div 
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center p-8 border border-dashed rounded-lg max-w-xl mx-auto w-full">
          <div className="flex justify-center mb-4">
            <Clipboard className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-3">Coming Soon!</h3>
          <p className="text-muted-foreground mb-6">
            We're currently building our comprehensive 100-question assessment.
            Check back soon for a more in-depth personality analysis experience.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => toast.info("Coming Soon!", { 
                description: "We'll notify you when the comprehensive assessment is ready." 
              })}
              className="w-full sm:w-auto"
            >
              Notify Me When Ready
            </Button>
            <div className="pt-2">
              <Link to="/assessment" className="text-sm text-primary hover:underline">
                Try our standard assessment instead
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      
      <footer className="mt-10 text-center text-sm text-muted-foreground">
        <p>Want to see a sample of what the comprehensive report will look like?</p>
        <Link to="/comprehensive-report/sample" className="text-primary hover:underline">
          View a sample comprehensive report
        </Link>
      </footer>
    </div>
  );
};

export default ComprehensiveAssessmentPage;
