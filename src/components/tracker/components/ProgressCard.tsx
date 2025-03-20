
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, CheckCircle2, Star } from "lucide-react";

interface ProgressCardProps {
  totalPoints: number;
  completedActivities: number;
  totalActivities: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  totalPoints,
  completedActivities,
  totalActivities,
}) => {
  // Calculate completion rate
  const completionRate = Math.round(
    (completedActivities / totalActivities) * 100
  );

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
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="col-span-1"
      >
        <Card className="glass-panel h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" /> Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {totalPoints}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              From {completedActivities} completed activities
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="col-span-1"
      >
        <Card className="glass-panel h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-primary" /> Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {completionRate}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Activities completed
            </p>
            <Progress value={completionRate} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="col-span-1"
      >
        <Card className="glass-panel h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {Math.min(5, Math.floor(totalPoints / 100))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Unlocked milestones
            </p>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full ${
                    i < Math.floor(totalPoints / 100) 
                      ? 'bg-primary' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProgressCard;
