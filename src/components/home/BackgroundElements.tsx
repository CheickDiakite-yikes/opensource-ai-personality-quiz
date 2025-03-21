
import React from "react";
import { motion } from "framer-motion";
import { Brain, Star, Sparkles, Users } from "lucide-react";

// Using React.memo to prevent unnecessary re-renders
const BackgroundElements = React.memo(() => {
  // Fixed animation variants with proper typing and optimized performance
  const floatingIconsVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "mirror" as "mirror",
        ease: "easeInOut",
        delay: Math.random() * 2
      }
    }
  };
  
  return (
    <>
      {/* Background Elements - Optimized for performance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10 animate-rotate-glow">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-3xl will-change-transform" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 animate-pulse-subtle">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-3xl will-change-transform" />
        </div>
        <div className="absolute top-1/4 right-1/4 opacity-10">
          <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-3xl" />
        </div>
      </div>
      
      {/* Floating Icons - Using will-change for better GPU acceleration */}
      <motion.div 
        className="absolute top-20 right-20 text-primary/20 will-change-transform"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
      >
        <Brain size={40} />
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-20 text-primary/20 will-change-transform"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Star size={30} />
      </motion.div>
      <motion.div 
        className="absolute top-40 left-[40%] text-primary/20 will-change-transform"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5 }}
      >
        <Sparkles size={35} />
      </motion.div>
      <motion.div 
        className="absolute bottom-80 right-[30%] text-primary/20 will-change-transform"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1.5 }}
      >
        <Users size={38} />
      </motion.div>
    </>
  );
});

BackgroundElements.displayName = "BackgroundElements";

export default BackgroundElements;
