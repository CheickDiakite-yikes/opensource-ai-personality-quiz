
import React, { useEffect, useState } from 'react';
import SkyElements from './hero/SkyElements';
import Sun from './hero/Sun';
import Cloud from './hero/Cloud';
import Bird from './hero/Bird';
import Hills from './hero/Hills';
import Leaf from './hero/Leaf';
import HeroContent from './hero/HeroContent';
import { useAnimationElements } from './hero/useAnimationElements';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const GhibliHeroAnimation: React.FC = () => {
  const { mounted, clouds, birds, leaves } = useAnimationElements();
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);
  
  useEffect(() => {
    // Create sparkle elements
    setSparkles(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 5
    })));
  }, []);

  return (
    <div className="relative h-[550px] md:h-[650px] lg:h-[700px] overflow-hidden rounded-b-[50px]">
      {/* Sky and static elements */}
      <SkyElements />
      
      {/* Sun */}
      <Sun mounted={mounted} />
      
      {/* Sparkles - new element */}
      {sparkles.map(sparkle => (
        <motion.div 
          key={`sparkle-${sparkle.id}`}
          className="absolute pointer-events-none text-yellow-300/70"
          style={{ 
            left: `${sparkle.x}%`, 
            top: `${sparkle.y}%`, 
          }}
          animate={{ 
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2,
            delay: sparkle.delay,
            repeat: Infinity 
          }}
        >
          <Sparkles size={sparkle.size} />
        </motion.div>
      ))}
      
      {/* Clouds */}
      {clouds.map((cloud, index) => (
        <Cloud key={`cloud-${index}`} {...cloud} />
      ))}
      
      {/* Birds */}
      {birds.map((bird) => (
        <Bird key={bird.key} {...bird} />
      ))}
      
      {/* Hills */}
      <Hills />
      
      {/* Falling leaves */}
      {leaves.map(leaf => (
        <Leaf key={leaf.key} {...leaf} />
      ))}
      
      {/* Content overlay */}
      <HeroContent mounted={mounted} />
      
      {/* Decorative elements - floating wisps */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div 
            key={`wisp-${i}`}
            className="absolute h-40 w-40 rounded-full bg-gradient-to-r from-white/5 to-transparent blur-xl"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 15}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 10, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GhibliHeroAnimation;
