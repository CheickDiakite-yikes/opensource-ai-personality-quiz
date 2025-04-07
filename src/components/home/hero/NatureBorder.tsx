
import React from 'react';
import { motion } from 'framer-motion';

const NatureBorder: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Ghibli-style grass transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-contain bg-repeat-x" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='20' viewBox='0 0 60 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 16c2.5-2.5 4.5-5 5-8 .7 3 2 5.5 5 8M30 16c0 0 1.5-3 6-8M12 16c-2-4-1-8 2-12M30 16c0-4-.5-8 0-12M42 16c1.5-4 1.5-8-2-12' stroke='%2366bb6a' stroke-width='2' fill='none' /%3E%3C/svg%3E")`,
          opacity: 0.8
        }}
      ></div>
      
      {/* Small animated elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        {/* Flying seeds/dandelions */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`seed-${i}`}
            className="absolute bottom-8"
            style={{
              left: `${10 + i * 10}%`,
              width: '12px',
              height: '12px'
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ 
              y: [-10, -50], 
              x: [(i % 2 === 0 ? 20 : -20), (i % 2 === 0 ? -20 : 20)],
              opacity: [0, 1, 0] 
            }}
            transition={{
              duration: 8,
              delay: i * 0.5,
              repeat: Infinity,
              repeatType: 'loop'
            }}
          >
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="2" fill="#fff" />
              <g opacity="0.7">
                {[...Array(8)].map((_, j) => (
                  <line
                    key={j}
                    x1="10"
                    y1="10"
                    x2={10 + Math.cos(j * Math.PI / 4) * 8}
                    y2={10 + Math.sin(j * Math.PI / 4) * 8}
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            </svg>
          </motion.div>
        ))}
        
        {/* Small fireflies/light particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="absolute"
            style={{
              left: `${5 + i * 8}%`,
              bottom: `${Math.random() * 16}px`,
              width: '4px',
              height: '4px',
              backgroundColor: 'rgba(255, 251, 172, 0.8)',
              borderRadius: '50%',
              filter: 'blur(1px)',
              boxShadow: '0 0 4px 2px rgba(255, 251, 172, 0.3)'
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + i % 3,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
      
      {/* Wave pattern */}
      <svg 
        className="w-full h-12 fill-green-500/30" 
        preserveAspectRatio="none" 
        viewBox="0 0 1200 120" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".2"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".3"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" opacity=".3"></path>
      </svg>
    </div>
  );
};

export default NatureBorder;
