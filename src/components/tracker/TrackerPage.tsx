
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useActivityState } from "./hooks/useActivityState";
import LevelProgress from "./components/LevelProgress";
import ProgressCard from "./components/ProgressCard";
import CategoryTabs from "./components/CategoryTabs";
import ActivityFilters from "./components/ActivityFilters";
import ActivityList from "./components/ActivityList";
import { ActivityCategory } from "@/utils/types";

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
      
      <Tabs defaultValue="all" value={filter} className="mb-6">
        <CategoryTabs setFilter={setFilter} currentFilter={filter} />
        
        <TabsContent value="all" className="mt-0">
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
        
        <TabsContent value={ActivityCategory.Kindness} className="mt-0">
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
            isGeneratingActivity={isGeneratingActivity && filter === ActivityCategory.Kindness}
          />
        </TabsContent>
        
        <TabsContent value={ActivityCategory.Mindfulness} className="mt-0">
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
            isGeneratingActivity={isGeneratingActivity && filter === ActivityCategory.Mindfulness}
          />
        </TabsContent>
        
        <TabsContent value={ActivityCategory.Learning} className="mt-0">
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
            isGeneratingActivity={isGeneratingActivity && filter === ActivityCategory.Learning}
          />
        </TabsContent>
        
        <TabsContent value={ActivityCategory.Health} className="mt-0">
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
            isGeneratingActivity={isGeneratingActivity && filter === ActivityCategory.Health}
          />
        </TabsContent>
        
        <TabsContent value={ActivityCategory.Social} className="mt-0">
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
            isGeneratingActivity={isGeneratingActivity && filter === ActivityCategory.Social}
          />
        </TabsContent>
        
        <TabsContent value={ActivityCategory.Creativity} className="mt-0">
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
            isGeneratingActivity={isGeneratingActivity && filter === ActivityCategory.Creativity}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackerPage;
