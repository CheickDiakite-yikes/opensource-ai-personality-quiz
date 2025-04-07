
import React from 'react';
import { motion } from 'framer-motion';

interface SunProps {
  mounted: boolean;
}

const Sun: React.FC<SunProps> = ({ mounted }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 20
      }}
      animate={{
        opacity: mounted ? 0.9 : 0,
        scale: 1,
        y: 0
      }}
      transition={{
        duration: 2,
        delay: 0.5
      }}
      className="absolute top-[12%] sm:top-[15%] right-[20%] sm:right-[15%] h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-300"
    >
      {/* Inner glow */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse-subtle"
        style={{
          boxShadow: '0 0 40px 10px rgba(254, 240, 138, 0.8), inset 0 0 20px 5px rgba(254, 215, 170, 0.6)'
        }}
      />
      
      {/* Sun rays */}
      <motion.div 
        className="absolute inset-[-50%] opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(255, 255, 255, 0) 70%), repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0.8) 10deg, rgba(255, 255, 255, 0) 20deg)'
        }}
      />
    </motion.div>
  );
};

export default Sun;
