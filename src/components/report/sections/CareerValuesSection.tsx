
import React from "react";
import { motion } from "framer-motion";
import CareerSuggestions from "../CareerSuggestions";
import CoreValuesSection from "./CoreValuesSection";

interface CareerValuesSectionProps {
  careerSuggestions: string[];
  valueSystem: string[];
}

const CareerValuesSection: React.FC<CareerValuesSectionProps> = ({ 
  careerSuggestions,
  valueSystem 
}) => {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    }} className="grid md:grid-cols-2 gap-6">
      <CareerSuggestions careers={careerSuggestions} />
      <CoreValuesSection valueSystem={valueSystem} />
    </motion.div>
  );
};

export default CareerValuesSection;
