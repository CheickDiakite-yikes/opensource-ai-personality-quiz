
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
      className="p-4"
    >
      <h3 className="text-2xl font-bold text-amber-100 font-serif">
        {testimonial.name}
      </h3>
      <p className="text-sm text-amber-200 mb-4">
        {testimonial.designation}
      </p>
      <motion.p className="text-lg text-amber-50 leading-relaxed relative italic">
        <span className="absolute -left-6 -top-2 text-4xl text-amber-300/40">"</span>
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
        <span className="absolute -right-4 bottom-0 text-4xl text-amber-300/40">"</span>
      </motion.p>
    </motion.div>
  );
};

export default TestimonialContent;
