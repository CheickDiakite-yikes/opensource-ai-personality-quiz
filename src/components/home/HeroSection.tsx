
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthForm from "@/components/auth/AuthForm";

interface HeroSectionProps {
  onAuthSuccess: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  
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
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
      <motion.div 
        className="grid md:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm bg-primary/10 border-primary/20">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> AI-Powered Self-Discovery
          </Badge>
          
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
          
          <motion.div variants={itemVariants} className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-center justify-center md:justify-start">
            <Button 
              size="lg" 
              className="px-8 h-12 rounded-full shadow-lg"
              onClick={() => navigate("/assessment")}
            >
              Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 h-12 rounded-full"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center md:justify-start gap-6"
          >
            <StatsItem label="Insightful Questions" description="Tailored to understand you" value="50" />
            <StatsItem label="Advanced Analysis" description="Powered by AI technology" value="AI" />
            <StatsItem label="Growth Tracking" description="Gamified self-improvement" value="❤️" />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative z-10"
          >
            <AuthForm onSuccess={onAuthSuccess} />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl -z-10 transform scale-95 translate-y-4" />
        </motion.div>
      </motion.div>
    </div>
  );
};

interface StatsItemProps {
  value: string;
  label: string;
  description: string;
}

const StatsItem: React.FC<StatsItemProps> = ({ value, label, description }) => {
  return (
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
        <span className="text-primary font-semibold">{value}</span>
      </div>
      <div className="text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default HeroSection;
