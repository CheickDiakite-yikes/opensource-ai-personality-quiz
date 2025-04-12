
import React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onLearnMore }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleComprehensiveAssessment = () => {
    if (user) {
      navigate("/comprehensive-assessment");
    } else {
      navigate("/auth");
      toast.info("Sign in required", {
        description: "Please sign in to access the comprehensive assessment"
      });
    }
  };
  
  return (
    <div className="relative pt-16 md:pt-24 pb-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center z-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Discover Your <span className="text-gradient">True Self</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Unlock insights about your personality, potential, and purpose through our AI-powered assessments
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              onClick={onGetStarted} 
              size="lg"
              className="ghibli-button"
            >
              {user ? "Take Assessment" : "Get Started"}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={onLearnMore}
              className="ghibli-button-outline"
            >
              Learn More
            </Button>
          </motion.div>
          
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              onClick={handleComprehensiveAssessment}
              className="text-sm text-primary underline hover:text-primary/80"
            >
              Try our new comprehensive 100-question assessment (Coming Soon)
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
