
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { useActivityState } from "./hooks/useActivityState";
import LevelProgress from "./components/LevelProgress";
import ProgressCard from "./components/ProgressCard";
import CategoryTabs from "./components/CategoryTabs";
import CategoryTabContent from "./components/CategoryTabContent";
import { ActivityCategory } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";

const TrackerPage: React.FC = () => {
  const { analysis } = useAIAnalysis();
  
  const {
    activities,
    filter,
    setFilter,
    showCompleted,
    setShowCompleted,
    sortBy,
    setSortBy,
    currentLevel,
    totalPoints,
    levelProgress,
    pointsTillNextLevel,
    consistencyScore,
    toggleActivityCompletion,
    filteredActivities,
    generateActivity,
    isGeneratingActivity
  } = useActivityState(analysis);
  
  // Define the categories including "all" for cleaner iteration
  const categories = ["all", ...Object.values(ActivityCategory)];
  
  return (
    <div className="container max-w-4xl py-6 md:py-10 px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Growth Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and earn points through self-improvement activities
        </p>
      </div>
      
      <LevelProgress
        currentLevel={currentLevel}
        totalPoints={totalPoints}
        levelProgress={levelProgress}
        pointsTillNextLevel={pointsTillNextLevel}
        consistencyScore={consistencyScore}
      />
      
      <ProgressCard
        totalPoints={totalPoints}
        completedActivities={activities.filter(a => a.completed).length}
        totalActivities={activities.length}
      />
      
      <Tabs defaultValue="all" value={filter} className="mb-6">
        <CategoryTabs setFilter={setFilter} currentFilter={filter} />
        
        {categories.map((category) => (
          <CategoryTabContent
            key={category}
            filter={filter}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredActivities={filteredActivities}
            toggleActivityCompletion={toggleActivityCompletion}
            isGeneratingActivity={isGeneratingActivity}
            generateActivity={generateActivity}
            categoryValue={category as ActivityCategory | "all"}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default TrackerPage;
