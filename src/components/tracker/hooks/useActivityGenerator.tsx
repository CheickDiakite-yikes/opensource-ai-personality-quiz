
import { useState } from "react";
import { Activity, ActivityCategory, PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { activitySuggestionsByCategory } from "../utils/activitySuggestions";
import { supabase } from "@/integrations/supabase/client";

export const useActivityGenerator = (
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>,
  userAnalysis: PersonalityAnalysis | null = null
) => {
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);
  
  // Generate a new activity based on user's profile
  const generateActivity = async (category?: ActivityCategory) => {
    setIsGeneratingActivity(true);
    
    try {
      toast.info("Generating a personalized activity for you...");
      
      if (!userAnalysis) {
        toast.warning("No personality analysis available. Creating a general activity.");
        generateFallbackActivity(category, setActivities);
        return;
      }
      
      console.log("Generating activity with AI using o3-mini model...");
      
      // Call the Supabase Edge Function for AI activity generation
      // IMPORTANT: This function uses the o3-mini model from OpenAI API
      const { data, error } = await supabase.functions.invoke("generate-activity", {
        body: { 
          analysis: userAnalysis,
          userCategory: category 
        }
      });
      
      if (error) {
        console.error("Error calling generate-activity function:", error);
        throw new Error(`Activity generation failed: ${error.message}`);
      }
      
      if (!data || !data.activity) {
        throw new Error("Invalid response from activity generation function");
      }
      
      console.log("Received AI-generated activity from o3-mini model:", data.activity);
      
      // Add the new activity to the list
      setActivities(prev => [data.activity, ...prev]);
      
      toast.success("New activity created!", {
        description: `${data.activity.title} (${data.activity.points} points)`,
        duration: 5000
      });
      
    } catch (error) {
      console.error("Error generating activity:", error);
      toast.error("Failed to generate AI activity. Using fallback activity.");
      
      // Fallback to local activity generation if the API fails
      generateFallbackActivity(category, setActivities);
    } finally {
      setIsGeneratingActivity(false);
    }
  };
  
  return {
    generateActivity,
    isGeneratingActivity
  };
};

// Fallback function to generate an activity locally if the API fails
function generateFallbackActivity(
  userCategory: ActivityCategory | undefined, 
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>
) {
  // Mock categories and points for variety
  const categories = Object.values(ActivityCategory);
  const category = userCategory || categories[Math.floor(Math.random() * categories.length)];
  const randomPoints = Math.floor(Math.random() * 30) + 10; // 10-40 points
  
  // Select random activity from the appropriate category
  const suggestions = activitySuggestionsByCategory[category];
  const randomActivity = suggestions[Math.floor(Math.random() * suggestions.length)];
  
  // Create new activity
  const newActivity: Activity = {
    id: `activity-${Date.now()}`,
    title: randomActivity,
    description: `This activity will help you develop your ${category.toLowerCase()} skills and earn you points toward your next level.`,
    points: randomPoints,
    category: category,
    completed: false
  };
  
  // Add the new activity to the list
  setActivities(prev => [newActivity, ...prev]);
  
  toast.success("New activity created!", {
    description: `${randomActivity} (${randomPoints} points)`,
    duration: 5000
  });
}
