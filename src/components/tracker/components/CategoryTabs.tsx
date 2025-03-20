
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityCategory } from "@/utils/types";
import { Heart, Brain, BookOpen, Activity, Users, Paintbrush } from "lucide-react";

interface CategoryTabsProps {
  setFilter: (filter: ActivityCategory | "all") => void;
  currentFilter: ActivityCategory | "all";
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ setFilter, currentFilter }) => {
  return (
    <TabsList className="grid grid-cols-7 mb-6">
      <TabsTrigger 
        value="all" 
        onClick={() => setFilter("all")}
      >
        All
      </TabsTrigger>
      <TabsTrigger 
        value={ActivityCategory.KINDNESS} 
        onClick={() => setFilter(ActivityCategory.KINDNESS)}
        className="flex items-center"
      >
        <Heart className="h-4 w-4 mr-1 inline md:hidden" />
        <span className="hidden md:inline">Kindness</span>
      </TabsTrigger>
      <TabsTrigger 
        value={ActivityCategory.MINDFULNESS} 
        onClick={() => setFilter(ActivityCategory.MINDFULNESS)}
        className="flex items-center"
      >
        <Brain className="h-4 w-4 mr-1 inline md:hidden" />
        <span className="hidden md:inline">Mindfulness</span>
      </TabsTrigger>
      <TabsTrigger 
        value={ActivityCategory.LEARNING} 
        onClick={() => setFilter(ActivityCategory.LEARNING)}
        className="flex items-center"
      >
        <BookOpen className="h-4 w-4 mr-1 inline md:hidden" />
        <span className="hidden md:inline">Learning</span>
      </TabsTrigger>
      <TabsTrigger 
        value={ActivityCategory.HEALTH} 
        onClick={() => setFilter(ActivityCategory.HEALTH)}
        className="flex items-center"
      >
        <Activity className="h-4 w-4 mr-1 inline md:hidden" />
        <span className="hidden md:inline">Health</span>
      </TabsTrigger>
      <TabsTrigger 
        value={ActivityCategory.SOCIAL} 
        onClick={() => setFilter(ActivityCategory.SOCIAL)}
        className="flex items-center"
      >
        <Users className="h-4 w-4 mr-1 inline md:hidden" />
        <span className="hidden md:inline">Social</span>
      </TabsTrigger>
      <TabsTrigger 
        value={ActivityCategory.CREATIVITY} 
        onClick={() => setFilter(ActivityCategory.CREATIVITY)}
        className="flex items-center"
      >
        <Paintbrush className="h-4 w-4 mr-1 inline md:hidden" />
        <span className="hidden md:inline">Creativity</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default CategoryTabs;
