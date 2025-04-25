
import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, ArrowRight, Users, LineChart, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ConciseInsight: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const startAssessment = () => {
    try {
      if (!user && !isLoading) {
        toast.error("Please sign in to take the assessment");
        navigate("/auth");
        return;
      }
      
      navigate("/concise-insight/quiz");
    } catch (e) {
      console.error("Navigation error:", e);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="container max-w-5xl py-12 px-4 md:px-6"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-10">
        <motion.header className="text-center max-w-3xl mx-auto" variants={item}>
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Concise Insight</h1>
          <p className="text-xl text-muted-foreground">
            Our streamlined 25-question assessment delivers powerful personality insights 
            with enhanced AI analysis. Get a focused understanding of your authentic self in just 10 minutes.
          </p>
        </motion.header>
        
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Begin Your Quick Assessment</CardTitle>
              <CardDescription>
                Take our streamlined 25-question assessment to receive a detailed analysis of your personality
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
              <p>
                This optimized assessment takes only 5-10 minutes to complete and uses
                our most insightful questions to map your unique personality profile.
              </p>
              <p>
                Every question has been carefully selected to provide maximum insight with minimal time investment.
                Our enhanced AI analysis delivers deeper understanding from fewer data points.
              </p>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-4 p-3 bg-background/50 rounded-md">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span>Your responses are kept private and secure. We respect your privacy.</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startAssessment} size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? "Loading..." : "Start Quick Assessment"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" /> 
                Cognitive Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Understand your unique thinking patterns, decision-making approach, and information processing style.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Relationship Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover how you connect with others, your communication style, and relationship patterns.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Core Motivations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Reveal your fundamental values, what truly drives you, and your authentic sources of meaning.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConciseInsight;
