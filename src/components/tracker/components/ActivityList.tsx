
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Activity } from "@/utils/types";
import ActivityCard from "./ActivityCard";
import { Loader2 } from "lucide-react";

interface ActivityListProps {
  filteredActivities: Activity[];
  toggleActivityCompletion: (activityId: string) => void;
  isGeneratingActivity?: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({
  filteredActivities,
  toggleActivityCompletion,
  isGeneratingActivity = false,
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
        {isGeneratingActivity && (
          <Card className="glass-panel p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <p>Generating a personalized activity for you...</p>
          </Card>
        )}
        
        {!isGeneratingActivity && filteredActivities.length === 0 ? (
          <Card className="glass-panel p-6 text-center">
            <p className="text-muted-foreground">No activities in this category yet.</p>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityCard 
              key={activity.id}
              activity={activity}
              onToggleComplete={toggleActivityCompletion}
            />
          ))
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ActivityList;
