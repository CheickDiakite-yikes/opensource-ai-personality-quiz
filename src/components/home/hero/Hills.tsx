
import React from 'react';

const Hills: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <svg
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-auto"
      >
        {/* Background hills - more saturated colors */}
        <path
          d="M0,200 L0,120 Q100,80 200,100 Q300,120 400,90 Q500,60 600,80 Q700,100 800,70 Q900,40 1000,60 Q1100,80 1200,60 L1200,200 Z"
          fill="#4caf50"
          opacity="0.5"
        />
        <path
          d="M0,200 L0,150 Q100,120 200,140 Q300,160 400,130 Q500,100 600,120 Q700,140 800,110 Q900,80 1000,100 Q1100,120 1200,100 L1200,200 Z"
          fill="#66bb6a"
          opacity="0.7"
        />
        <path
          d="M0,200 L0,180 Q100,160 200,170 Q300,180 400,160 Q500,140 600,150 Q700,160 800,140 Q900,120 1000,130 Q1100,140 1200,130 L1200,200 Z"
          fill="#81c784"
          opacity="0.8"
        />
      </svg>

      {/* Add some distant trees silhouettes */}
      <div className="absolute bottom-0 left-0 w-full h-24">
        <svg
          viewBox="0 0 1200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M50,100 L50,70 L45,80 L40,70 L35,80 L30,70 L25,80 L20,70 L15,80 L10,60 L5,80 L0,60 L0,100 Z"
            fill="#2e7d32"
            opacity="0.6"
          />
          <path
            d="M120,100 L120,50 L115,65 L110,50 L105,65 L100,50 L95,65 L90,50 L85,65 L80,40 L75,65 L70,40 L70,100 Z"
            fill="#2e7d32"
            opacity="0.5"
          />
          <path
            d="M330,100 L330,60 L325,75 L320,60 L315,75 L310,60 L305,75 L300,60 L295,75 L290,45 L285,75 L280,45 L280,100 Z"
            fill="#2e7d32"
            opacity="0.6"
          />
          <path
            d="M730,100 L730,55 L725,70 L720,55 L715,70 L710,55 L705,70 L700,55 L695,70 L690,40 L685,70 L680,40 L680,100 Z"
            fill="#2e7d32"
            opacity="0.5"
          />
          <path
            d="M1050,100 L1050,65 L1045,80 L1040,65 L1035,80 L1030,65 L1025,80 L1020,65 L1015,80 L1010,50 L1005,80 L1000,50 L1000,100 Z"
            fill="#2e7d32"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hills;
