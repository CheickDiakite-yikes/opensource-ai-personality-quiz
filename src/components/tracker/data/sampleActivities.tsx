
import { Activity, ActivityCategory } from "@/utils/types";

// Sample activities
export const sampleActivities: Activity[] = [
  {
    id: "1",
    title: "Buy someone coffee",
    description: "Treat a friend, colleague, or even a stranger to coffee and engage in meaningful conversation.",
    points: 20,
    category: ActivityCategory.KINDNESS,
    completed: false,
    createdAt: new Date(),
    benefits: "Improves social connections and spreads kindness"
  },
  {
    id: "2",
    title: "Practice mindfulness for 10 minutes",
    description: "Sit quietly and focus on your breath, bringing awareness to the present moment.",
    points: 15,
    category: ActivityCategory.MINDFULNESS,
    completed: false,
    createdAt: new Date(),
    benefits: "Reduces stress and improves mental clarity"
  },
  {
    id: "3",
    title: "Learn something new for 30 minutes",
    description: "Dedicate time to acquiring a new skill or knowledge that interests you.",
    points: 25,
    category: ActivityCategory.LEARNING,
    completed: false,
    createdAt: new Date(),
    benefits: "Enhances cognitive flexibility and personal growth"
  },
  {
    id: "4",
    title: "Take a nature walk",
    description: "Spend time outdoors connecting with nature and getting physical activity.",
    points: 20,
    category: ActivityCategory.HEALTH,
    completed: false,
    createdAt: new Date(),
    benefits: "Improves physical health and mental wellbeing"
  },
  {
    id: "5",
    title: "Reach out to an old friend",
    description: "Reconnect with someone you haven't spoken to in a while to strengthen social bonds.",
    points: 15,
    category: ActivityCategory.SOCIAL,
    completed: false,
    createdAt: new Date(),
    benefits: "Strengthens social connections and support networks"
  },
  {
    id: "6",
    title: "Express gratitude to someone",
    description: "Thank someone who has made a positive impact on your life, no matter how small.",
    points: 10,
    category: ActivityCategory.KINDNESS,
    completed: false,
    createdAt: new Date(),
    benefits: "Increases positive emotions and strengthens relationships"
  },
  {
    id: "7",
    title: "Create something artistic",
    description: "Engage in a creative activity like drawing, writing, or music to express yourself.",
    points: 20,
    category: ActivityCategory.CREATIVITY,
    completed: false,
    createdAt: new Date(),
    benefits: "Enhances creative thinking and self-expression"
  },
  {
    id: "8",
    title: "Volunteer for a cause you care about",
    description: "Give your time to help others and contribute to your community.",
    points: 30,
    category: ActivityCategory.KINDNESS,
    completed: false,
    createdAt: new Date(),
    benefits: "Creates meaning and purpose while helping others"
  },
  {
    id: "9",
    title: "Practice active listening",
    description: "In your next conversation, focus completely on understanding the other person without planning your response.",
    points: 15,
    category: ActivityCategory.SOCIAL,
    completed: false,
    createdAt: new Date(),
    benefits: "Improves communication skills and empathy"
  },
  {
    id: "10",
    title: "Try a new healthy recipe",
    description: "Experiment with cooking a nutritious meal you've never made before.",
    points: 20,
    category: ActivityCategory.HEALTH,
    completed: false,
    createdAt: new Date(),
    benefits: "Encourages healthy eating habits and culinary creativity"
  },
];
