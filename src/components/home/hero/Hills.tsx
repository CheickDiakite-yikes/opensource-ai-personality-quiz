
import React from 'react';
import { motion } from 'framer-motion';

const Hills: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      {/* Additional distant hills with parallax effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <svg
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-auto"
        >
          <path
            d="M0,120 L0,80 Q300,60 600,90 Q900,120 1200,70 L1200,120 Z"
            fill="#c5e1a5"
            opacity="0.3"
          />
        </svg>
      </motion.div>
      
      {/* Main hills with richer details */}
      <svg
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-auto"
      >
        {/* Far background hills */}
        <path
          d="M0,200 L0,120 Q100,80 200,100 Q300,120 400,90 Q500,60 600,80 Q700,100 800,70 Q900,40 1000,60 Q1100,80 1200,60 L1200,200 Z"
          fill="#a5d6a7"
          opacity="0.6"
        >
          <animate 
            attributeName="d" 
            dur="30s" 
            repeatCount="indefinite"
            values="
              M0,200 L0,120 Q100,80 200,100 Q300,120 400,90 Q500,60 600,80 Q700,100 800,70 Q900,40 1000,60 Q1100,80 1200,60 L1200,200 Z;
              M0,200 L0,130 Q100,100 200,110 Q300,130 400,100 Q500,70 600,90 Q700,110 800,80 Q900,50 1000,70 Q1100,90 1200,70 L1200,200 Z;
              M0,200 L0,120 Q100,80 200,100 Q300,120 400,90 Q500,60 600,80 Q700,100 800,70 Q900,40 1000,60 Q1100,80 1200,60 L1200,200 Z"
            />
        </path>
        
        {/* Mid-ground hills with slight animation */}
        <path
          d="M0,200 L0,150 Q100,120 200,140 Q300,160 400,130 Q500,100 600,120 Q700,140 800,110 Q900,80 1000,100 Q1100,120 1200,100 L1200,200 Z"
          fill="#81c784"
          opacity="0.8"
        >
          <animate 
            attributeName="d" 
            dur="20s" 
            repeatCount="indefinite"
            values="
              M0,200 L0,150 Q100,120 200,140 Q300,160 400,130 Q500,100 600,120 Q700,140 800,110 Q900,80 1000,100 Q1100,120 1200,100 L1200,200 Z;
              M0,200 L0,160 Q100,130 200,150 Q300,170 400,140 Q500,110 600,130 Q700,150 800,120 Q900,90 1000,110 Q1100,130 1200,110 L1200,200 Z;
              M0,200 L0,150 Q100,120 200,140 Q300,160 400,130 Q500,100 600,120 Q700,140 800,110 Q900,80 1000,100 Q1100,120 1200,100 L1200,200 Z"
            />
        </path>
        
        {/* Foreground hills with subtle movement */}
        <path
          d="M0,200 L0,180 Q100,160 200,170 Q300,180 400,160 Q500,140 600,150 Q700,160 800,140 Q900,120 1000,130 Q1100,140 1200,130 L1200,200 Z"
          fill="#66bb6a"
        >
          <animate 
            attributeName="d" 
            dur="15s" 
            repeatCount="indefinite"
            values="
              M0,200 L0,180 Q100,160 200,170 Q300,180 400,160 Q500,140 600,150 Q700,160 800,140 Q900,120 1000,130 Q1100,140 1200,130 L1200,200 Z;
              M0,200 L0,185 Q100,165 200,175 Q300,185 400,165 Q500,145 600,155 Q700,165 800,145 Q900,125 1000,135 Q1100,145 1200,135 L1200,200 Z;
              M0,200 L0,180 Q100,160 200,170 Q300,180 400,160 Q500,140 600,150 Q700,160 800,140 Q900,120 1000,130 Q1100,140 1200,130 L1200,200 Z"
            />
        </path>
        
        {/* Small accents/details on the hills */}
        <g className="hill-details">
          <circle cx="300" cy="165" r="3" fill="#388e3c" opacity="0.7" />
          <circle cx="310" cy="167" r="2" fill="#388e3c" opacity="0.7" />
          <circle cx="320" cy="164" r="4" fill="#388e3c" opacity="0.7" />
          
          <circle cx="700" cy="145" r="3" fill="#388e3c" opacity="0.7" />
          <circle cx="710" cy="147" r="2" fill="#388e3c" opacity="0.7" />
          <circle cx="720" cy="144" r="4" fill="#388e3c" opacity="0.7" />
          
          <circle cx="1000" cy="125" r="3" fill="#388e3c" opacity="0.7" />
          <circle cx="1010" cy="127" r="2" fill="#388e3c" opacity="0.7" />
          <circle cx="1020" cy="124" r="4" fill="#388e3c" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
};

export default Hills;
