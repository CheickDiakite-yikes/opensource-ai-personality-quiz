
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Activity } from "@/utils/types";
import ActivityCard from "./ActivityCard";

interface ActivityListProps {
  filteredActivities: Activity[];
  toggleActivityCompletion: (activityId: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  filteredActivities,
  toggleActivityCompletion,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredActivities.length === 0 ? (
          <Card className="glass-panel p-6 text-center">
            <p className="text-muted-foreground">No activities in this category yet.</p>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityCard 
              key={activity.id}
              activity={activity}
              toggleActivityCompletion={toggleActivityCompletion}
            />
          ))
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ActivityList;
