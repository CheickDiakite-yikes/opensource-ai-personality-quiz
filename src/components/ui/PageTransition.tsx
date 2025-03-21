
import React, { useRef, memo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Create a stable component with minimal animations to reduce blinking
const PageTransition = memo(({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  
  // Simplified transition to eliminate blinking
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0.98 }}
      animate={{ opacity: 1 }}
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
