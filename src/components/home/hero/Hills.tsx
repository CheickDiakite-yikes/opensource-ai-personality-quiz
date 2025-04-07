
import React from 'react';

const Hills: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <svg
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L0,120 Q100,80 200,100 Q300,120 400,90 Q500,60 600,80 Q700,100 800,70 Q900,40 1000,60 Q1100,80 1200,60 L1200,200 Z"
          fill="#a5d6a7"
          opacity="0.6"
        />
        <path
          d="M0,200 L0,150 Q100,120 200,140 Q300,160 400,130 Q500,100 600,120 Q700,140 800,110 Q900,80 1000,100 Q1100,120 1200,100 L1200,200 Z"
          fill="#81c784"
          opacity="0.8"
        />
        <path
          d="M0,200 L0,180 Q100,160 200,170 Q300,180 400,160 Q500,140 600,150 Q700,160 800,140 Q900,120 1000,130 Q1100,140 1200,130 L1200,200 Z"
          fill="#66bb6a"
        />
      </svg>
    </div>
  );
};

export default Hills;
