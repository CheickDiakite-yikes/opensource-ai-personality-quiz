
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  isAuthenticated: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, isAuthenticated }) => {
  return (
    <section className="relative py-24 md:py-32 container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <div className="inline-block mb-4">
          <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full text-sm text-primary">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>AI-Powered Personality Insights</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          Discover Who You Really Are
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Gain deep insights into your personality, strengths, and potential with our advanced AI personality assessment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={onGetStarted} 
            className="group"
          >
            {isAuthenticated ? "Take Assessment" : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.scrollTo({ top: document.getElementById("features")?.offsetTop || 0, behavior: "smooth" })}
          >
            Learn More
          </Button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
