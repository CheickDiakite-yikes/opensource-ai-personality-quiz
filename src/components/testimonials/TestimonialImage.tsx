
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Testimonial } from "./AnimatedTestimonials";

interface TestimonialImageProps {
  testimonials: Testimonial[];
  active: number;
}

// Using React.memo to prevent unnecessary re-renders
const TestimonialImage = React.memo(({ testimonials, active }: TestimonialImageProps) => {
  const isActive = (index: number) => index === active;

  const randomRotateY = React.useCallback(() => {
    return Math.floor(Math.random() * 21) - 10;
  }, []);

  return (
    <div>
      <div className="relative h-80 w-full">
        {/* Decorative background elements */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-50/20 to-amber-50/20 -z-10"></div>
        
        <motion.div 
          className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-100/30 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -top-4 -right-4 w-20 h-20 bg-amber-100/30 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.imageSrc}
              initial={{
                opacity: 0,
                scale: 0.9,
                z: -100,
                rotate: randomRotateY(),
              }}
              animate={{
                opacity: isActive(index) ? 1 : 0.7,
                scale: isActive(index) ? 1 : 0.95,
                z: isActive(index) ? 0 : -100,
                rotate: isActive(index) ? 0 : randomRotateY(),
                zIndex: isActive(index)
                  ? 999
                  : testimonials.length + 2 - index,
                y: isActive(index) ? [0, -20, 0] : 0, // Softer float animation
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                z: 100,
                rotate: randomRotateY(),
              }}
              transition={{
                duration: 0.3, 
                ease: "easeInOut",
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute inset-0 origin-bottom will-change-transform"
            >
              <div
                style={{ 
                  backgroundImage: `url(${testimonial.imageSrc})` 
                }}
                className="h-full w-full rounded-3xl object-cover object-center bg-cover bg-center elegant-card overflow-hidden"
              >
                {/* Add a gentle overlay for Ghibli-like softness */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
                
                {/* Add a subtle border */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-3xl"></div>
              </div>
              
              {/* Add subtle animated shine effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0"
                animate={{
                  opacity: isActive(index) ? [0, 0.3, 0] : 0,
                  left: isActive(index) ? ["-100%", "100%", "100%"] : "-100%"
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

TestimonialImage.displayName = "TestimonialImage";

export default TestimonialImage;
