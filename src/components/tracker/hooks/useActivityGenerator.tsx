
import { useState } from "react";
import { Activity, ActivityCategory } from "@/utils/types";
import { toast } from "sonner";
import { activitySuggestionsByCategory } from "../utils/activitySuggestions";

export const useActivityGenerator = (setActivities: React.Dispatch<React.SetStateAction<Activity[]>>) => {
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);
  
  // Generate a new activity based on user's profile
  const generateActivity = async () => {
    setIsGeneratingActivity(true);
    
    try {
      toast.info("Generating a personalized activity for you...");
      
      // In a real implementation, we would retrieve the user's latest analysis
      // from the database and pass relevant information to the OpenAI API
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock categories and points for variety
      const categories = Object.values(ActivityCategory);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomPoints = Math.floor(Math.random() * 30) + 10; // 10-40 points
      
      // Select random activity from the appropriate category
      const suggestions = activitySuggestionsByCategory[randomCategory];
      const randomActivity = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      // Create new activity
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        title: randomActivity,
        description: `This activity will help you develop your ${randomCategory.toLowerCase()} skills and earn you points toward your next level.`,
        points: randomPoints,
        category: randomCategory,
        completed: false
      };
      
      // Add the new activity to the list
      setActivities(prev => [newActivity, ...prev]);
      
      toast.success("New activity created!", {
        description: `${randomActivity} (${randomPoints} points)`,
        duration: 5000
      });
      
    } catch (error) {
      console.error("Error generating activity:", error);
      toast.error("Failed to generate activity. Please try again.");
    } finally {
      setIsGeneratingActivity(false);
    }
  };
  
  return {
    generateActivity,
    isGeneratingActivity
  };
};
