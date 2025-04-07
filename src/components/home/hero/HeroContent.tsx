
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroContentProps {
  mounted: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({ mounted }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <motion.div
        className="text-center px-4 md:px-8 max-w-3xl w-full"
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
          className="h-24 md:h-28 w-auto mx-auto mb-6"
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
          className="text-4xl md:text-6xl font-serif mb-6 drop-shadow-md text-slate-50"
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
          className="text-lg md:text-xl mb-10 drop-shadow-sm text-orange-900 max-w-2xl mx-auto"
        >
          Our advanced AI personality assessment delivers deep insights about your unique traits,
          cognitive patterns, and emotional intelligence.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-5 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.2 }}
        >
          <button 
            onClick={handleGetStarted} 
            className="ghibli-btn-enhanced group flex items-center justify-center text-lg"
            aria-label={user ? "Take Assessment" : "Get Started"}
          >
            <span>{user ? "Take Assessment" : "Get Started"}</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={handleLearnMore} 
            className="bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-full px-8 py-4 font-medium shadow-md transition-all duration-300"
            aria-label="Learn more about our personality test"
          >
            Learn More
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
