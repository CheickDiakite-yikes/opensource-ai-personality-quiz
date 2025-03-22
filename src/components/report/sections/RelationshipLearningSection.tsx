
import React from "react";
import { motion } from "framer-motion";
import RelationshipPatterns from "../RelationshipPatterns";
import LearningPathways from "../LearningPathways";
import { useIsMobile } from "@/hooks/use-mobile";

interface RelationshipLearningProps {
  relationshipPatterns: {
    strengths: string[];
    challenges: string[];
    compatibleTypes: string[];
  };
  learningPathways: string[];
}

const RelationshipLearningSection: React.FC<RelationshipLearningProps> = ({ 
  relationshipPatterns,
  learningPathways 
}) => {
  const isMobile = useIsMobile();
  
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
    }} className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
      <RelationshipPatterns relationshipPatterns={relationshipPatterns} />
      <LearningPathways pathways={learningPathways} />
    </motion.div>
  );
};

export default RelationshipLearningSection;
