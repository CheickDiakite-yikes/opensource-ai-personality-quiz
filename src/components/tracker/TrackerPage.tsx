
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { useActivityState } from "./hooks/useActivityState";
import LevelProgress from "./components/LevelProgress";
import ProgressCard from "./components/ProgressCard";
import CategoryTabs from "./components/CategoryTabs";
import CategoryTabContent from "./components/CategoryTabContent";
import { ActivityCategory } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TrackerPage: React.FC = () => {
  const { analysis } = useAIAnalysis();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    activities,
    isLoading,
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
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6 md:py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Growth Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Loading your progress...
          </p>
        </div>
        
        <Skeleton className="h-28 w-full mb-6" />
        <Skeleton className="h-32 w-full mb-6" />
        
        <div className="mb-6">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show login prompt
  if (!user) {
    return (
      <div className="container max-w-4xl py-6 md:py-10 px-4 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Growth Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and earn points through self-improvement activities
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-3">Sign in to save your progress</h2>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to save your activities and track your growth over time.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            size="lg"
            className="px-8"
          >
            Sign In / Register
          </Button>
          
          <p className="mt-4 text-sm text-muted-foreground">
            You can still use the tracker without an account, but your progress won't be saved.
          </p>
        </div>
        
        {/* Show sample content for non-logged in users */}
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
      </div>
    );
  }
  
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
