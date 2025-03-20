
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Testimonial } from "./AnimatedTestimonials";

interface TestimonialImageProps {
  testimonials: Testimonial[];
  active: number;
}

const TestimonialImage: React.FC<TestimonialImageProps> = ({ testimonials, active }) => {
  const isActive = (index: number) => index === active;

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

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
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 origin-bottom"
            >
              <div
                style={{ 
                  backgroundImage: `url(${testimonial.imageSrc})` 
                }}
                className="h-full w-full rounded-3xl object-cover object-center bg-cover bg-center elegant-card"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialImage;
