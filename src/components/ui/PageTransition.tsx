
import React, { memo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Create a stable component with minimal animations
const PageTransition = memo(({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  
  // Simple fade transition that doesn't cause flickering
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0.99 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.05
      }}
      className={cn("h-full w-full", className)}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
