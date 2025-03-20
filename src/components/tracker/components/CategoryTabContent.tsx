
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";
import { ActivityCategory } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface CategoryTabContentProps {
  filter: ActivityCategory | "all";
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  sortBy: 'points' | 'category' | 'date';
  setSortBy: React.Dispatch<React.SetStateAction<'points' | 'category' | 'date'>>;
  filteredActivities: any[];
  toggleActivityCompletion: (activityId: string) => void;
  isGeneratingActivity: boolean;
  generateActivity: (category?: ActivityCategory) => void;
  categoryValue: ActivityCategory | "all";
}

const CategoryTabContent: React.FC<CategoryTabContentProps> = ({
  filter,
  showCompleted,
  setShowCompleted,
  sortBy,
  setSortBy,
  filteredActivities,
  toggleActivityCompletion,
  isGeneratingActivity,
  generateActivity,
  categoryValue
}) => {
  const handleGenerateForCategory = () => {
    if (categoryValue !== "all") {
      generateActivity(categoryValue as ActivityCategory);
    } else {
      generateActivity();
    }
  };

  return (
    <TabsContent value={categoryValue} className="mt-0 space-y-4">
      <ActivityFilters
        filter={filter}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddActivity={() => generateActivity()}
      />
      
      {categoryValue !== "all" && (
        <div className="flex justify-center mb-4">
          <Button 
            variant="outline" 
            onClick={handleGenerateForCategory}
            disabled={isGeneratingActivity}
            className="w-full max-w-md flex items-center gap-2 group"
          >
            <Sparkles className="h-4 w-4 text-primary group-hover:animate-pulse" />
            Generate {categoryValue} Activity
          </Button>
        </div>
      )}
      
      <ActivityList
        filteredActivities={filteredActivities}
        toggleActivityCompletion={toggleActivityCompletion}
        isGeneratingActivity={isGeneratingActivity && (filter === categoryValue || categoryValue === "all")}
      />
    </TabsContent>
  );
};

export default CategoryTabContent;
