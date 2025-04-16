
import { PersonalityTraitsDetermination } from "./types";

/**
 * Determines personality traits based on response patterns
 */
export const determinePersonalityTraits = (primaryChoice: string): PersonalityTraitsDetermination => {
  let primaryTrait, analyticalScore, emotionalScore, adaptabilityScore;
  let decisionMakingStyle, learningStyle, emotionalAwareness;
  
  // Primary trait based on most common response
  switch(primaryChoice) {
    case 'a':
      primaryTrait = "Analytical Strategist";
      analyticalScore = 85 + Math.random() * 10;
      emotionalScore = 65 + Math.random() * 15;
      adaptabilityScore = 72 + Math.random() * 8;
      decisionMakingStyle = "You tend to gather all available information before making decisions, weighing pros and cons meticulously. This methodical approach serves you well for complex choices but may slow you down for simpler ones.";
      learningStyle = "You learn best through structured, logical frameworks and detailed analysis. You prefer to master fundamental concepts before moving forward.";
      emotionalAwareness = "You have strong cognitive awareness of emotions, though you may sometimes intellectualize feelings rather than experiencing them directly.";
      break;
    case 'b':
      primaryTrait = "Empathic Connector";
      analyticalScore = 70 + Math.random() * 10;
      emotionalScore = 87 + Math.random() * 8;
      adaptabilityScore = 78 + Math.random() * 12;
      decisionMakingStyle = "You balance rational analysis with intuition, often considering how choices will affect others. You're skilled at understanding multiple perspectives when making decisions.";
      learningStyle = "You learn best through collaborative discussion and connecting new information to personal experiences. Social learning environments tend to enhance your understanding.";
      emotionalAwareness = "You possess exceptional awareness of your emotional landscape and can often sense others' feelings with remarkable accuracy. This emotional intelligence is a cornerstone of your personality.";
      break;
    case 'c':
      primaryTrait = "Adaptive Innovator";
      analyticalScore = 75 + Math.random() * 12;
      emotionalScore = 72 + Math.random() * 10;
      adaptabilityScore = 88 + Math.random() * 7;
      decisionMakingStyle = "You're comfortable making decisions with incomplete information, trusting your ability to adjust as new data emerges. This adaptive approach serves you well in rapidly changing situations.";
      learningStyle = "You learn through experimentation and practical application, preferring to dive in and learn by doing rather than extensive preparation.";
      emotionalAwareness = "You have a balanced awareness of emotions and can generally identify what you're feeling, though you may sometimes prioritize action over processing emotions fully.";
      break;
    case 'd':
      primaryTrait = "Visionary Explorer";
      analyticalScore = 79 + Math.random() * 11;
      emotionalScore = 76 + Math.random() * 14;
      adaptabilityScore = 83 + Math.random() * 9;
      decisionMakingStyle = "You often rely on intuition and big-picture thinking when making decisions. You have a knack for seeing possibilities others miss and are comfortable taking calculated risks.";
      learningStyle = "You learn best when exploring connections between diverse concepts and ideas. You're drawn to the novel and unconventional in your approach to knowledge.";
      emotionalAwareness = "You have good emotional awareness, particularly when emotions connect to your values and aspirations. You're especially attuned to feelings of wonder, curiosity, and inspiration.";
      break;
    default:
      primaryTrait = "Balanced Thinker";
      analyticalScore = 75 + Math.random() * 10;
      emotionalScore = 75 + Math.random() * 10;
      adaptabilityScore = 75 + Math.random() * 10;
      decisionMakingStyle = "You approach decisions with a balanced perspective, weighing both logical and intuitive factors.";
      learningStyle = "You have a flexible learning style that adapts to different contexts and subject matters.";
      emotionalAwareness = "You have a solid awareness of your emotions and can generally navigate emotional situations effectively.";
  }
  
  return {
    primaryTrait,
    analyticalScore,
    emotionalScore,
    adaptabilityScore,
    decisionMakingStyle,
    learningStyle,
    emotionalAwareness
  };
};

/**
 * Determines secondary trait based on response pattern
 */
export const determineSecondaryTrait = (secondaryChoice: string): string => {
  switch(secondaryChoice) {
    case 'a': return "Systematic Thinker";
    case 'b': return "Relationship Focused";
    case 'c': return "Pragmatic Adapter";
    case 'd': return "Creative Explorer";
    default: return "Balanced Thinker";
  }
};
