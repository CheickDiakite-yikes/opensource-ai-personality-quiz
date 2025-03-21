
import { useState } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { useActivityFilters } from "./useActivityFilters";
import { useLevelProgress } from "./useLevelProgress";
import { useActivityGenerator } from "./useActivityGenerator";
import { useActivityCompletion } from "./useActivityCompletion";
import { useActivityDataFetching } from "./useActivityDataFetching";

export const useActivityState = (analysis: PersonalityAnalysis | null = null) => {
  // Use the extracted hooks
  const { activities, setActivities, isLoading } = useActivityDataFetching();
  
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
