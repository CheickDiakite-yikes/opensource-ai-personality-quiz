
import React from 'react';
import { motion } from 'framer-motion';

const SkyElements: React.FC = () => {
  return (
    <>
      {/* Main sky background with enhanced gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300/80 via-blue-200/60 to-orange-100/50" />
      
      {/* Subtle moving clouds in background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30,50 Q40,40 50,50 Q60,60 70,50' stroke='white' stroke-width='2' fill='none' /%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '400px 0px'],
        }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear"
        }}
      />
      
      {/* Subtle color overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/10 via-transparent to-yellow-200/10" />
      
      {/* Trees with enhanced positioning for better visual balance */}
      <div className="ghibli-tree left hidden md:block" style={{ height: '180px', width: '120px', left: '3%', bottom: '5%' }} />
      <div className="ghibli-tree right hidden md:block" style={{ height: '220px', width: '140px', right: '3%', bottom: '2%' }} />
      <div className="ghibli-tree left hidden sm:block md:hidden" style={{ height: '160px', width: '100px', left: '2%', bottom: '5%' }} />
      <div className="ghibli-tree right hidden sm:block md:hidden" style={{ height: '190px', width: '120px', right: '2%', bottom: '3%' }} />
      
      {/* Grass layer with better positioning and responsiveness */}
      <div className="ghibli-grass absolute bottom-0 left-0 right-0 h-16 md:h-20" />
      
      {/* Distant mountains silhouette */}
      <div className="absolute bottom-[25%] left-0 right-0 h-[15%] opacity-20">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full">
          <path 
            d="M0,100 L150,70 L300,90 L450,40 L600,80 L750,30 L900,70 L1050,30 L1200,60 L1200,100 Z" 
            fill="#1a365d" 
          />
        </svg>
      </div>
      
      {/* Distant wisps */}
      <motion.div 
        className="absolute w-full h-24 bottom-[30%] opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='50' viewBox='0 0 200 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,40 Q20,35 40,40 Q60,45 80,40 Q100,35 120,40 Q140,45 160,40 Q180,35 200,40' stroke='white' stroke-width='1' fill='none' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 50px',
          backgroundRepeat: 'repeat-x'
        }}
        animate={{
          x: [0, -200],
        }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear"
        }}
      />
    </>
  );
};

export default SkyElements;
