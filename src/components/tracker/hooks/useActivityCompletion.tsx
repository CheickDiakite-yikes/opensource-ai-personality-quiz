
import { useState } from "react";
import { Activity } from "@/utils/types";
import { toast } from "sonner";
import { Trophy, Award } from "lucide-react";

export const useActivityCompletion = (
  activities: Activity[],
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>,
  totalPoints: number
) => {
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
  
  return { toggleActivityCompletion };
};
