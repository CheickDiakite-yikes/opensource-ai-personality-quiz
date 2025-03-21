
import React, { memo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Simplified transition that prioritizes stability over aesthetics
const PageTransition = memo(({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0.95 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.95 }}
      transition={{ 
        duration: 0.1,
        ease: "linear" 
      }}
      className={cn("h-full w-full", className)}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
