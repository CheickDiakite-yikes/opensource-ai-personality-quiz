
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  isAuthenticated: boolean;
}

// Using React.memo to prevent unnecessary re-renders
const HeroSection = React.memo(({ onGetStarted, isAuthenticated }: HeroSectionProps) => {
  return (
    <section className="relative py-24 md:py-32 container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex justify-center mb-6">
          <motion.img 
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
            alt="Who Am I Logo - AI Personality Assessment" 
            className="h-24 w-auto" 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="inline-block mb-4">
          <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full text-sm text-primary">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>AI-Powered Personality Test That Truly Understands You</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          Discover Who You Really Are
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our advanced AI personality assessment delivers deep insights into your unique traits, cognitive patterns, and emotional intelligence. Understand yourself better than ever before.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={onGetStarted} 
            className="group"
            aria-label="Start personality assessment"
          >
            {isAuthenticated ? "Take Assessment" : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              const featuresElement = document.getElementById("features");
              if (featuresElement) {
                featuresElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label="Learn more about our personality test"
          >
            Learn More
          </Button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
