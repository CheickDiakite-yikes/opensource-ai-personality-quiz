
import { useState } from "react";
import { Activity, ActivityCategory, PersonalityAnalysis } from "@/utils/types";
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
  
  // Generate a new activity based on user's profile
  const generateActivity = async (category?: ActivityCategory) => {
    setIsGeneratingActivity(true);
    
    try {
      toast.info("Generating a personalized activity for you...");
      
      if (!userAnalysis) {
        toast.warning("No personality analysis available. Creating a general activity.");
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
      
      // Create the new activity
      const newActivity = data.activity;
      
      // If user is logged in, save to Supabase first
      if (user) {
        console.log("Saving new activity to Supabase for user:", user.id);
        
        try {
          const { data: savedData, error: saveError } = await supabase
            .from('activities')
            .insert({
              title: newActivity.title,
              description: newActivity.description,
              points: newActivity.points,
              category: newActivity.category,
              completed: false,
              user_id: user.id,
              steps: newActivity.steps || [],
              benefits: newActivity.benefits || ""
            })
            .select('*')
            .single();
          
          if (saveError) {
            console.error("Error saving activity to Supabase:", saveError);
            toast.error("Failed to save your new activity");
            
            // Add to local state even if Supabase save fails
            setActivities(prev => [newActivity, ...prev]);
          } else {
            console.log("Activity saved to Supabase:", savedData);
            
            // Type assertion to access potentially missing fields
            const supabaseData = savedData as any;
            
            // Transform the saved data to Activity type and add to state
            const savedActivity: Activity = {
              id: savedData.id,
              title: savedData.title,
              description: savedData.description || "",
              points: savedData.points,
              category: savedData.category as ActivityCategory,
              completed: savedData.completed,
              completedAt: savedData.completed_at ? new Date(savedData.completed_at) : undefined,
              steps: Array.isArray(supabaseData.steps) ? supabaseData.steps : [],
              benefits: supabaseData.benefits || ""
            };
            
            setActivities(prev => [savedActivity, ...prev]);
          }
        } catch (saveError) {
          console.error("Unexpected error saving activity:", saveError);
          toast.error("Failed to save your new activity");
          
          // Add to local state even if Supabase save fails
          setActivities(prev => [newActivity, ...prev]);
        }
      } else {
        // No user logged in, just add to local state
        setActivities(prev => [newActivity, ...prev]);
      }
      
      toast.success("New activity created!", {
        description: `${newActivity.title} (${newActivity.points} points)`,
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
async function generateFallbackActivity(
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
    completed: false,
    // Add default empty values for steps and benefits
    steps: [],
    benefits: ""
  };
  
  // Using supabase.auth.getUser() to get the current user
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  
  if (user) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: newActivity.title,
          description: newActivity.description,
          points: newActivity.points,
          category: newActivity.category,
          completed: false,
          user_id: user.id,
          steps: [],
          benefits: ""
        })
        .select('*')
        .single();
      
      if (!error && data) {
        // Type assertion to access potentially missing fields
        const supabaseData = data as any;
        
        // Transform the saved data to Activity type
        const savedActivity: Activity = {
          id: data.id,
          title: data.title,
          description: data.description || "",
          points: data.points,
          category: data.category as ActivityCategory,
          completed: data.completed,
          completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
          steps: Array.isArray(supabaseData.steps) ? supabaseData.steps : [],
          benefits: supabaseData.benefits || ""
        };
        
        // Add the new activity to the list
        setActivities(prev => [savedActivity, ...prev]);
      } else {
        // Add the local activity as fallback
        setActivities(prev => [newActivity, ...prev]);
      }
    } catch (error) {
      // Add the local activity as fallback
      setActivities(prev => [newActivity, ...prev]);
    }
  } else {
    // No user logged in, just add to local state
    setActivities(prev => [newActivity, ...prev]);
  }
  
  toast.success("New activity created!", {
    description: `${randomActivity} (${randomPoints} points)`,
    duration: 5000
  });
}
