
import React from 'react';
import { motion } from 'framer-motion';

export interface CloudProps {
  left: string;
  top: string;
  width: number;
  delay: number;
  duration: number;
}

const Cloud: React.FC<CloudProps> = ({ left, top, width, delay, duration }) => {
  return (
    <motion.div
      className="ghibli-cloud"
      style={{
        left,
        top,
        width
      }}
      initial={{
        x: '-100vw',
        opacity: 0
      }}
      animate={{
        x: '100vw',
        opacity: 1
      }}
      transition={{
        x: {
          duration,
          delay,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear'
        },
        opacity: {
          duration: 2
        }
      }}
    >
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30,90 Q45,110 75,100 Q80,120 105,110 Q130,125 150,110 Q175,120 190,100 Q200,85 185,75 Q195,55 180,45 Q185,25 165,25 Q155,5 130,15 Q115,0 95,10 Q85,0 70,10 Q55,0 40,15 Q15,10 5,30 Q-5,50 5,65 Q0,80 15,85 Q15,100 30,90"
          fill="white"
        />
      </svg>
    </motion.div>
  );
};

export default Cloud;
