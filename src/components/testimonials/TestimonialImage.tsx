
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
                y: isActive(index) ? [0, -30, 0] : 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                z: 100,
                rotate: randomRotateY(),
              }}
              transition={{
                duration: 0.3, // Slightly faster for better UX
                ease: "easeInOut",
              }}
              className="absolute inset-0 origin-bottom will-change-transform"
            >
              <div className="h-full w-full rounded-3xl overflow-hidden elegant-card">
                <img 
                  src={testimonial.imageSrc} 
                  alt={`${testimonial.name}, ${testimonial.designation}`}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

TestimonialImage.displayName = "TestimonialImage";

export default TestimonialImage;
