
import React, { memo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Create a stable component with minimal animations to prevent blinking
const PageTransition = memo(({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  
  // Extremely simplified transition to eliminate blinking entirely
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0.99 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.05,
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
