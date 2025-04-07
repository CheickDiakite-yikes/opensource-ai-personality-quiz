
import React from 'react';
import { motion } from 'framer-motion';

interface HeroContentProps {
  mounted: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({ mounted }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <motion.div
        className="text-center px-4 py-6 max-w-2xl backdrop-blur-sm bg-white/10 rounded-xl border border-white/20 shadow-lg"
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
          className="h-20 w-auto mx-auto mb-4"
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
          className="text-3xl md:text-4xl font-serif mb-4 text-white shadow-text"
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
          className="text-lg mb-4 text-white/90 font-medium shadow-text"
        >
          Our advanced AI personality assessment delivers deep insights about your unique traits,
          cognitive patterns, and emotional intelligence.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HeroContent;
