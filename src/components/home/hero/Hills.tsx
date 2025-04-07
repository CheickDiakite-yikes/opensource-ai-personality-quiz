
import React from 'react';

const Hills: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <svg
        viewBox="0 0 1200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-auto"
      >
        {/* Farthest hill - lightest */}
        <path
          d="M0,300 L0,170 Q150,110 300,140 Q450,170 600,130 Q750,90 900,110 Q1050,130 1200,100 L1200,300 Z"
          fill="#c8e6c9"
          opacity="0.5"
        />
        
        {/* Middle hill */}
        <path
          d="M0,300 L0,200 Q150,150 300,180 Q450,210 600,170 Q750,130 900,160 Q1050,190 1200,160 L1200,300 Z"
          fill="#a5d6a7"
          opacity="0.7"
        />
        
        {/* Middle-front hill */}
        <path
          d="M0,300 L0,230 Q150,180 300,210 Q450,240 600,200 Q750,160 900,190 Q1050,220 1200,190 L1200,300 Z"
          fill="#81c784"
          opacity="0.8"
        />
        
        {/* Closest hill - darkest */}
        <path
          d="M0,300 L0,260 Q150,220 300,240 Q450,260 600,230 Q750,200 900,220 Q1050,240 1200,220 L1200,300 Z"
          fill="#66bb6a"
        />
      </svg>
    </div>
  );
};

export default Hills;
