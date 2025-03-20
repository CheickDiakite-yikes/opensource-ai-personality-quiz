
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowUpDown, Plus } from "lucide-react";

interface ActivityFiltersProps {
  filter: string;
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  sortBy: 'points' | 'category' | 'date';
  setSortBy: React.Dispatch<React.SetStateAction<'points' | 'category' | 'date'>>;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filter,
  showCompleted,
  setShowCompleted,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <h2 className="text-xl font-semibold">
        {filter === "all" ? "All Activities" : `${filter} Activities`}
      </h2>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-completed" 
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
          />
          <label htmlFor="show-completed" className="text-sm cursor-pointer">
            Show Completed
          </label>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1 h-9"
            onClick={() => setSortBy(prev => 
              prev === 'points' ? 'category' : prev === 'category' ? 'date' : 'points'
            )}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="text-xs">
              Sort: {sortBy === 'points' ? 'Points' : sortBy === 'category' ? 'Category' : 'Date'}
            </span>
          </Button>
        </div>
        
        <Button variant="outline" className="flex items-center h-9" onClick={() => console.log("Add new activity")}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

export default ActivityFilters;
