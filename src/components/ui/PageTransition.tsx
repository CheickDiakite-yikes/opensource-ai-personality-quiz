
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Using React.memo to prevent unnecessary re-renders
const PageTransition = React.memo(({ children, className }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ 
        duration: 0.3, // Slightly faster transition
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={cn("h-full w-full", className)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4, // Slightly faster transition
          delay: 0.05, // Reduced delay
          ease: [0.22, 1, 0.36, 1]
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
