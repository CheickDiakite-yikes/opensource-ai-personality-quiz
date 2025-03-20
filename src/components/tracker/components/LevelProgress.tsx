
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  totalPoints: number;
  levelProgress: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  totalPoints,
  levelProgress,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
            <p className="text-sm text-muted-foreground">
              {totalPoints} points earned
            </p>
          </div>
        </div>
        
        <div className="flex flex-col w-full md:w-3/5 gap-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {currentLevel + 1}</span>
            <span>{totalPoints % 200} / 200</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.max(0, 200 - (totalPoints % 200))} more points needed
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LevelProgress;
