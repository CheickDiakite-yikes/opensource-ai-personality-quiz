
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

const TestimonialControls: React.FC<TestimonialControlsProps> = ({
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex justify-end items-center space-x-2 mt-8">
      {/* Ghibli-styled buttons */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrev}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-50 to-amber-50 flex items-center justify-center border border-emerald-200/50 shadow-sm group transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6 text-emerald-700/70 group-hover:text-emerald-700 transition-colors" />
        {/* Add hover effect */}
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200/50 shadow-sm group transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6 text-emerald-700/70 group-hover:text-emerald-700 transition-colors" />
        {/* Add hover effect */}
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </motion.button>
    </div>
  );
};

export default TestimonialControls;
