
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CloudSun, Cloud, Bird, Leaf } from "lucide-react";

const GhibliHeroAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate random positions for floating elements
  const generateRandomPosition = () => {
    return {
      x: Math.floor(Math.random() * 80) + 10, // 10-90% of width
      y: Math.floor(Math.random() * 60) + 10, // 10-70% of height
      delay: Math.random() * 2,
      duration: Math.random() * 4 + 4 // 4-8 seconds
    };
  };
  
  // Create multiple clouds, birds and leaves with random positions
  const clouds = Array.from({ length: 5 }, (_, i) => generateRandomPosition());
  const birds = Array.from({ length: 3 }, (_, i) => generateRandomPosition());
  const leaves = Array.from({ length: 6 }, (_, i) => generateRandomPosition());
  
  return (
    <div ref={containerRef} className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl bg-gradient-to-b from-sky-300 to-sky-100">
      {/* Hills in background */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="#85C285" 
            fillOpacity="0.8" 
            d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,208C840,213,960,203,1080,176C1200,149,1320,107,1380,85.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
          </path>
        </svg>
      </div>
      
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="#9B7653" 
            fillOpacity="0.4" 
            d="M0,288L48,261.3C96,235,192,181,288,170.7C384,160,480,192,576,202.7C672,213,768,203,864,218.7C960,235,1056,277,1152,277.3C1248,277,1344,235,1392,213.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
      
      {/* Animated sun */}
      <motion.div 
        className="absolute text-amber-400"
        style={{ top: '15%', right: '15%' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      >
        <CloudSun size={60} strokeWidth={1} />
      </motion.div>
      
      {/* Animated clouds */}
      {clouds.map((cloud, index) => (
        <motion.div
          key={`cloud-${index}`}
          className="absolute text-white opacity-80"
          style={{ 
            top: `${cloud.y}%`, 
            left: `${index % 2 === 0 ? -10 : 110}%` 
          }}
          animate={{ 
            x: index % 2 === 0 ? ['0%', '110%'] : ['0%', '-110%'],
            y: [0, -5, 5, 0]
          }}
          transition={{ 
            x: { 
              duration: cloud.duration + 15,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: cloud.delay 
            },
            y: {
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        >
          <Cloud size={30 + index * 5} strokeWidth={1} />
        </motion.div>
      ))}
      
      {/* Animated birds */}
      {birds.map((bird, index) => (
        <motion.div
          key={`bird-${index}`}
          className="absolute text-gray-800"
          style={{ 
            top: `${bird.y}%`, 
            left: `${index % 2 === 0 ? -5 : 105}%` 
          }}
          animate={{ 
            x: index % 2 === 0 ? ['0%', '110%'] : ['0%', '-110%'],
            y: [0, -10, -5, -15, 0]
          }}
          transition={{ 
            x: { 
              duration: bird.duration + 8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: bird.delay 
            },
            y: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        >
          <Bird size={16 + index * 2} strokeWidth={1.5} />
        </motion.div>
      ))}
      
      {/* Animated leaves */}
      {leaves.map((leaf, index) => (
        <motion.div
          key={`leaf-${index}`}
          className="absolute text-green-600"
          style={{ 
            top: `${leaf.y - 20}%`, 
            left: `${leaf.x}%` 
          }}
          animate={{ 
            y: ['0%', '120%'],
            rotate: [0, 360],
            x: [0, leaf.x % 2 === 0 ? 20 : -20]
          }}
          transition={{ 
            y: { 
              duration: leaf.duration + 5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeIn",
              delay: leaf.delay 
            },
            rotate: {
              duration: leaf.duration,
              repeat: Infinity,
              ease: "linear"
            },
            x: {
              duration: leaf.duration * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        >
          <Leaf size={12 + index * 2} strokeWidth={1.5} />
        </motion.div>
      ))}
      
      {/* Small house in the distance */}
      <div className="absolute bottom-14 right-12 hidden md:block">
        <div className="w-16 h-12 bg-amber-800 rounded-sm"></div>
        <div className="w-16 h-8 bg-amber-900 absolute -top-8 left-0" style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}></div>
      </div>
      
      {/* Tree silhouettes */}
      <div className="absolute bottom-16 left-14 hidden md:block">
        <div className="w-10 h-16 bg-green-900 rounded-full"></div>
        <div className="w-8 h-14 bg-green-800 rounded-full absolute -right-6 -top-2"></div>
        <div className="w-6 h-10 bg-green-800 rounded-full absolute -left-4 top-0"></div>
        <div className="w-4 h-8 bg-emerald-800 absolute left-3 -top-6 rounded-full"></div>
      </div>
      
      <div className="absolute bottom-16 right-32 hidden md:block">
        <div className="w-8 h-12 bg-green-900 rounded-full"></div>
      </div>
      
      {/* Title overlay with slight transparency for better readability */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-4 rounded-xl bg-white/30 backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-indie text-amber-900 text-center">
            Who Am I?
          </h1>
          <p className="text-amber-800 font-medium text-center">
            Discover your true nature
          </p>
        </div>
      </div>
    </div>
  );
};

export default GhibliHeroAnimation;
