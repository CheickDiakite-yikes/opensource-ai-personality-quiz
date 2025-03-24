
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
    >
      <h3 className="text-2xl font-bold text-foreground font-serif">
        {testimonial.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        {testimonial.designation}
      </p>
      <motion.p className="text-lg text-muted-foreground mt-8">
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
      </motion.p>
    </motion.div>
  );
};

export default TestimonialContent;
