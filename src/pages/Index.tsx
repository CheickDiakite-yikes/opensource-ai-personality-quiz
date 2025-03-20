
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles, Brain } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setTimeout(() => {
      navigate("/assessment");
    }, 1000);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  // Fixing the animation variants to use proper typings for framer-motion
  const floatingIconsVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "mirror", // Changed from string to specific literal type
        ease: "easeInOut",
        delay: Math.random() * 2
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 opacity-10 animate-rotate-glow">
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-10 animate-pulse-subtle">
            <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-3xl" />
          </div>
        </div>
        
        {/* Floating Icons */}
        <motion.div 
          className="absolute top-20 right-20 text-primary/20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
        >
          <Brain size={40} />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 text-primary/20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        >
          <Star size={30} />
        </motion.div>
        <motion.div 
          className="absolute top-40 left-[40%] text-primary/20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <Sparkles size={35} />
        </motion.div>
        
        {/* Main Content */}
        <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mb-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Discover Your <span className="text-gradient">True Self</span>
                </h1>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-muted-foreground mb-8"
              >
                AI-powered insights to understand your personality and become the best version of yourself.
              </motion.p>
              
              <motion.div variants={itemVariants} className="space-y-4 md:space-y-0 md:space-x-4">
                <Button 
                  size="lg" 
                  className="px-8"
                  onClick={() => navigate("/assessment")}
                >
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8"
                  onClick={() => console.log("Learn more")}
                >
                  Learn More
                </Button>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="mt-12 flex flex-wrap justify-center md:justify-start gap-6"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">50</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Insightful Questions</p>
                    <p className="text-muted-foreground">Tailored to understand you</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">AI</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Advanced Analysis</p>
                    <p className="text-muted-foreground">Powered by AI technology</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">❤️</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Growth Tracking</p>
                    <p className="text-muted-foreground">Gamified self-improvement</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="relative z-10"
              >
                <AuthForm onSuccess={handleAuthSuccess} />
              </motion.div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl -z-10 transform scale-95 translate-y-4" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
