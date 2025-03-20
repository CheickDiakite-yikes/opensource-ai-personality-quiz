
import { ActivityCategory } from "@/utils/types";
import { Heart, Brain, Users, BookOpen, Activity, Paintbrush, Star } from "lucide-react";
import React from "react";

// Category icons mapping
export const getCategoryIcon = (category: ActivityCategory) => {
  switch (category) {
    case ActivityCategory.Kindness:
      return <Heart className="h-5 w-5" />;
    case ActivityCategory.Mindfulness:
      return <Brain className="h-5 w-5" />;
    case ActivityCategory.Learning:
      return <BookOpen className="h-5 w-5" />;
    case ActivityCategory.Health:
      return <Activity className="h-5 w-5" />;
    case ActivityCategory.Social:
      return <Users className="h-5 w-5" />;
    case ActivityCategory.Creativity:
      return <Paintbrush className="h-5 w-5" />;
    default:
      return <Star className="h-5 w-5" />;
  }
};

// Category color mapping
export const getCategoryColor = (category: ActivityCategory) => {
  switch (category) {
    case ActivityCategory.Kindness:
      return "bg-pink-500/10 text-pink-600";
    case ActivityCategory.Mindfulness:
      return "bg-purple-500/10 text-purple-600";
    case ActivityCategory.Learning:
      return "bg-blue-500/10 text-blue-600";
    case ActivityCategory.Health:
      return "bg-emerald-500/10 text-emerald-600";
    case ActivityCategory.Social:
      return "bg-amber-500/10 text-amber-600";
    case ActivityCategory.Creativity:
      return "bg-indigo-500/10 text-indigo-600";
    default:
      return "bg-gray-500/10 text-gray-600";
  }
};
