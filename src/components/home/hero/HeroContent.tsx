
import React from 'react';
import { motion } from 'framer-motion';

interface HeroContentProps {
  mounted: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({ mounted }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="text-center px-4 max-w-2xl"
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
          className="h-24 w-auto mx-auto mb-6"
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
          className="text-xl mb-8 drop-shadow-sm text-orange-900"
        >
          Our advanced AI personality assessment delivers deep insights about your unique traits,
          cognitive patterns, and emotional intelligence.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HeroContent;
