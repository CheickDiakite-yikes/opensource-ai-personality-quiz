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
    top: '20%',
    width: 120,
    delay: 0,
    duration: 120
  }, {
    left: '5%',
    top: '40%',
    width: 100,
    delay: 15,
    duration: 150
  }, {
    left: '15%',
    top: '60%',
    width: 80,
    delay: 30,
    duration: 100
  }, {
    left: '-5%',
    top: '70%',
    width: 140,
    delay: 5,
    duration: 140
  }, {
    left: '20%',
    top: '10%',
    width: 90,
    delay: 25,
    duration: 130
  }];

  // Generate leaves
  const leaves = Array.from({
    length: 10
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

  // Generate birds
  const birds = Array.from({
    length: 5
  }, (_, i) => ({
    key: `bird-${i}`,
    initialX: Math.random() * 20,
    initialY: Math.random() * 30 + 10,
    size: Math.random() * 4 + 4,
    duration: Math.random() * 20 + 40,
    delay: Math.random() * 5,
    yMovement: Math.random() * 10 - 5
  }));
  return <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-b-3xl">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300/80 via-blue-200/60 to-orange-100/50" />
      
      {/* Sun */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: mounted ? 0.9 : 0,
      y: 0
    }} transition={{
      duration: 2,
      delay: 0.5
    }} className="absolute top-[15%] right-[15%] h-20 w-20 rounded-full bg-yellow-200" style={{
      boxShadow: '0 0 40px 10px rgba(254, 240, 138, 0.8)'
    }} />
      
      {/* Clouds */}
      {clouds.map((cloud, index) => <motion.div key={`cloud-${index}`} className="ghibli-cloud" style={{
      left: cloud.left,
      top: cloud.top,
      width: cloud.width
    }} initial={{
      x: '-100vw',
      opacity: 0
    }} animate={{
      x: '100vw',
      opacity: mounted ? 0.9 : 0
    }} transition={{
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
    }}>
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30,90 Q45,110 75,100 Q80,120 105,110 Q130,125 150,110 Q175,120 190,100 Q200,85 185,75 Q195,55 180,45 Q185,25 165,25 Q155,5 130,15 Q115,0 95,10 Q85,0 70,10 Q55,0 40,15 Q15,10 5,30 Q-5,50 5,65 Q0,80 15,85 Q15,100 30,90" fill="white" />
          </svg>
        </motion.div>)}
      
      {/* Birds */}
      {birds.map(bird => <motion.div key={bird.key} className="absolute" style={{
      top: `${bird.initialY}%`,
      left: `${bird.initialX}%`
    }} initial={{
      x: '-10vw',
      y: 0
    }} animate={{
      x: '110vw',
      y: [0, bird.yMovement, 0, -bird.yMovement, 0]
    }} transition={{
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
    }}>
          <svg width={bird.size} height={bird.size / 2} viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,5 Q15,0 15,7.5 Q15,15 25,10" stroke="black" strokeWidth="2" fill="none" />
            <path d="M15,7.5 Q15,0 25,5" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>)}
      
      {/* Distant hills */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,200 L0,120 Q100,80 200,100 Q300,120 400,90 Q500,60 600,80 Q700,100 800,70 Q900,40 1000,60 Q1100,80 1200,60 L1200,200 Z" fill="#a5d6a7" opacity="0.6" />
          <path d="M0,200 L0,150 Q100,120 200,140 Q300,160 400,130 Q500,100 600,120 Q700,140 800,110 Q900,80 1000,100 Q1100,120 1200,100 L1200,200 Z" fill="#81c784" opacity="0.8" />
          <path d="M0,200 L0,180 Q100,160 200,170 Q300,180 400,160 Q500,140 600,150 Q700,160 800,140 Q900,120 1000,130 Q1100,140 1200,130 L1200,200 Z" fill="#66bb6a" />
        </svg>
      </div>
      
      {/* Leaves falling */}
      {leaves.map(leaf => <motion.div key={leaf.key} className="absolute" style={{
      top: `-${leaf.size}px`,
      left: `${leaf.initialX}%`,
      width: `${leaf.size}px`,
      height: `${leaf.size}px`
    }} initial={{
      y: '-10%',
      rotate: 0,
      opacity: 0
    }} animate={{
      y: '110%',
      rotate: 360 * leaf.rotationDirection,
      opacity: [0, 1, 1, 0.8, 0]
    }} transition={{
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
    }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,0 C70,25 100,50 50,100 C0,50 30,25 50,0 Z" fill="#66bb6a" opacity="0.8" />
          </svg>
        </motion.div>)}
      
      {/* Trees */}
      <div className="ghibli-tree left" />
      <div className="ghibli-tree right" />
      
      {/* Grass */}
      <div className="ghibli-grass" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="text-center px-4 max-w-2xl" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 1
      }}>
          <motion.img src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" alt="Who Am I Logo - AI Personality Assessment" className="h-24 w-auto mx-auto mb-6" initial={{
          scale: 0.8,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 1,
          delay: 1.5
        }} />
          <motion.h1 initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 1,
          delay: 1.7
        }} className="text-4xl md:text-6xl font-serif mb-6 drop-shadow-md text-slate-50">
            Discover Who You Really Are
          </motion.h1>
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 1,
          delay: 1.9
        }} className="text-xl mb-8 drop-shadow-sm text-orange-400">
            Our advanced AI personality assessment delivers deep insights about your unique traits, cognitive patterns, and emotional intelligence.
          </motion.p>
        </motion.div>
      </div>
    </div>;
};
export default GhibliHeroAnimation;