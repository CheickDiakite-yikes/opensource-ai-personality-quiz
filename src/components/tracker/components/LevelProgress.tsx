
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Zap, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelProgressProps {
  currentLevel: number;
  totalPoints: number;
  levelProgress: number;
  pointsTillNextLevel?: number;
  consistencyScore?: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  totalPoints,
  levelProgress,
  pointsTillNextLevel = Math.max(0, 200 - (totalPoints % 200)),
  consistencyScore = 0,
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

  // Generates a color gradient based on consistency score
  const getConsistencyColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-emerald-500";
    if (score >= 40) return "text-yellow-500";
    if (score >= 20) return "text-orange-500";
    return "text-red-500";
  };

  // Visual credit rating label based on level and consistency
  const getCreditRating = () => {
    const effectiveScore = (currentLevel * 90) + (consistencyScore * 0.5);
    
    if (effectiveScore >= 650) return { label: "Excellent", color: "text-green-500" };
    if (effectiveScore >= 500) return { label: "Very Good", color: "text-emerald-500" };
    if (effectiveScore >= 350) return { label: "Good", color: "text-blue-500" };
    if (effectiveScore >= 200) return { label: "Fair", color: "text-yellow-500" };
    return { label: "Building", color: "text-orange-500" };
  };

  const creditRating = getCreditRating();

  return (
    <motion.div 
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/10 shadow-sm"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${creditRating.color} bg-background/80`}>
                {creditRating.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalPoints} points earned
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ 
              scale: [0.9, 1.05, 0.95, 1],
              transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
            className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full"
          >
            <Flame className={cn("h-4 w-4", getConsistencyColor(consistencyScore || 0))} />
            <span className={cn("text-sm font-medium", getConsistencyColor(consistencyScore || 0))}>
              {consistencyScore || 0}% Consistency
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-primary/5 rounded-full">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {Math.floor(totalPoints / 100)} Achievements
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row w-full gap-6 items-center">
        <div className="flex flex-col w-full md:w-3/5 gap-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {currentLevel + 1}</span>
            <span>{Math.floor(levelProgress)}% Complete</span>
          </div>
          
          <div className="relative">
            <Progress value={levelProgress} className="h-3" />
            {levelProgress > 30 && (
              <motion.div 
                className="absolute top-0 h-full"
                style={{ left: `${levelProgress - 5}%` }}
                animate={{ 
                  y: [0, -5, 0],
                  opacity: [0.6, 1, 0.6] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-4 w-4 text-primary" />
              </motion.div>
            )}
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <motion.span
              animate={{ 
                opacity: [0.7, 1, 0.7],
                scale: [0.98, 1, 0.98]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {pointsTillNextLevel} more points needed
            </motion.span>
            <span>{Math.round(levelProgress)}% complete</span>
          </div>
        </div>
        
        <div className="flex flex-grow justify-center gap-2 md:ml-auto">
          {[...Array(5)].map((_, i) => {
            const isActive = i < Math.min(5, currentLevel);
            return (
              <motion.div 
                key={i}
                className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ${
                  isActive ? 'bg-primary' : 'bg-muted'
                }`}
                animate={isActive ? { 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                } : {}}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default LevelProgress;
