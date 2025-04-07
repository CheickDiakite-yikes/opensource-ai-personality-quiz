
import React from 'react';
import { motion } from 'framer-motion';

const Hills: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
      {/* Farthest hill - light color */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        <svg
          viewBox="0 0 1200 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
        >
          <path
            d="M0,150 L0,90 Q150,65 300,85 Q450,100 600,75 Q750,50 900,70 Q1050,85 1200,70 L1200,150 Z"
            fill="#d8e8c8"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* Middle hill - medium color */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      >
        <svg
          viewBox="0 0 1200 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
        >
          <path
            d="M0,170 L0,100 Q200,70 400,90 Q600,110 800,80 Q1000,50 1200,75 L1200,170 Z"
            fill="#a5d6a7"
            opacity="0.7"
          />
        </svg>
      </motion.div>

      {/* Front hill - darkest color */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full"
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      >
        <svg
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
        >
          <path
            d="M0,200 L0,130 Q100,100 200,110 Q300,120 400,100 Q500,80 600,90 Q700,100 800,80 Q900,60 1000,70 Q1100,80 1200,70 L1200,200 Z"
            fill="#81c784"
            opacity="0.9"
          />
        </svg>
      </motion.div>

      {/* Foreground hill - darkest color */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <svg
          viewBox="0 0 1200 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
        >
          <path
            d="M0,150 L0,80 Q150,60 300,70 Q450,80 600,60 Q750,40 900,50 Q1050,60 1200,50 L1200,150 Z"
            fill="#66bb6a"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default Hills;
