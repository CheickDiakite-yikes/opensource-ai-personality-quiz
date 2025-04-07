
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GhibliHeroAnimation: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Generate clouds
  const clouds = [{
    left: '10%',
    top: '10%',
    width: 120,
    delay: 0,
    duration: 120
  }, {
    left: '5%',
    top: '25%',
    width: 100,
    delay: 15,
    duration: 150
  }, {
    left: '15%',
    top: '45%',
    width: 80,
    delay: 30,
    duration: 100
  }, {
    left: '-5%',
    top: '55%',
    width: 140,
    delay: 5,
    duration: 140
  }, {
    left: '20%',
    top: '5%',
    width: 90,
    delay: 25,
    duration: 130
  }];

  // Generate leaves - reduced quantity
  const leaves = Array.from({
    length: 6
  }, (_, i) => ({
    key: `leaf-${i}`,
    initialX: Math.random() * 100,
    initialY: Math.random() * 30 + 10,
    size: Math.random() * 15 + 10,
    rotationDuration: Math.random() * 10 + 20,
    fallDuration: Math.random() * 15 + 15,
    delay: Math.random() * 10,
    rotationDirection: Math.random() > 0.5 ? 1 : -1
  }));

  // Generate birds - reduced quantity
  const birds = Array.from({
    length: 3
  }, (_, i) => ({
    key: `bird-${i}`,
    initialX: Math.random() * 20,
    initialY: Math.random() * 20 + 5,
    size: Math.random() * 4 + 4,
    duration: Math.random() * 20 + 40,
    delay: Math.random() * 5,
    yMovement: Math.random() * 10 - 5
  }));
  
  // Brain logo animated elements
  const brainParts = [
    { color: "#F97316", d: "M45,55 Q60,35 50,20 Q35,30 45,55", delay: 0.2 },
    { color: "#9b87f5", d: "M55,45 Q75,35 70,15 Q55,20 55,45", delay: 0.3 },
    { color: "#66bb6a", d: "M60,50 Q80,45 85,30 Q70,25 60,50", delay: 0.4 }
  ];
  
  return (
    <div className="relative h-[460px] sm:h-[500px] overflow-hidden rounded-b-3xl">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300/80 via-blue-200/60 to-orange-100/50" />
      
      {/* Sun */}
      <motion.div 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: mounted ? 0.9 : 0,
          y: 0
        }} 
        transition={{
          duration: 2,
          delay: 0.5
        }} 
        className="absolute top-[10%] right-[15%] h-20 w-20 rounded-full bg-yellow-200" 
        style={{
          boxShadow: '0 0 40px 10px rgba(254, 240, 138, 0.8)'
        }} 
      />
      
      {/* Clouds - moved up for better spacing */}
      {clouds.map((cloud, index) => (
        <motion.div 
          key={`cloud-${index}`} 
          className="ghibli-cloud" 
          style={{
            left: cloud.left,
            top: cloud.top,
            width: cloud.width
          }} 
          initial={{
            x: '-100vw',
            opacity: 0
          }} 
          animate={{
            x: '100vw',
            opacity: mounted ? 0.9 : 0
          }} 
          transition={{
            x: {
              duration: cloud.duration,
              delay: cloud.delay,
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
            <path d="M30,90 Q45,110 75,100 Q80,120 105,110 Q130,125 150,110 Q175,120 190,100 Q200,85 185,75 Q195,55 180,45 Q185,25 165,25 Q155,5 130,15 Q115,0 95,10 Q85,0 70,10 Q55,0 40,15 Q15,10 5,30 Q-5,50 5,65 Q0,80 15,85 Q15,100 30,90" fill="white" />
          </svg>
        </motion.div>
      ))}
      
      {/* Birds - moved up for better visibility */}
      {birds.map(bird => (
        <motion.div 
          key={bird.key} 
          className="absolute" 
          style={{
            top: `${bird.initialY}%`,
            left: `${bird.initialX}%`
          }} 
          initial={{
            x: '-10vw',
            y: 0
          }} 
          animate={{
            x: '110vw',
            y: [0, bird.yMovement, 0, -bird.yMovement, 0]
          }} 
          transition={{
            x: {
              duration: bird.duration,
              delay: bird.delay,
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
          <svg width={bird.size} height={bird.size / 2} viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,5 Q15,0 15,7.5 Q15,15 25,10" stroke="black" strokeWidth="2" fill="none" />
            <path d="M15,7.5 Q15,0 25,5" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
      ))}
      
      {/* Distant hills - made taller with better waves */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 240" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,240 L0,140 Q100,100 200,120 Q300,140 400,110 Q500,80 600,100 Q700,120 800,90 Q900,60 1000,80 Q1100,100 1200,80 L1200,240 Z" fill="#a5d6a7" opacity="0.6" />
          <path d="M0,240 L0,170 Q100,140 200,160 Q300,180 400,150 Q500,120 600,140 Q700,160 800,130 Q900,100 1000,120 Q1100,140 1200,120 L1200,240 Z" fill="#81c784" opacity="0.8" />
          <path d="M0,240 L0,200 Q100,180 200,190 Q300,200 400,180 Q500,160 600,170 Q700,180 800,160 Q900,140 1000,150 Q1100,160 1200,150 L1200,240 Z" fill="#66bb6a" />
        </svg>
      </div>
      
      {/* Leaves falling - reduced quantity for better performance */}
      {leaves.map(leaf => (
        <motion.div 
          key={leaf.key} 
          className="absolute" 
          style={{
            top: `-${leaf.size}px`,
            left: `${leaf.initialX}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`
          }} 
          initial={{
            y: '-10%',
            rotate: 0,
            opacity: 0
          }} 
          animate={{
            y: '110%',
            rotate: 360 * leaf.rotationDirection,
            opacity: [0, 1, 1, 0.8, 0]
          }} 
          transition={{
            y: {
              duration: leaf.fallDuration,
              delay: leaf.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeIn'
            },
            rotate: {
              duration: leaf.rotationDuration,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear'
            },
            opacity: {
              duration: leaf.fallDuration,
              delay: leaf.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.7, 0.9, 1]
            }
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,0 C70,25 100,50 50,100 C0,50 30,25 50,0 Z" fill="#66bb6a" opacity="0.8" />
          </svg>
        </motion.div>
      ))}
      
      {/* Trees - positioned better */}
      <div className="ghibli-tree left" />
      <div className="ghibli-tree right" />
      
      {/* Grass */}
      <div className="ghibli-grass" />
      
      {/* Content overlay - adjusted for better spacing */}
      <div className="absolute inset-0 flex items-center justify-center pt-4">
        <motion.div 
          className="text-center px-4 max-w-2xl" 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 1,
            delay: 1
          }}
        >
          {/* Brain logo animation */}
          <motion.div 
            className="relative h-20 mx-auto mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Base brain shape */}
            <motion.svg 
              width="120" 
              height="80" 
              viewBox="0 0 100 80" 
              className="mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              {/* Brain stem */}
              <motion.path 
                d="M50,80 C48,65 48,60 50,50 C52,60 52,65 50,80 Z" 
                fill="#5d4037"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
              />
              
              {/* Animated brain parts */}
              {brainParts.map((part, i) => (
                <motion.path 
                  key={i}
                  d={part.d}
                  fill={part.color}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: part.delay }}
                />
              ))}
              
              {/* Additional brain parts */}
              <motion.path 
                d="M40,40 Q20,45 15,30 Q30,25 40,40" 
                fill="#ea384c"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
              
              <motion.text 
                x="35" 
                y="70" 
                fontFamily="Arial" 
                fontSize="12" 
                fontWeight="bold" 
                fill="#5d4037"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                WAI?
              </motion.text>
            </motion.svg>
          </motion.div>
          
          <motion.h1 
            initial={{
              opacity: 0
            }} 
            animate={{
              opacity: 1
            }} 
            transition={{
              duration: 1,
              delay: 1.7
            }} 
            className="text-4xl md:text-6xl font-serif mb-3 drop-shadow-md text-slate-50"
          >
            Discover Who You Really Are
          </motion.h1>
          
          <motion.p 
            initial={{
              opacity: 0
            }} 
            animate={{
              opacity: 1
            }} 
            transition={{
              duration: 1,
              delay: 1.9
            }} 
            className="text-lg sm:text-xl mb-6 drop-shadow-sm text-orange-900"
          >
            Our advanced AI personality assessment delivers deep insights about your unique traits, cognitive patterns, and emotional intelligence.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default GhibliHeroAnimation;
