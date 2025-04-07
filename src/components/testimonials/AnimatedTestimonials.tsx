
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TestimonialImage from "./TestimonialImage";
import TestimonialContent from "./TestimonialContent";
import TestimonialControls from "./TestimonialControls";
import { Sparkle, Wind } from "lucide-react";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  imageSrc: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  return (
    <div className={cn(
      "max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12 relative z-10 overflow-hidden", 
      className
    )}>
      {/* Ghibli-inspired decorative elements */}
      <div className="absolute inset-0 -z-10 ghibli-paper-texture rounded-3xl opacity-40"></div>
      
      {/* Decorative animated elements */}
      <motion.div 
        className="absolute -top-8 -left-8 text-primary/40 hidden sm:block" 
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Wind size={40} strokeWidth={1} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-6 right-6 text-primary/30 hidden sm:block" 
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1 
        }}
      >
        <Sparkle size={30} strokeWidth={1} />
      </motion.div>

      {/* Floating particles */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-2 h-2 rounded-full bg-primary/10 hidden sm:block"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Content */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        {/* Subtle border decoration */}
        <div className="absolute inset-0 border-2 border-primary/10 rounded-2xl -z-5 transform md:translate-x-4 md:translate-y-4 opacity-40" />
        
        <TestimonialImage 
          testimonials={testimonials} 
          active={active}
        />
        
        <div className="flex justify-between flex-col py-4">
          <TestimonialContent 
            testimonial={testimonials[active]}
            key={active}
          />
          
          <TestimonialControls 
            onPrev={handlePrev} 
            onNext={handleNext} 
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedTestimonials;
