
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
  ],
  // Add remaining categories to satisfy the Record<ActivityCategory, string[]> type
  [ActivityCategory.PersonalGrowth]: [
    "Learn something new about yourself today",
    "Identify a habit you'd like to change and make a concrete plan",
    "Explore a new interest or hobby",
    "Read a personal development book",
    "Set a meaningful goal with clear steps to achieve it",
    "Attend a workshop or seminar for skill development"
  ],
  [ActivityCategory.SelfReflection]: [
    "Journal about your values and how you live them",
    "Meditate on your past week and note insights",
    "Consider a challenge you've faced and what you learned",
    "Reflect on your strengths and how to use them more",
    "Think about what energizes you and what drains you",
    "Write about where you'd like to be in five years"
  ],
  [ActivityCategory.SocialConnection]: [
    "Reach out to someone you haven't spoken to in a while",
    "Practice active listening in a conversation today",
    "Attend a community event or group meeting",
    "Express gratitude to someone important in your life",
    "Have a meaningful conversation about something that matters",
    "Offer help to someone in your community"
  ],
  [ActivityCategory.EmotionalWellbeing]: [
    "Practice a calming breathing technique",
    "Express an emotion creatively through art or music",
    "Write about your feelings regarding a current situation",
    "Use positive affirmations to shift negative thoughts",
    "Accept your emotions without judgment for a day",
    "Do something purely for joy and pleasure"
  ],
  [ActivityCategory.MindfulPractice]: [
    "Eat a meal mindfully, noticing all sensations",
    "Take a mindful walk focusing on each step",
    "Practice a body scan meditation",
    "Do a daily task with complete presence and attention",
    "Notice five things you can see, four you can touch, three you can hear, two you can smell, and one you can taste",
    "Set aside 10 minutes for silent awareness"
  ],
  [ActivityCategory.StressCoping]: [
    "Practice progressive muscle relaxation",
    "Take a break from news and social media",
    "Go for a nature walk or spend time outdoors",
    "Try a stress-relieving physical activity",
    "Use the 4-7-8 breathing technique when feeling stressed",
    "Create boundaries around work or stressful situations"
  ]
};
