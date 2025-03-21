
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  onGetStarted: () => void;
  isAuthenticated: boolean;
}

// Using React.memo to prevent unnecessary re-renders
const HeroSection = React.memo(({ onGetStarted, isAuthenticated }: HeroSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative py-16 md:py-24 lg:py-32 container mx-auto px-4 sm:px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex justify-center mb-4 md:mb-6">
          <motion.img 
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
            alt="Who Am I Logo - AI Personality Assessment" 
            className={`${isMobile ? 'h-16' : 'h-24'} w-auto`} 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="inline-block mb-3 md:mb-4">
          <div className="flex items-center bg-primary/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-primary">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span>AI-Powered Personality Test That Truly Understands You</span>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gradient">
          Discover Who You Really Are
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
          Our advanced AI personality assessment delivers deep insights into your unique traits, cognitive patterns, and emotional intelligence. Understand yourself better than ever before.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            size={isMobile ? "default" : "lg"} 
            onClick={onGetStarted} 
            className="group"
            aria-label="Start personality assessment"
          >
            {isAuthenticated ? "Take Assessment" : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "lg"}
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
      
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
