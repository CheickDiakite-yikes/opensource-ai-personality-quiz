
import React from 'react';
import { motion } from 'framer-motion';

export interface LeafProps {
  initialX: number;
  initialY: number;
  size: number;
  rotationDuration: number;
  fallDuration: number;
  delay: number;
  rotationDirection: number;
}

const Leaf: React.FC<LeafProps> = ({
  initialX,
  initialY,
  size,
  rotationDuration,
  fallDuration,
  delay,
  rotationDirection
}) => {
  return (
    <motion.div
      className="absolute"
      style={{
        top: `-${size}px`,
        left: `${initialX}%`,
        width: `${size}px`,
        height: `${size}px`
      }}
      initial={{
        y: '-10%',
        rotate: 0,
        opacity: 0
      }}
      animate={{
        y: '110%',
        rotate: 360 * rotationDirection,
        opacity: [0, 1, 1, 0.8, 0]
      }}
      transition={{
        y: {
          duration: fallDuration,
          delay,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeIn'
        },
        rotate: {
          duration: rotationDuration,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear'
        },
        opacity: {
          duration: fallDuration,
          delay,
          repeat: Infinity,
          times: [0, 0.1, 0.7, 0.9, 1]
        }
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,0 C70,25 100,50 50,100 C0,50 30,25 50,0 Z" fill="#66bb6a" opacity="0.8" />
      </svg>
    </motion.div>
  );
};

export default Leaf;
