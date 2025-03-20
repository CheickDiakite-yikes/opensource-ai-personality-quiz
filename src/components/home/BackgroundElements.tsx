
import React from "react";
import { motion } from "framer-motion";
import { Brain, Star, Sparkles, Users } from "lucide-react";

const BackgroundElements: React.FC = () => {
  // Fixed animation variants with proper typing
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
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10 animate-rotate-glow">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-3xl" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 animate-pulse-subtle">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-3xl" />
        </div>
        <div className="absolute top-1/4 right-1/4 opacity-10">
          <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-3xl" />
        </div>
      </div>
      
      {/* Floating Icons */}
      <motion.div 
        className="absolute top-20 right-20 text-primary/20"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
      >
        <Brain size={40} />
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-20 text-primary/20"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Star size={30} />
      </motion.div>
      <motion.div 
        className="absolute top-40 left-[40%] text-primary/20"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5 }}
      >
        <Sparkles size={35} />
      </motion.div>
      <motion.div 
        className="absolute bottom-80 right-[30%] text-primary/20"
        variants={floatingIconsVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 1.5 }}
      >
        <Users size={38} />
      </motion.div>
    </>
  );
};

export default BackgroundElements;
