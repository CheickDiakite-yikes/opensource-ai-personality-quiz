
import React from 'react';
import { motion } from 'framer-motion';

export interface BirdProps {
  key?: string; // Added key property
  initialX: number;
  initialY: number;
  size: number;
  duration: number;
  delay: number;
  yMovement: number;
}

const Bird: React.FC<BirdProps> = ({ initialX, initialY, size, duration, delay, yMovement }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        top: `${initialY}%`,
        left: `${initialX}%`
      }}
      initial={{
        x: '-10vw',
        y: 0
      }}
      animate={{
        x: '110vw',
        y: [0, yMovement, 0, -yMovement, 0]
      }}
      transition={{
        x: {
          duration,
          delay,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear'
        },
        y: {
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }
      }}
    >
      <svg
        width={size}
        height={size / 2}
        viewBox="0 0 30 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5,5 Q15,0 15,7.5 Q15,15 25,10" stroke="black" strokeWidth="2" fill="none" />
        <path d="M15,7.5 Q15,0 25,5" stroke="black" strokeWidth="2" fill="none" />
      </svg>
    </motion.div>
  );
};

export default Bird;
