
import React, { useRef, useEffect, memo } from "react";
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
  const prevPathRef = useRef<string>(location.pathname);
  const isInitialMount = useRef(true);
  
  // Only animate when the path actually changes and not on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);
  
  // Even simpler, more stable animation with no exit animation
  return (
    <motion.div
      key={location.pathname}
      initial={isInitialMount.current ? { opacity: 1 } : { opacity: 0.95 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.15, // Even shorter duration
        ease: "linear" // Linear easing to reduce perceived blinking
      }}
      className={cn("h-full w-full", className)}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
