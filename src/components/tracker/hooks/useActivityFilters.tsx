
import { useState, useMemo } from "react";
import { Activity, ActivityCategory } from "@/utils/types";

export const useActivityFilters = (activities: Activity[]) => {
  const [filter, setFilter] = useState<ActivityCategory | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'category' | 'date'>('category');

  // Apply filters and sorting
  const filteredActivities = useMemo(() => {
    let filtered = activities.filter(activity => 
      (filter === "all" || activity.category === filter) &&
      (showCompleted || !activity.completed)
    );
    
    // Apply sorting
    if (sortBy === 'points') {
      return [...filtered].sort((a, b) => b.points - a.points);
    } else if (sortBy === 'category') {
      return [...filtered].sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'date') {
      return [...filtered].sort((a, b) => {
        const dateA = a.completedAt || a.createdAt;
        const dateB = b.completedAt || b.createdAt;
        
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        const timeA = dateA instanceof Date ? dateA.getTime() : new Date(dateA).getTime();
        const timeB = dateB instanceof Date ? dateB.getTime() : new Date(dateB).getTime();
        
        return timeB - timeA;
      });
    }
    
    return filtered;
  }, [activities, filter, showCompleted, sortBy]);

  return {
    filter,
    setFilter,
    showCompleted,
    setShowCompleted,
    sortBy,
    setSortBy,
    filteredActivities
  };
};
