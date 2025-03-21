
import { useState, useEffect } from "react";
import { Activity, ActivityCategory } from "@/utils/types";
import { sampleActivities } from "../data/sampleActivities";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useActivityDataFetching = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Helper function to ensure steps are properly formatted as strings
  const formatSteps = (steps: any): string[] => {
    if (!steps) return [];
    
    // If already an array, map each item to string
    if (Array.isArray(steps)) {
      return steps.map(step => String(step));
    }
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof steps === 'string' && (steps.startsWith('[') || steps.startsWith('{'))) {
      try {
        const parsed = JSON.parse(steps);
        return Array.isArray(parsed) ? parsed.map(step => String(step)) : [];
      } catch (e) {
        console.error("Error parsing steps:", e);
        return [];
      }
    }
    
    return [];
  };
  
  // Function to create initial activities for new users
  const createInitialActivities = async (userId: string) => {
    try {
      console.log("Creating initial activities for user:", userId);
      
      // Use the first 3 sample activities as a starting point
      const initialActivitiesData = sampleActivities.slice(0, 3).map(activity => ({
        title: activity.title,
        description: activity.description,
        points: activity.points,
        category: activity.category,
        completed: false,
        user_id: userId,
        steps: activity.steps || [],
        benefits: activity.benefits || ""
      }));
      
      // Insert them into Supabase
      const { data, error } = await supabase
        .from('activities')
        .insert(initialActivitiesData)
        .select();
      
      if (error) {
        console.error("Error creating initial activities:", error);
        toast.error("Failed to create initial activities");
        return sampleActivities;
      }
      
      console.log("Created initial activities:", data);
      
      // Transform the returned data to our Activity type
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        points: item.points,
        category: item.category as ActivityCategory,
        completed: item.completed,
        completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        steps: formatSteps(item.steps),
        benefits: item.benefits || "",
        user_id: item.user_id
      }));
    } catch (error) {
      console.error("Error creating initial activities:", error);
      return sampleActivities;
    }
  };

  // Fetch activities from Supabase when component mounts or user changes
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          // For non-logged-in users, use sample activities
          setActivities(sampleActivities);
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching activities for user:", user.id);
        
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error("Error fetching activities:", error);
          toast.error("Failed to load your activities");
          setActivities(sampleActivities);
          return;
        }
        
        console.log("Raw data from Supabase:", data);
        
        // Check if we got any data back
        if (!data || data.length === 0) {
          console.log("No activities found for user, creating initial set");
          const initialActivities = await createInitialActivities(user.id);
          setActivities(initialActivities);
          setIsLoading(false);
          return;
        }
        
        // Transform the data from Supabase format to our Activity type
        const formattedActivities: Activity[] = data.map(item => {
          return {
            id: item.id,
            title: item.title,
            description: item.description || "",
            points: item.points,
            category: item.category as ActivityCategory,
            completed: item.completed,
            completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            steps: formatSteps(item.steps),
            benefits: item.benefits || "",
            user_id: item.user_id
          };
        });
        
        console.log("Formatted activities:", formattedActivities);
        setActivities(formattedActivities);
      } catch (error) {
        console.error("Unexpected error fetching activities:", error);
        toast.error("Failed to load your activities");
        setActivities(sampleActivities);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [user]);

  return {
    activities,
    setActivities,
    isLoading
  };
};
