
import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, ArrowRight, Users, LineChart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

const DeepInsight = () => {
  const navigate = useNavigate();
  
  const startAssessment = () => {
    navigate("/deep-insight/quiz");
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Deep Insight</h1>
          <p className="text-xl text-muted-foreground">
            Discover your authentic self through our advanced AI personality assessment.
            Gain profound insights into your cognitive patterns, emotional architecture,
            and interpersonal dynamics.
          </p>
        </motion.header>
        
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Begin Your Journey</CardTitle>
              <CardDescription>
                Take our comprehensive assessment to receive a detailed analysis of your personality
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
              <p>
                This assessment takes approximately 10-15 minutes to complete and consists of
                thoughtfully designed questions to map your unique personality signature.
              </p>
              <p>
                Unlike traditional personality tests that place you in rigid categories,
                our AI-powered analysis provides nuanced insights specific to you.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={startAssessment} size="lg" className="w-full sm:w-auto">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={item}>
          <Card>
            <CardHeader>
              <Brain className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Cognitive Patterning</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Understand how you process information, make decisions, and approach
                learning. Gain clarity on your unique thinking style.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Interpersonal Dynamics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Explore your attachment style, communication patterns, and how you
                navigate relationships with others.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <LineChart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Growth Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Discover personalized development opportunities and practical
                recommendations for personal growth.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-primary/20 w-10 h-10 flex items-center justify-center rounded-full text-primary font-bold mb-3">1</div>
                  <h3 className="font-medium mb-2">Complete Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Answer thoughtfully designed questions that map different aspects of your personality
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-primary/20 w-10 h-10 flex items-center justify-center rounded-full text-primary font-bold mb-3">2</div>
                  <h3 className="font-medium mb-2">AI Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Our advanced algorithm analyzes your responses to generate personalized insights
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-primary/20 w-10 h-10 flex items-center justify-center rounded-full text-primary font-bold mb-3">3</div>
                  <h3 className="font-medium mb-2">Explore Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a detailed report with actionable insights about your unique personality
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div className="flex justify-center" variants={item}>
          <Button onClick={startAssessment} size="lg" variant="default" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Begin Your Deep Insight Journey
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeepInsight;
