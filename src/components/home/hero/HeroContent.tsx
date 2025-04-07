
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HeroContentProps {
  mounted: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({ mounted }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="text-center px-4 max-w-3xl"
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-200/30 to-amber-100/30 blur-xl transform scale-150"></div>
          <motion.img
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png"
            alt="Who Am I Logo - AI Personality Assessment"
            className="h-28 w-auto mx-auto relative z-10"
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
        </motion.div>
        
        <motion.div 
          className="inline-block mb-4 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
        >
          <div className="flex items-center bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full text-sm text-primary-foreground shadow-lg">
            <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
            <span className="font-medium text-amber-800">AI-Powered Personality Assessment</span>
          </div>
        </motion.div>
        
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
          className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 drop-shadow-md tracking-wide"
        >
          <span className="bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent">
            Discover Who You Really Are
          </span>
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
          className="text-xl md:text-2xl mb-8 drop-shadow-sm text-orange-900 max-w-2xl mx-auto"
        >
          Our advanced AI personality assessment delivers deep insights about your unique traits,
          cognitive patterns, and emotional intelligence.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HeroContent;
