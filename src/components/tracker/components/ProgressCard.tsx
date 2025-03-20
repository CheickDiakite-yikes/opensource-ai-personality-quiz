
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, CheckCircle2, Star, TrendingUp } from "lucide-react";

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
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  // Credit score style rating based on points
  const getCreditScoreRating = (points: number) => {
    if (points >= 700) return { label: "Exceptional", color: "text-green-500" };
    if (points >= 500) return { label: "Excellent", color: "text-emerald-500" };
    if (points >= 300) return { label: "Good", color: "text-blue-500" };
    if (points >= 150) return { label: "Fair", color: "text-yellow-500" };
    return { label: "Building", color: "text-orange-500" };
  };

  const creditRating = getCreditScoreRating(totalPoints);

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <motion.div
        custom={0}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="col-span-1"
      >
        <Card className="glass-panel h-full border border-primary/10 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" /> Credit Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`${creditRating.color}`}
              >
                {totalPoints}
              </motion.span>
            </div>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className={`text-sm mt-1 font-medium ${creditRating.color}`}
            >
              {creditRating.label} Rating
            </motion.p>
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2.5">
                <motion.div 
                  className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (totalPoints / 800) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>400</span>
                <span>800+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        custom={1}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="col-span-1"
      >
        <Card className="glass-panel h-full border border-primary/10 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-primary" /> Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {completionRate}%
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Activities completed
            </p>
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Progress value={completionRate} className="mt-3 h-2" />
            </motion.div>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {[20, 40, 60, 80, 100].map((threshold, i) => (
                <motion.div
                  key={threshold}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`h-1.5 w-1.5 rounded-full ${
                      completionRate >= threshold ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground mt-1">{threshold}%</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        custom={2}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="col-span-1"
      >
        <Card className="glass-panel h-full border border-primary/10 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary">
                {Math.min(5, Math.floor(totalPoints / 100))}
              </div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="ml-2 flex items-center text-sm text-muted-foreground"
              >
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-green-500">+{Math.floor(totalPoints / 50) % 5}/5</span>
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Unlocked milestones
            </p>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < Math.floor(totalPoints / 100) 
                      ? 'bg-primary' 
                      : 'bg-muted'
                  }`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                />
              ))}
            </div>
            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-muted-foreground flex justify-between"
              >
                <span>Next milestone: {(Math.floor(totalPoints / 100) + 1) * 100} points</span>
                <span>{100 - (totalPoints % 100)} to go</span>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProgressCard;
