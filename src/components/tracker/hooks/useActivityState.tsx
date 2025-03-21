
import { useState, useEffect } from "react";
import { Activity, PersonalityAnalysis, ActivityCategory } from "@/utils/types";
import { sampleActivities } from "../data/sampleActivities";
import { useActivityFilters } from "./useActivityFilters";
import { useLevelProgress } from "./useLevelProgress";
import { useActivityGenerator } from "./useActivityGenerator";
import { useActivityCompletion } from "./useActivityCompletion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useActivityState = (analysis: PersonalityAnalysis | null = null) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch activities from Supabase when component mounts or user changes
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        setActivities(sampleActivities);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
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
        
        // Transform the data from Supabase format to our Activity type
        const formattedActivities: Activity[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          points: item.points,
          category: item.category as ActivityCategory,
          completed: item.completed,
          completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
          // Add steps and benefits with default values if they don't exist
          steps: item.steps ? Array.isArray(item.steps) ? item.steps : [] : [],
          benefits: item.benefits || ""
        }));
        
        console.log("Fetched activities:", formattedActivities);
        
        // If user has no activities yet, provide sample activities
        if (formattedActivities.length === 0) {
          setActivities(sampleActivities);
        } else {
          setActivities(formattedActivities);
        }
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
  
  // Use the extracted hooks
  const { 
    totalPoints, 
    currentLevel, 
    nextLevelPoints, 
    levelProgress,
    pointsTillNextLevel,
    consistencyScore
  } = useLevelProgress(activities);
  
  const {
    filter,
    setFilter,
    showCompleted,
    setShowCompleted,
    sortBy,
    setSortBy,
    filteredActivities
  } = useActivityFilters(activities);
  
  const { generateActivity, isGeneratingActivity } = useActivityGenerator(setActivities, analysis);
  
  const { toggleActivityCompletion } = useActivityCompletion(activities, setActivities, totalPoints);

  return {
    activities,
    isLoading,
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
    pointsTillNextLevel,
    consistencyScore,
    toggleActivityCompletion,
    filteredActivities,
    generateActivity,
    isGeneratingActivity
  };
};
