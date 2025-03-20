
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useActivityState } from "./hooks/useActivityState";
import LevelProgress from "./components/LevelProgress";
import ProgressCard from "./components/ProgressCard";
import CategoryTabs from "./components/CategoryTabs";
import ActivityFilters from "./components/ActivityFilters";
import ActivityList from "./components/ActivityList";

const TrackerPage: React.FC = () => {
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
    toggleActivityCompletion,
    filteredActivities,
    generateActivity,
    isGeneratingActivity
  } = useActivityState();
  
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
      />
      
      <ProgressCard
        totalPoints={totalPoints}
        completedActivities={activities.filter(a => a.completed).length}
        totalActivities={activities.length}
      />
      
      <Tabs defaultValue="all" className="mb-6">
        <CategoryTabs setFilter={setFilter} />
        
        <TabsContent value={filter} className="mt-0">
          <ActivityFilters
            filter={filter}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onAddActivity={generateActivity}
          />
          
          <ActivityList
            filteredActivities={filteredActivities}
            toggleActivityCompletion={toggleActivityCompletion}
            isGeneratingActivity={isGeneratingActivity}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackerPage;
