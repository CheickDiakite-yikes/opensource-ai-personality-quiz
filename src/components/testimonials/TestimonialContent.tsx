
import React from "react";
import { motion } from "framer-motion";
import { Testimonial } from "./AnimatedTestimonials";

interface TestimonialContentProps {
  testimonial: Testimonial;
}

const TestimonialContent: React.FC<TestimonialContentProps> = ({ testimonial }) => {
  return (
    <motion.div
      initial={{
        y: 20,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: -20,
        opacity: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="flex flex-col h-full"
    >
      <div className="flex-1">
        <motion.p className="text-lg text-muted-foreground mb-6 italic">
          "{testimonial.quote}"
        </motion.p>
      </div>
      
      <div className="mt-auto">
        <h3 className="text-xl font-bold text-foreground font-serif">
          {testimonial.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {testimonial.designation}
        </p>
      </div>
    </motion.div>
  );
};

export default TestimonialContent;
