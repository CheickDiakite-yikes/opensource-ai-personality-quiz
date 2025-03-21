
import { useState } from "react";
import { Activity, ActivityCategory, PersonalityAnalysis, Json } from "@/utils/types";
import { toast } from "sonner";
import { activitySuggestionsByCategory } from "../utils/activitySuggestions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useActivityGenerator = (
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>,
  userAnalysis: PersonalityAnalysis | null = null
) => {
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);
  const { user } = useAuth();
  
  // Helper function to ensure steps are properly formatted
  const formatSteps = (steps: any): string[] => {
    if (!steps) return [];
    
    // If already an array, map each item to string
    if (Array.isArray(steps)) {
      return steps.map(step => String(step));
    }
    
    return [];
  };
  
  // Generate a new activity based on user's profile
  const generateActivity = async (category?: ActivityCategory) => {
    setIsGeneratingActivity(true);
    
    try {
      toast.info("Generating a personalized activity for you...");
      
      // Call the Supabase Edge Function for AI activity generation
      let newActivity: Activity;
      
      try {
        console.log("Generating activity with AI...", { category, userAnalysis: !!userAnalysis });
        
        const { data, error } = await supabase.functions.invoke("generate-activity", {
          body: { 
            analysis: userAnalysis,
            userCategory: category 
          }
        });
        
        if (error || !data || !data.activity) {
          console.error("Error from generate-activity function:", error);
          throw new Error(error?.message || "Failed to generate activity");
        }
        
        newActivity = data.activity;
        console.log("Received AI-generated activity:", newActivity);
      } catch (error) {
        console.error("Error calling generate-activity function:", error);
        // Fallback to local generation
        newActivity = generateLocalActivity(category);
      }
      
      const now = new Date();
      
      // If user is logged in, save to Supabase first
      if (user) {
        try {
          console.log("Saving new activity to Supabase for user:", user.id);
          
          const { data: savedData, error } = await supabase
            .from('activities')
            .insert({
              title: newActivity.title,
              description: newActivity.description,
              points: newActivity.points,
              category: newActivity.category,
              completed: false,
              user_id: user.id,
              steps: Array.isArray(newActivity.steps) ? formatSteps(newActivity.steps) : [],
              benefits: newActivity.benefits || ""
            })
            .select('*')
            .single();
          
          if (error) {
            console.error("Error saving activity to Supabase:", error);
            toast.error("Failed to save your new activity");
            
            // Add a locally generated ID to the activity
            newActivity.id = `local-${Date.now()}`;
            newActivity.createdAt = now;
            setActivities(prev => [newActivity, ...prev]);
          } else {
            console.log("Activity saved to Supabase:", savedData);
            
            // Transform the saved data to Activity type and add to state
            const savedActivity: Activity = {
              id: savedData.id,
              title: savedData.title,
              description: savedData.description || "",
              points: savedData.points,
              category: savedData.category as ActivityCategory,
              completed: savedData.completed,
              completedAt: savedData.completed_at ? new Date(savedData.completed_at) : undefined,
              createdAt: savedData.created_at ? new Date(savedData.created_at) : now,
              steps: formatSteps(savedData.steps),
              benefits: savedData.benefits || "",
              user_id: savedData.user_id
            };
            
            setActivities(prev => [savedActivity, ...prev]);
          }
        } catch (error) {
          console.error("Unexpected error saving activity:", error);
          toast.error("Failed to save your new activity");
          
          // Add to local state even if Supabase save fails
          newActivity.id = `local-${Date.now()}`;
          newActivity.createdAt = now;
          setActivities(prev => [newActivity, ...prev]);
        }
      } else {
        // No user logged in, just add to local state
        newActivity.id = `local-${Date.now()}`;
        newActivity.createdAt = now;
        setActivities(prev => [newActivity, ...prev]);
      }
      
      toast.success("New activity created!", {
        description: `${newActivity.title} (${newActivity.points} points)`,
        duration: 5000
      });
    } catch (error) {
      console.error("Error generating activity:", error);
      
      // Fallback to local activity generation
      const fallbackActivity = generateLocalActivity(category);
      fallbackActivity.id = `local-${Date.now()}`;
      fallbackActivity.createdAt = new Date();
      setActivities(prev => [fallbackActivity, ...prev]);
      
      toast.success("New activity created!", {
        description: `${fallbackActivity.title} (${fallbackActivity.points} points)`,
        duration: 5000
      });
    } finally {
      setIsGeneratingActivity(false);
    }
  };
  
  // Function to generate a simple activity locally
  const generateLocalActivity = (category?: ActivityCategory): Activity => {
    const categories = Object.values(ActivityCategory);
    const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
    const points = Math.floor(Math.random() * 30) + 10; // 10-40 points
    
    const suggestions = activitySuggestionsByCategory[selectedCategory];
    const title = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    return {
      id: '', // Will be set later
      title,
      description: `This activity will help you develop your ${selectedCategory.toLowerCase()} skills.`,
      points,
      category: selectedCategory,
      completed: false,
      steps: [],
      benefits: `Improve your ${selectedCategory.toLowerCase()} abilities.`,
      createdAt: new Date() // Add this to match our updated interface
    };
  };
  
  return {
    generateActivity,
    isGeneratingActivity
  };
};
