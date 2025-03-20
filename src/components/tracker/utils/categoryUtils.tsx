
import { ActivityCategory } from "@/utils/types";
import { Heart, Brain, BookOpen, Activity, Users, Paintbrush } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Get icon for a category
export const getCategoryIcon = (category: ActivityCategory): LucideIcon => {
  switch (category) {
    case ActivityCategory.KINDNESS:
      return Heart;
    case ActivityCategory.MINDFULNESS:
      return Brain;
    case ActivityCategory.LEARNING:
      return BookOpen;
    case ActivityCategory.HEALTH:
      return Activity;
    case ActivityCategory.SOCIAL:
      return Users;
    case ActivityCategory.CREATIVITY:
      return Paintbrush;
    default:
      return Heart; // Default icon
  }
};

// Get color for a category
export const getCategoryColor = (category: ActivityCategory): string => {
  switch (category) {
    case ActivityCategory.KINDNESS:
      return "text-red-500";
    case ActivityCategory.MINDFULNESS:
      return "text-blue-500";
    case ActivityCategory.LEARNING:
      return "text-yellow-500";
    case ActivityCategory.HEALTH:
      return "text-green-500";
    case ActivityCategory.SOCIAL:
      return "text-purple-500";
    case ActivityCategory.CREATIVITY:
      return "text-pink-500";
    default:
      return "text-gray-500";
  }
};
