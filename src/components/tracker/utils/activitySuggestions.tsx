
import { ActivityCategory } from "@/utils/types";

// Activity suggestions by category
export const activitySuggestionsByCategory: Record<ActivityCategory, string[]> = {
  [ActivityCategory.KINDNESS]: [
    "Write a thank-you note to someone who has helped you recently",
    "Compliment three people today",
    "Donate to a charity you believe in",
    "Help a neighbor with a chore or task",
    "Leave a positive review for a local business you appreciate",
    "Make a care package for someone going through a hard time"
  ],
  [ActivityCategory.MINDFULNESS]: [
    "Practice deep breathing for 5 minutes",
    "Do a body scan meditation",
    "Take a mindful walk, noticing your surroundings",
    "Journal about your thoughts and feelings without judgment",
    "Practice mindful eating during one meal today",
    "Set aside 10 minutes for complete silence"
  ],
  [ActivityCategory.LEARNING]: [
    "Read an article on a topic you know little about",
    "Watch a documentary on a new subject",
    "Take a free online class in a new skill",
    "Learn 5 words in a new language",
    "Listen to an educational podcast",
    "Visit a museum (virtual or in-person)"
  ],
  [ActivityCategory.HEALTH]: [
    "Try a new form of exercise for 20 minutes",
    "Drink water instead of sugary beverages all day",
    "Get outside for at least 30 minutes today",
    "Try a new healthy recipe",
    "Go to bed 30 minutes earlier than usual",
    "Do a quick 7-minute workout"
  ],
  [ActivityCategory.SOCIAL]: [
    "Call a friend or family member you haven't spoken to in a while",
    "Have a meaningful conversation with someone new",
    "Attend a community event",
    "Join an online forum or group related to your interests",
    "Organize a small gathering with friends",
    "Offer to help a colleague with a project"
  ],
  [ActivityCategory.CREATIVITY]: [
    "Doodle or draw for 15 minutes",
    "Write a short poem or story",
    "Take photos of things that inspire you today",
    "Try a new recipe with creative modifications",
    "Rearrange a room in your home",
    "Create something with your hands (knit, build, craft)"
  ],
  [ActivityCategory.COGNITIVE]: [
    "Solve a puzzle or brain teaser",
    "Try using your non-dominant hand for routine tasks",
    "Play a strategy game",
    "Memorize a short poem or quote",
    "Learn about a complex topic and explain it to someone else",
    "Create a mind map for a project or idea"
  ],
  [ActivityCategory.EMOTIONAL]: [
    "Write down three things you're grateful for",
    "Practice self-compassion by writing a kind letter to yourself",
    "Identify and name your emotions throughout the day",
    "Create a playlist that expresses your current emotional state",
    "Practice saying 'no' to something that doesn't serve you",
    "Reflect on a challenging situation from multiple perspectives"
  ],
  [ActivityCategory.PERSONALITY]: [
    "Do something outside your comfort zone",
    "Practice a trait you'd like to strengthen (e.g., patience, assertiveness)",
    "Reflect on your core values and how you express them",
    "Try an activity typically associated with a different personality type",
    "Ask for feedback from someone you trust about your strengths",
    "Set a small goal that aligns with your desired personal growth"
  ],
  [ActivityCategory.MOTIVATION]: [
    "Set a clear intention for the day",
    "Break down a large goal into small, manageable steps",
    "Create a vision board for a goal you're working toward",
    "Identify and address one thing that's been draining your motivation",
    "Reward yourself for completing a challenging task",
    "Find an accountability partner for a goal"
  ],
  [ActivityCategory.VALUES]: [
    "Make one decision today that aligns with your core values",
    "Write about a time when you stood up for something you believe in",
    "Research an organization that aligns with your values",
    "Have a conversation about values with someone close to you",
    "Evaluate how your daily activities reflect your values",
    "Practice saying 'yes' to things that align with your values"
  ],
  [ActivityCategory.STRENGTHS]: [
    "Use one of your top strengths in a new way today",
    "Help someone by offering your unique skills",
    "Reflect on a time when you used your strengths effectively",
    "Take on a task that plays to your natural abilities",
    "Learn about how to further develop one of your strengths",
    "Ask others what they see as your key strengths"
  ]
};
