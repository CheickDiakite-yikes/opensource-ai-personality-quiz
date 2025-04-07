
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroContentProps {
  mounted: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({ mounted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/assessment");
    } else {
      navigate("/auth");
    }
  };

  const handleLearnMore = () => {
    const featuresElement = document.getElementById("features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1,
            delay: 1
          }}
        >
          <motion.img
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png"
            alt="Who Am I Logo - AI Personality Assessment"
            className="h-28 md:h-32 w-auto mx-auto mb-8"
            initial={{
              scale: 0.8,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            transition={{
              duration: 1,
              delay: 1.5
            }}
          />
          <motion.h1
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 1,
              delay: 1.7
            }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 drop-shadow-md text-slate-800"
          >
            Discover Who You Really Are
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 1,
              delay: 1.9
            }}
            className="text-xl md:text-2xl mb-10 text-slate-700 max-w-3xl mx-auto"
          >
            Our advanced AI personality assessment delivers deep insights about your unique traits,
            cognitive patterns, and emotional intelligence.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.3 }}
            >
              <button 
                onClick={handleGetStarted} 
                className="ghibli-btn-enhanced group flex items-center justify-center w-full sm:w-64 text-lg"
              >
                <span>{user ? "Take Assessment" : "Get Started"}</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.5 }}
            >
              <button 
                onClick={handleLearnMore} 
                className="bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-full px-6 py-3 font-medium shadow-md transition-all duration-300 w-full sm:w-64"
              >
                Learn More
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroContent;
