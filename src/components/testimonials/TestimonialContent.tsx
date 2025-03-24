
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
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="flex flex-col h-full justify-center"
    >
      <h3 className="text-2xl font-bold text-foreground font-serif mb-1">
        {testimonial.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {testimonial.designation}
      </p>
      <motion.blockquote className="text-lg text-muted-foreground">
        {testimonial.quote.split(" ").map((word, index) => (
          <motion.span
            key={index}
            initial={{
              filter: "blur(10px)",
              opacity: 0,
              y: 5,
            }}
            animate={{
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
              delay: 0.02 * index,
            }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.blockquote>
    </motion.div>
  );
};

export default TestimonialContent;
