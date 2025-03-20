
import { ActivityCategory } from "@/utils/types";

// Suggestions for each activity category
export const activitySuggestions: Record<ActivityCategory, string[]> = {
  [ActivityCategory.KINDNESS]: [
    "Write a thoughtful message to someone you appreciate",
    "Volunteer for a local cause that matters to you",
    "Perform a random act of kindness for a stranger",
    "Help a neighbor with a task or errand",
    "Donate items you no longer need to a charity"
  ],
  [ActivityCategory.MINDFULNESS]: [
    "Practice focused breathing for 10 minutes",
    "Take a mindful walk without digital distractions",
    "Journal about your thoughts and feelings",
    "Practice a body scan meditation",
    "Engage in one task with complete attention"
  ],
  [ActivityCategory.LEARNING]: [
    "Read an article on a topic outside your expertise",
    "Take a free online course in a new subject",
    "Learn 5 new words in a language you're interested in",
    "Watch an educational documentary",
    "Listen to an informative podcast"
  ],
  [ActivityCategory.HEALTH]: [
    "Try a new healthy recipe",
    "Take a 30-minute walk outdoors",
    "Practice a 15-minute stretching routine",
    "Replace one unhealthy food choice with a nutritious alternative",
    "Get 7-8 hours of quality sleep"
  ],
  [ActivityCategory.SOCIAL]: [
    "Reach out to a friend you haven't spoken to in a while",
    "Have a meaningful conversation with someone new",
    "Practice active listening in your next interaction",
    "Join a community group or club related to your interests",
    "Organize a small gathering with friends or family"
  ],
  [ActivityCategory.CREATIVITY]: [
    "Draw, paint, or sketch something from your imagination",
    "Write a short story or poem",
    "Try a new recipe or modify an existing one",
    "Create something useful from items you already have",
    "Take photographs of interesting perspectives around you"
  ],
  [ActivityCategory.COGNITIVE]: [
    "Solve a puzzle or brain teaser",
    "Learn a new mental math technique",
    "Practice strategic thinking through a board game",
    "Analyze a problem from multiple perspectives",
    "Study a complex topic and explain it simply"
  ],
  [ActivityCategory.EMOTIONAL]: [
    "Identify and name your emotions throughout the day",
    "Practice self-compassion when facing challenges",
    "Express gratitude for three specific things",
    "Explore the root cause of a negative emotion",
    "Use art or writing to process complex feelings"
  ],
  [ActivityCategory.PERSONALITY]: [
    "Reflect on your core values and how they guide your actions",
    "Step outside your comfort zone in a small but meaningful way",
    "Ask for feedback from someone you trust",
    "Practice a trait you'd like to strengthen",
    "Challenge a limiting belief about yourself"
  ],
  [ActivityCategory.MOTIVATION]: [
    "Set a SMART goal for something meaningful to you",
    "Create a vision board for your aspirations",
    "Break down a large goal into small, actionable steps",
    "Identify your intrinsic motivators",
    "Celebrate a small win or progress milestone"
  ],
  [ActivityCategory.VALUES]: [
    "Make a decision that aligns with your core values",
    "Practice standing up for something you believe in",
    "Evaluate how your daily actions reflect your values",
    "Learn about ethical frameworks different from your own",
    "Volunteer for a cause aligned with your values"
  ],
  [ActivityCategory.STRENGTHS]: [
    "Use one of your top strengths in a new way",
    "Teach someone a skill you excel at",
    "Reflect on when your strengths have helped you succeed",
    "Combine two of your strengths to solve a problem",
    "Seek out opportunities that leverage your natural talents"
  ]
};
