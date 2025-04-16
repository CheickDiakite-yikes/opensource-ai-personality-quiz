
import { StrengthsChallengesResult } from "./types";

/**
 * Generates strengths and challenges based on response patterns
 */
export const generateStrengthsAndChallenges = (
  primaryChoice: string, 
  secondaryChoice: string
): StrengthsChallengesResult => {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const growthAreas: string[] = [];
  const recommendations: string[] = [];
  
  // Add strengths based on primary and secondary choices
  if (primaryChoice === 'a' || secondaryChoice === 'a') {
    strengths.push("Analytical problem-solving", "Strategic planning", "Critical evaluation");
    challenges.push("May sometimes overthink decisions", "Could benefit from trusting intuition more");
    growthAreas.push("Developing comfort with ambiguity", "Balancing analysis with action");
    recommendations.push("Practice making quicker decisions in low-stakes situations", "Set time limits for analysis phases");
  }
  
  if (primaryChoice === 'b' || secondaryChoice === 'b') {
    strengths.push("Emotional intelligence", "Building meaningful connections", "Collaborative skills");
    challenges.push("May prioritize others' needs over your own", "Could be oversensitive to criticism");
    growthAreas.push("Setting healthy boundaries", "Balancing empathy with self-care");
    recommendations.push("Practice assertive communication techniques", "Schedule regular self-care activities");
  }
  
  if (primaryChoice === 'c' || secondaryChoice === 'c') {
    strengths.push("Adaptability", "Practical problem-solving", "Resourcefulness");
    challenges.push("Might avoid long-term planning", "Could benefit from more reflection time");
    growthAreas.push("Developing long-term strategic vision", "Finding deeper meaning in practical work");
    recommendations.push("Dedicate time for reflection and planning", "Connect daily actions to larger goals");
  }
  
  if (primaryChoice === 'd' || secondaryChoice === 'd') {
    strengths.push("Creative thinking", "Seeing new possibilities", "Inspiring others");
    challenges.push("May struggle with follow-through", "Could get distracted by new ideas");
    growthAreas.push("Translating vision into structured action", "Balancing exploration with completion");
    recommendations.push("Use project management tools to track progress", "Partner with detail-oriented people");
  }
  
  return { strengths, challenges, growthAreas, recommendations };
};
