
import { useState, useEffect } from "react";
import { Activity, ActivityCategory } from "@/utils/types";
import { sampleActivities } from "../data/sampleActivities";
import { toast } from "sonner";
import { Trophy, Award } from "lucide-react";

export const useActivityState = () => {
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [filter, setFilter] = useState<ActivityCategory | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'category' | 'date'>('category');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextLevelPoints, setNextLevelPoints] = useState(200);
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);
  
  // Calculate total points
  const totalPoints = activities
    .filter(a => a.completed)
    .reduce((sum, activity) => sum + activity.points, 0);
  
  // Calculate level and next level threshold
  useEffect(() => {
    const level = Math.floor(totalPoints / 200) + 1;
    const nextPoints = level * 200;
    setCurrentLevel(level);
    setNextLevelPoints(nextPoints);
  }, [totalPoints]);
  
  // Calculate progress percentage to next level
  const levelProgress = ((totalPoints % 200) / 200) * 100;
  
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
            description: "Great job completing this activity!",
            action: {
              label: "View Rewards",
              onClick: () => console.log("View Rewards clicked")
            },
            icon: <Trophy className="h-5 w-5 text-yellow-500" />
          });
          
          // Level up notification
          const newTotal = totalPoints + activity.points;
          if (Math.floor(newTotal / 200) > Math.floor(totalPoints / 200)) {
            toast("Level Up!", {
              description: `You've reached level ${Math.floor(newTotal / 200) + 1}!`,
              icon: <Award className="h-6 w-6 text-yellow-500" />,
              duration: 5000,
              className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            });
          }
        }
        
        return newActivity;
      }
      return activity;
    }));
  };
  
  // Generate a new activity based on user's profile
  const generateActivity = async () => {
    setIsGeneratingActivity(true);
    
    try {
      toast.info("Generating a personalized activity for you...");
      
      // In a real implementation, we would retrieve the user's latest analysis
      // from the database and pass relevant information to the OpenAI API
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock categories and points for variety
      const categories = Object.values(ActivityCategory);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomPoints = Math.floor(Math.random() * 30) + 10; // 10-40 points
      
      // Predefined activity suggestions by category
      const activitySuggestions = {
        [ActivityCategory.Kindness]: [
          "Write a thoughtful note to someone who helped you recently",
          "Pay for a stranger's coffee",
          "Volunteer at a local community center for an hour",
          "Donate items you no longer need to a shelter",
          "Help an elderly neighbor with errands"
        ],
        [ActivityCategory.Mindfulness]: [
          "Practice focused breathing for 10 minutes",
          "Write in a gratitude journal",
          "Take a mindful walk without digital distractions",
          "Try a new meditation technique",
          "Create a calming evening ritual"
        ],
        [ActivityCategory.Learning]: [
          "Read an article in a field you're unfamiliar with",
          "Take a free online course in a new subject",
          "Learn 5 words in a new language",
          "Watch an educational documentary",
          "Attend a virtual workshop"
        ],
        [ActivityCategory.Health]: [
          "Try a new healthy recipe",
          "Exercise for 30 minutes in a way you enjoy",
          "Take a screen-free break for 2 hours",
          "Get outside for 20 minutes of fresh air",
          "Create a sleep improvement plan"
        ],
        [ActivityCategory.Social]: [
          "Reach out to someone you haven't spoken to in months",
          "Host a small gathering around a shared interest",
          "Join a community event or meetup",
          "Have a meaningful conversation with someone new",
          "Offer specific help to a friend in need"
        ],
        [ActivityCategory.Creativity]: [
          "Try a creative activity you've never done before",
          "Write a short story or poem",
          "Create something with your hands (art, craft, food)",
          "Redesign a space in your home",
          "Take photos that represent your current mood"
        ]
      };
      
      // Select random activity from the appropriate category
      const suggestions = activitySuggestions[randomCategory];
      const randomActivity = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      // Create new activity
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        title: randomActivity,
        description: `This activity will help you develop your ${randomCategory.toLowerCase()} skills and earn you points toward your next level.`,
        points: randomPoints,
        category: randomCategory,
        completed: false
      };
      
      // Add the new activity to the list
      setActivities(prev => [newActivity, ...prev]);
      
      toast.success("New activity created!", {
        description: `${randomActivity} (${randomPoints} points)`,
        duration: 5000
      });
      
    } catch (error) {
      console.error("Error generating activity:", error);
      toast.error("Failed to generate activity. Please try again.");
    } finally {
      setIsGeneratingActivity(false);
    }
  };
  
  // Apply filters and sorting
  let filteredActivities = activities.filter(activity => 
    (filter === "all" || activity.category === filter) &&
    (showCompleted || !activity.completed)
  );
  
  // Apply sorting
  if (sortBy === 'points') {
    filteredActivities = [...filteredActivities].sort((a, b) => b.points - a.points);
  } else if (sortBy === 'category') {
    filteredActivities = [...filteredActivities].sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'date') {
    filteredActivities = [...filteredActivities].sort((a, b) => {
      if (a.completed && b.completed && a.completedAt && b.completedAt) {
        return b.completedAt.getTime() - a.completedAt.getTime();
      }
      return a.completed ? 1 : -1;
    });
  }

  return {
    activities,
    filter,
    setFilter,
    showCompleted,
    setShowCompleted,
    sortBy, 
    setSortBy,
    currentLevel,
    nextLevelPoints,
    totalPoints,
    levelProgress,
    toggleActivityCompletion,
    filteredActivities,
    generateActivity,
    isGeneratingActivity
  };
};
