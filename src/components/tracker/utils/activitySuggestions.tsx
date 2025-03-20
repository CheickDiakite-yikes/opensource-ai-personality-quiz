
import { ActivityCategory } from "@/utils/types";

// Predefined activity suggestions by category
export const activitySuggestionsByCategory: Record<ActivityCategory, string[]> = {
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
