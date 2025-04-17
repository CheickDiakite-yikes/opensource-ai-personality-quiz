
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ChevronRight, FileText } from "lucide-react";
import DeepInsightHistory from "@/features/deep-insight/components/history/DeepInsightHistory";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const DeepInsight: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl py-8 px-4">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Deep Insight</h1>
          <p className="text-muted-foreground mt-2">
            Explore your cognitive patterns and behavioral tendencies with our advanced assessment
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-8">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle>Take the Deep Insight Assessment</CardTitle>
              </div>
              <CardDescription>
                Discover your cognitive patterns, response tendencies, and behavioral insights
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                    <ChevronRight className="h-3 w-3 text-primary" />
                  </div>
                  <span>30 questions to analyze your cognitive and emotional patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                    <ChevronRight className="h-3 w-3 text-primary" />
                  </div>
                  <span>Generate detailed insights about your thinking style and behavioral tendencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                    <ChevronRight className="h-3 w-3 text-primary" />
                  </div>
                  <span>Visualize your response patterns and cognitive strengths</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-end border-t bg-muted/50 pt-6">
              <Button onClick={() => navigate("/deep-insight/quiz")}>
                Start Assessment <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DeepInsightHistory />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>About Deep Insight</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Deep Insight is our advanced cognitive assessment that analyzes how you 
                process information, make decisions, and respond to various situations. 
                The assessment uses sophisticated pattern recognition to identify your 
                unique cognitive profile, helping you better understand your thought processes
                and behavioral tendencies.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeepInsight;
