
import { useState, useEffect } from "react";
import { Activity, ActivityCategory } from "@/utils/types";
import { sampleActivities } from "../data/sampleActivities";
import { toast } from "sonner";
import { Trophy, Award } from "lucide-react";

export const useActivityState = () => {
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [filter, setFilter] = useState<ActivityCategory | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'category' | 'date'>('category');
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
  
  const toggleActivityCompletion = (activityId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const now = new Date();
        const newActivity = {
          ...activity,
          completed: !activity.completed,
          completedAt: activity.completed ? undefined : now,
        };
        
        if (!activity.completed) {
          toast.success(`+${activity.points} points!`, {
            description: "Great job completing this activity!",
            action: {
              label: "View Rewards",
              onClick: () => console.log("View Rewards clicked")
            },
            icon: <Trophy className="h-5 w-5 text-yellow-500" />
          });
          
          // Level up notification
          const newTotal = totalPoints + activity.points;
          if (Math.floor(newTotal / 200) > Math.floor(totalPoints / 200)) {
            toast("Level Up!", {
              description: `You've reached level ${Math.floor(newTotal / 200) + 1}!`,
              icon: <Award className="h-6 w-6 text-yellow-500" />,
              duration: 5000,
              className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            });
          }
        }
        
        return newActivity;
      }
      return activity;
    }));
  };
  
  // Apply filters and sorting
  let filteredActivities = activities.filter(activity => 
    (filter === "all" || activity.category === filter) &&
    (showCompleted || !activity.completed)
  );
  
  // Apply sorting
  if (sortBy === 'points') {
    filteredActivities = [...filteredActivities].sort((a, b) => b.points - a.points);
  } else if (sortBy === 'category') {
    filteredActivities = [...filteredActivities].sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'date') {
    filteredActivities = [...filteredActivities].sort((a, b) => {
      if (a.completed && b.completed && a.completedAt && b.completedAt) {
        return b.completedAt.getTime() - a.completedAt.getTime();
      }
      return a.completed ? 1 : -1;
    });
  }

  return {
    activities,
    filter,
    setFilter,
    showCompleted,
    setShowCompleted,
    sortBy, 
    setSortBy,
    currentLevel,
    nextLevelPoints,
    totalPoints,
    levelProgress,
    toggleActivityCompletion,
    filteredActivities
  };
};
