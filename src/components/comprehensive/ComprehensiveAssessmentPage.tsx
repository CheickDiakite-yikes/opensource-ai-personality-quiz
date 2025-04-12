
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clipboard, BookOpen, AlertTriangle, Check, HelpCircle, Clock, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ComprehensiveAssessmentPage: React.FC = () => {
  const [notifyEmail, setNotifyEmail] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleNotifyClick = () => {
    toast.success("You'll be notified when ready!", { 
      description: "We'll send you an email when the comprehensive assessment launches."
    });
  };
  
  const handlePreviewReport = () => {
    navigate("/comprehensive-report");
  };
  
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
        
        <div className="flex justify-center items-center gap-2 mt-3">
          <Badge variant="outline" className="bg-primary/5">
            <Clock className="w-3 h-3 mr-1" /> 25-30 minutes
          </Badge>
          <Badge variant="outline" className="bg-primary/5">
            <BrainCircuit className="w-3 h-3 mr-1" /> 100 questions
          </Badge>
        </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <h3 className="font-medium text-base">Key Benefits</h3>
            <div className="space-y-3">
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
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-base">What You'll Get</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <p>Shadow aspect analysis</p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <p>Detailed personal growth roadmap</p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <p>Personalized learning recommendations</p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <p>Enhanced trait visualizations</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start space-x-4 mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Important Note</p>
            <p className="text-sm">
              This assessment takes approximately 25-30 minutes to complete. For best results, choose a 
              time when you can answer thoughtfully without interruptions.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 mt-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium">How is this different from the standard assessment?</p>
              <p className="text-muted-foreground">The comprehensive assessment has 100 questions (vs 30) and provides more detailed analysis including shadow aspects and nuanced trait interactions.</p>
            </div>
            <div>
              <p className="font-medium">Can I save my progress and continue later?</p>
              <p className="text-muted-foreground">Yes, your progress is automatically saved as you go. You can return at any time to complete the assessment.</p>
            </div>
            <div>
              <p className="font-medium">How long will the results be available?</p>
              <p className="text-muted-foreground">Your comprehensive assessment results will be available in your account indefinitely.</p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 border border-dashed rounded-lg w-full max-w-lg">
          <div className="flex justify-center mb-4">
            <Clipboard className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-3">Coming Soon!</h3>
          <p className="text-muted-foreground mb-6">
            We're currently building our comprehensive 100-question assessment.
            Check back soon for a more in-depth personality analysis experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleNotifyClick}
            >
              Notify Me When Ready
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePreviewReport}
            >
              Preview Sample Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAssessmentPage;
