
import React from "react";
import { motion } from "framer-motion";
import { Testimonial } from "./AnimatedTestimonials";
import { QuoteIcon } from "lucide-react";

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
      className="ghibli-testimonial-card relative"
    >
      {/* Decorative elements */}
      <div className="absolute -left-2 -top-2 text-emerald-700/30">
        <QuoteIcon size={24} />
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-400/5 rounded-full blur-xl"></div>
      
      <h3 className="text-2xl font-bold text-foreground font-serif">
        {testimonial.name}
      </h3>
      
      <p className="text-sm text-foreground/70 font-medium mb-2">
        {testimonial.designation}
      </p>
      
      <motion.p className="text-lg text-foreground mt-8 relative">
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
      
      {/* Ghibli-style leaf decoration */}
      <motion.div 
        className="absolute bottom-0 right-0 w-10 h-10 opacity-20"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,0 C25,10 35,20 20,40 C5,20 15,10 20,0 Z' fill='%2372926c'/%3E%3C/svg%3E\")",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      />
    </motion.div>
  );
};

export default TestimonialContent;
