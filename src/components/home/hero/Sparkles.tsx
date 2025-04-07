
import React from 'react';
import { motion } from 'framer-motion';

export interface SparklesProps {
  key: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const Sparkles: React.FC<SparklesProps> = ({ x, y, size, delay, duration }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }}
    >
      <div 
        className="w-full h-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
          transform: "rotate(45deg)"
        }}
      />
    </motion.div>
  );
};

export default Sparkles;
