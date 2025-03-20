
import { useState, useEffect } from "react";
import { Activity } from "@/utils/types";

export const useLevelProgress = (activities: Activity[]) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextLevelPoints, setNextLevelPoints] = useState(200);
  
  // Calculate total points
  const totalPoints = activities
    .filter(a => a.completed)
    .reduce((sum, activity) => sum + activity.points, 0);
  
  // Calculate level and next level threshold
  useEffect(() => {
    const level = Math.floor(totalPoints / 200) + 1;
    const nextPoints = level * 200;
    setCurrentLevel(level);
    setNextLevelPoints(nextPoints);
  }, [totalPoints]);
  
  // Calculate progress percentage to next level
  const levelProgress = ((totalPoints % 200) / 200) * 100;
  
  return {
    currentLevel,
    nextLevelPoints,
    totalPoints,
    levelProgress
  };
};
