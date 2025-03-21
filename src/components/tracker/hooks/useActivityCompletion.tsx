
import { Activity } from "@/utils/types";
import { toast } from "sonner";
import { Trophy, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useActivityCompletion = (
  activities: Activity[],
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>,
  totalPoints: number
) => {
  const { user } = useAuth();
  
  const toggleActivityCompletion = async (activityId: string) => {
    // Find the activity to toggle
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    const now = new Date();
    const newCompleted = !activity.completed;
    
    // Update local state first for immediate UI feedback
    setActivities(activities.map(act => {
      if (act.id === activityId) {
        return {
          ...act,
          completed: newCompleted,
          completedAt: newCompleted ? now : undefined,
        };
      }
      return act;
    }));
    
    // If user is logged in, update in Supabase
    if (user) {
      try {
        console.log("Updating activity completion in Supabase:", activityId, newCompleted);
        
        const { error } = await supabase
          .from('activities')
          .update({ 
            completed: newCompleted,
            completed_at: newCompleted ? now.toISOString() : null
          })
          .eq('id', activityId);
        
        if (error) {
          console.error("Error updating activity completion:", error);
          toast.error("Failed to save your progress");
          
          // Revert the local state if the server update failed
          setActivities(activities.map(a => 
            a.id === activityId 
              ? { ...a, completed: activity.completed, completedAt: activity.completedAt } 
              : a
          ));
          return;
        }
      } catch (error) {
        console.error("Unexpected error updating activity:", error);
        toast.error("Failed to save your progress");
        
        // Revert local state
        setActivities(activities.map(a => 
          a.id === activityId 
            ? { ...a, completed: activity.completed, completedAt: activity.completedAt } 
            : a
        ));
        return;
      }
    }
    
    // Show success notifications if activity was completed (not uncompleted)
    if (newCompleted) {
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
  };
  
  return { toggleActivityCompletion };
};
