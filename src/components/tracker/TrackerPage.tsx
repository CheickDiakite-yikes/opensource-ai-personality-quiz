import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Activity, ActivityCategory } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Heart, 
  Brain, 
  Users, 
  BookOpen, 
  Activity as ActivityIcon,
  Paintbrush,
  Plus,
  Trophy,
  Award,
  Star
} from "lucide-react";

// Sample activities
const sampleActivities: Activity[] = [
  {
    id: "1",
    title: "Buy someone coffee",
    description: "Treat a friend, colleague, or even a stranger to coffee and engage in meaningful conversation.",
    points: 20,
    category: ActivityCategory.Kindness,
    completed: false,
  },
  {
    id: "2",
    title: "Practice mindfulness for 10 minutes",
    description: "Sit quietly and focus on your breath, bringing awareness to the present moment.",
    points: 15,
    category: ActivityCategory.Mindfulness,
    completed: false,
  },
  {
    id: "3",
    title: "Learn something new for 30 minutes",
    description: "Dedicate time to acquiring a new skill or knowledge that interests you.",
    points: 25,
    category: ActivityCategory.Learning,
    completed: false,
  },
  {
    id: "4",
    title: "Take a nature walk",
    description: "Spend time outdoors connecting with nature and getting physical activity.",
    points: 20,
    category: ActivityCategory.Health,
    completed: false,
  },
  {
    id: "5",
    title: "Reach out to an old friend",
    description: "Reconnect with someone you haven't spoken to in a while to strengthen social bonds.",
    points: 15,
    category: ActivityCategory.Social,
    completed: false,
  },
  {
    id: "6",
    title: "Express gratitude to someone",
    description: "Thank someone who has made a positive impact on your life, no matter how small.",
    points: 10,
    category: ActivityCategory.Kindness,
    completed: false,
  },
  {
    id: "7",
    title: "Create something artistic",
    description: "Engage in a creative activity like drawing, writing, or music to express yourself.",
    points: 20,
    category: ActivityCategory.Creativity,
    completed: false,
  },
  {
    id: "8",
    title: "Volunteer for a cause you care about",
    description: "Give your time to help others and contribute to your community.",
    points: 30,
    category: ActivityCategory.Kindness,
    completed: false,
  },
  {
    id: "9",
    title: "Practice active listening",
    description: "In your next conversation, focus completely on understanding the other person without planning your response.",
    points: 15,
    category: ActivityCategory.Social,
    completed: false,
  },
  {
    id: "10",
    title: "Try a new healthy recipe",
    description: "Experiment with cooking a nutritious meal you've never made before.",
    points: 20,
    category: ActivityCategory.Health,
    completed: false,
  },
];

// Category icons mapping
const getCategoryIcon = (category: ActivityCategory) => {
  switch (category) {
    case ActivityCategory.Kindness:
      return <Heart className="h-5 w-5" />;
    case ActivityCategory.Mindfulness:
      return <Brain className="h-5 w-5" />;
    case ActivityCategory.Learning:
      return <BookOpen className="h-5 w-5" />;
    case ActivityCategory.Health:
      return <ActivityIcon className="h-5 w-5" />;
    case ActivityCategory.Social:
      return <Users className="h-5 w-5" />;
    case ActivityCategory.Creativity:
      return <Paintbrush className="h-5 w-5" />;
    default:
      return <Star className="h-5 w-5" />;
  }
};

// Category color mapping
const getCategoryColor = (category: ActivityCategory) => {
  switch (category) {
    case ActivityCategory.Kindness:
      return "bg-pink-500/10 text-pink-600";
    case ActivityCategory.Mindfulness:
      return "bg-purple-500/10 text-purple-600";
    case ActivityCategory.Learning:
      return "bg-blue-500/10 text-blue-600";
    case ActivityCategory.Health:
      return "bg-emerald-500/10 text-emerald-600";
    case ActivityCategory.Social:
      return "bg-amber-500/10 text-amber-600";
    case ActivityCategory.Creativity:
      return "bg-indigo-500/10 text-indigo-600";
    default:
      return "bg-gray-500/10 text-gray-600";
  }
};

const TrackerPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [filter, setFilter] = useState<ActivityCategory | "all">("all");
  
  const toggleActivityCompletion = (activityId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const now = new Date();
        const newActivity = {
          ...activity,
          completed: !activity.completed,
          completedAt: activity.completed ? undefined : now,
        };
        
        if (!activity.completed) {
          toast.success(`+${activity.points} points!`, {
            description: "Great job completing this activity!"
          });
        }
        
        return newActivity;
      }
      return activity;
    }));
  };
  
  // Calculate total points
  const totalPoints = activities
    .filter(a => a.completed)
    .reduce((sum, activity) => sum + activity.points, 0);
  
  // Calculate completion rate
  const completionRate = Math.round(
    (activities.filter(a => a.completed).length / activities.length) * 100
  );
  
  // Filter activities based on selected category
  const filteredActivities = activities.filter(activity => 
    filter === "all" || activity.category === filter
  );
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
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
    <div className="container max-w-4xl py-6 md:py-10 px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Growth Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and earn points through self-improvement activities
        </p>
      </div>
      
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
                <Trophy className="h-5 w-5 mr-2 text-primary" /> Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {totalPoints}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Earned through completed activities
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
                <Award className="h-5 w-5 mr-2 text-primary" /> Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {completionRate}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Activities completed
              </p>
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
                <Star className="h-5 w-5 mr-2 text-primary" /> Next Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {Math.max(0, 200 - totalPoints)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Points needed to reach next level
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger 
            value="kindness" 
            onClick={() => setFilter(ActivityCategory.Kindness)}
            className="flex items-center"
          >
            <Heart className="h-4 w-4 mr-1 inline md:hidden" />
            <span className="hidden md:inline">Kindness</span>
          </TabsTrigger>
          <TabsTrigger 
            value="mindfulness" 
            onClick={() => setFilter(ActivityCategory.Mindfulness)}
            className="flex items-center"
          >
            <Brain className="h-4 w-4 mr-1 inline md:hidden" />
            <span className="hidden md:inline">Mindfulness</span>
          </TabsTrigger>
          <TabsTrigger 
            value="learning" 
            onClick={() => setFilter(ActivityCategory.Learning)}
            className="flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-1 inline md:hidden" />
            <span className="hidden md:inline">Learning</span>
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            onClick={() => setFilter(ActivityCategory.Health)}
            className="flex items-center"
          >
            <ActivityIcon className="h-4 w-4 mr-1 inline md:hidden" />
            <span className="hidden md:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger 
            value="social" 
            onClick={() => setFilter(ActivityCategory.Social)}
            className="flex items-center"
          >
            <Users className="h-4 w-4 mr-1 inline md:hidden" />
            <span className="hidden md:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger 
            value="creativity" 
            onClick={() => setFilter(ActivityCategory.Creativity)}
            className="flex items-center"
          >
            <Paintbrush className="h-4 w-4 mr-1 inline md:hidden" />
            <span className="hidden md:inline">Creativity</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter} className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {filter === "all" ? "All Activities" : `${filter} Activities`}
            </h2>
            <Button variant="outline" className="flex items-center" onClick={() => console.log("Add new activity")}>
              <Plus className="h-4 w-4 mr-2" /> Add Activity
            </Button>
          </div>
          
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
                <motion.div key={activity.id} variants={itemVariants}>
                  <Card className={`glass-panel transition-all duration-300 ${activity.completed ? 'bg-secondary/30' : ''}`}>
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={activity.completed}
                            onCheckedChange={() => toggleActivityCompletion(activity.id)}
                            className="mt-1"
                          />
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
                    <CardFooter className="pt-2 pb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4 mr-1" /> {activity.points} points
                        
                        {activity.completed && activity.completedAt && (
                          <span className="ml-4">
                            Completed on {activity.completedAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackerPage;
