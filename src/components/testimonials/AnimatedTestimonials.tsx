
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TestimonialImage from "./TestimonialImage";
import TestimonialContent from "./TestimonialContent";
import TestimonialControls from "./TestimonialControls";

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
    <div className={cn("max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12", className)}>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
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
