
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";
import { ActivityCategory } from "@/utils/types";

interface CategoryTabContentProps {
  filter: ActivityCategory | "all";
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  sortBy: 'points' | 'category' | 'date';
  setSortBy: React.Dispatch<React.SetStateAction<'points' | 'category' | 'date'>>;
  filteredActivities: any[];
  toggleActivityCompletion: (activityId: string) => void;
  isGeneratingActivity: boolean;
  generateActivity: () => void;
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
  return (
    <TabsContent value={categoryValue} className="mt-0">
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
        isGeneratingActivity={isGeneratingActivity && (filter === categoryValue || categoryValue === "all")}
      />
    </TabsContent>
  );
};

export default CategoryTabContent;
