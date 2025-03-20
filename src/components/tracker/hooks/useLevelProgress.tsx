
import { useState, useEffect, useMemo } from "react";
import { Activity } from "@/utils/types";

// Constants for the point system algorithm
const BASE_LEVEL_THRESHOLD = 100;
const SCALING_FACTOR = 1.35; // Exponential scaling factor for level difficulty
const COMPLETION_BONUS_MULTIPLIER = 0.15; // Bonus for consistent completion
const STREAK_THRESHOLD = 3; // Number of activities needed for streak bonus

export const useLevelProgress = (activities: Activity[]) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextLevelPoints, setNextLevelPoints] = useState(0);
  const [pointsTillNextLevel, setPointsTillNextLevel] = useState(0);
  
  // More sophisticated calculation of total points with bonuses for consistency
  const { totalPoints, consistencyScore } = useMemo(() => {
    // Basic points from completed activities
    const basePoints = activities
      .filter(a => a.completed)
      .reduce((sum, activity) => sum + activity.points, 0);
    
    // Calculate consistency bonus based on completion patterns
    // Sort completed activities by completion date
    const completedActivities = activities
      .filter(a => a.completed && a.completedAt)
      .sort((a, b) => 
        (a.completedAt?.getTime() || 0) - (b.completedAt?.getTime() || 0)
      );
    
    // Check for streaks (activities completed in close succession)
    let streakBonus = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < completedActivities.length; i++) {
      const prevDate = completedActivities[i-1].completedAt;
      const currDate = completedActivities[i].completedAt;
      
      if (prevDate && currDate) {
        // Activities completed within 2 days of each other count as a streak
        const daysBetween = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysBetween <= 2) {
          currentStreak++;
          
          // Apply bonus when streak threshold is reached
          if (currentStreak >= STREAK_THRESHOLD) {
            streakBonus += completedActivities[i].points * COMPLETION_BONUS_MULTIPLIER;
          }
        } else {
          currentStreak = 1; // Reset streak
        }
      }
    }
    
    // Calculate consistency score (0-100)
    const consistencyScore = Math.min(100, Math.floor((streakBonus / Math.max(1, basePoints)) * 100));
    
    // Return total points with bonus and consistency score
    return {
      totalPoints: Math.floor(basePoints + streakBonus),
      consistencyScore
    };
  }, [activities]);
  
  // Calculate level thresholds using exponential scaling
  const calculateLevelThreshold = (level: number): number => {
    return Math.floor(BASE_LEVEL_THRESHOLD * Math.pow(SCALING_FACTOR, level - 1));
  };
  
  // Determine current level based on points
  useEffect(() => {
    let accumulatedPoints = 0;
    let level = 0;
    
    // Find the highest level the user has achieved
    while (true) {
      level++;
      const threshold = calculateLevelThreshold(level);
      
      if (accumulatedPoints + threshold > totalPoints) {
        // User hasn't completed this level yet
        const pointsNeeded = accumulatedPoints + threshold - totalPoints;
        setCurrentLevel(level);
        setNextLevelPoints(threshold);
        setPointsTillNextLevel(pointsNeeded);
        break;
      }
      
      // User has completed this level
      accumulatedPoints += threshold;
    }
  }, [totalPoints]);
  
  // Calculate progress percentage to next level
  const levelProgress = ((nextLevelPoints - pointsTillNextLevel) / nextLevelPoints) * 100;
  
  return {
    currentLevel,
    nextLevelPoints,
    totalPoints,
    levelProgress,
    pointsTillNextLevel,
    consistencyScore
  };
};
