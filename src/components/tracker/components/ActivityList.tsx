
import React from "react";
import { Activity } from "@/utils/types";
import ActivityCard from "./ActivityCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityListProps {
  filteredActivities: Activity[];
  toggleActivityCompletion: (activityId: string) => void;
  isGeneratingActivity: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
  filteredActivities,
  toggleActivityCompletion,
  isGeneratingActivity,
}) => {
  // If there are no activities, show a message
  if (filteredActivities.length === 0 && !isGeneratingActivity) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activities found for this category.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adding a new activity or switching categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Show loading skeleton if generating activity */}
      {isGeneratingActivity && (
        <div className="col-span-1">
          <Skeleton className="h-[200px] w-full rounded-xl bg-black/40 border border-white/10" />
        </div>
      )}

      {/* Render activity cards */}
      {filteredActivities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onToggleComplete={toggleActivityCompletion}
        />
      ))}
    </div>
  );
};

export default ActivityList;
