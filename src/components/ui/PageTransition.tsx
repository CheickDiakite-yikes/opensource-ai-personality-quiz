
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Using React.memo to prevent unnecessary re-renders
const PageTransition = React.memo(({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  
  // Only animate when the path actually changes
  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);
  
  // Simpler, more stable animation
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.2, // Shorter duration
        ease: "easeOut" // Simpler easing function
      }}
      className={cn("h-full w-full", className)}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
