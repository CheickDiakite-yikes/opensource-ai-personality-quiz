
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, ActivityCategory } from "@/utils/types";
import { Trophy, Calendar } from "lucide-react";
import { getCategoryIcon, getCategoryColor } from "../utils/categoryUtils";

interface ActivityCardProps {
  activity: Activity;
  toggleActivityCompletion: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  toggleActivityCompletion,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div 
      key={activity.id} 
      variants={itemVariants}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`glass-panel transition-all duration-300 ${activity.completed ? 'bg-secondary/30' : ''}`}>
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Checkbox
                  checked={activity.completed}
                  onCheckedChange={() => toggleActivityCompletion(activity.id)}
                  className="h-5 w-5"
                />
              </div>
              <div>
                <CardTitle className={`text-lg ${activity.completed ? 'line-through opacity-70' : ''}`}>
                  {activity.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {activity.description}
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`ml-3 flex items-center gap-1 ${getCategoryColor(activity.category)}`}
            >
              {getCategoryIcon(activity.category)}
              <span className="hidden md:inline">{activity.category}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-2 pb-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Trophy className="h-4 w-4 mr-1" /> {activity.points} points
            
            {activity.completed && activity.completedAt && (
              <span className="ml-4 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {activity.completedAt.toLocaleDateString()}
              </span>
            )}
          </div>
          
          {!activity.completed && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => toggleActivityCompletion(activity.id)}
            >
              Mark Complete
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ActivityCard;
