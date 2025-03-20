
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TestimonialControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

const TestimonialControls: React.FC<TestimonialControlsProps> = ({ onPrev, onNext }) => {
  return (
    <div className="flex gap-4 pt-12 md:pt-0">
      <button
        onClick={onPrev}
        className="h-9 w-9 rounded-full glass-button flex items-center justify-center group/button"
        aria-label="Previous testimonial"
      >
        <ArrowLeft className="h-5 w-5 text-foreground group-hover/button:rotate-12 transition-transform duration-300" />
      </button>
      <button
        onClick={onNext}
        className="h-9 w-9 rounded-full glass-button flex items-center justify-center group/button"
        aria-label="Next testimonial"
      >
        <ArrowRight className="h-5 w-5 text-foreground group-hover/button:-rotate-12 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default TestimonialControls;
