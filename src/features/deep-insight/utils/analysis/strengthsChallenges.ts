
import { StrengthsChallengesResult } from "./types";

/**
 * Generates strengths and challenges based on response patterns
 * Now with more honest and balanced feedback that doesn't shy away from identifying areas needing improvement
 */
export const generateStrengthsChallenges = (
  primaryChoice: string, 
  secondaryChoice: string
): StrengthsChallengesResult => {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const growthAreas: string[] = [];
  const recommendations: string[] = [];
  
  // Add strengths and challenges based on primary and secondary choices
  if (primaryChoice === 'a' || secondaryChoice === 'a') {
    strengths.push("Analytical problem-solving", "Strategic planning", "Critical evaluation");
    challenges.push(
      "May overthink decisions to the point of analysis paralysis", 
      "Could come across as cold or overly critical to others",
      "Tendency to miss emotional and social cues when focused on analysis"
    );
    growthAreas.push(
      "Developing comfort with ambiguity and imperfect information", 
      "Balancing rational analysis with emotional intelligence",
      "Learning to trust intuition alongside logic"
    );
    recommendations.push(
      "Practice making decisions with incomplete information", 
      "Set strict time limits for analysis phases to avoid overthinking",
      "Actively engage with others' emotional perspectives"
    );
  }
  
  if (primaryChoice === 'b' || secondaryChoice === 'b') {
    strengths.push("Emotional intelligence", "Building meaningful connections", "Collaborative skills");
    challenges.push(
      "Often prioritizes others' needs at the expense of your own wellbeing", 
      "Can be overly sensitive to criticism or perceived rejection",
      "May avoid necessary conflict to maintain harmony"
    );
    growthAreas.push(
      "Setting clear boundaries without guilt", 
      "Developing resilience to criticism and disappointment",
      "Learning to identify when people-pleasing is self-destructive"
    );
    recommendations.push(
      "Practice saying no without lengthy justifications", 
      "Schedule regular self-care as non-negotiable time",
      "Use structured frameworks for addressing necessary conflicts"
    );
  }
  
  if (primaryChoice === 'c' || secondaryChoice === 'c') {
    strengths.push("Adaptability", "Practical problem-solving", "Resourcefulness");
    challenges.push(
      "Tendency to focus on immediate results at the expense of long-term planning", 
      "May jump to action before fully understanding complex situations",
      "Could miss deeper patterns or implications by being too pragmatic"
    );
    growthAreas.push(
      "Developing strategic thinking and long-term vision", 
      "Finding deeper meaning and purpose beyond practical outcomes",
      "Learning to pause for reflection before action"
    );
    recommendations.push(
      "Schedule regular time for strategic thinking with no immediate deliverables", 
      "Connect daily actions to larger goals and values",
      "Practice meditation or mindfulness to develop comfort with non-doing"
    );
  }
  
  if (primaryChoice === 'd' || secondaryChoice === 'd') {
    strengths.push("Creative thinking", "Seeing new possibilities", "Inspiring others");
    challenges.push(
      "Chronic difficulty with follow-through and completion", 
      "Easily distracted by new ideas before finishing current projects",
      "May struggle with practical implementation of creative visions"
    );
    growthAreas.push(
      "Developing discipline and project management skills", 
      "Learning to value completion as much as ideation",
      "Building systems to translate vision into structured action"
    );
    recommendations.push(
      "Use project management tools with clear milestones and deadlines", 
      "Partner with detail-oriented people for implementation",
      "Practice the discipline of finishing smaller projects before starting new ones"
    );
  }
  
  // New options that represent common but potentially problematic human behaviors
  if (primaryChoice === 'e' || secondaryChoice === 'e') {
    strengths.push("Self-preservation instinct", "Realistic assessment of risks", "Independent thinking");
    challenges.push(
      "Strong tendency toward cynicism and distrust of others", 
      "May sabotage opportunities due to fear of vulnerability",
      "Often creates self-fulfilling prophecies of failure or rejection"
    );
    growthAreas.push(
      "Developing balanced trust with appropriate boundaries", 
      "Distinguishing between legitimate caution and paralyzing fear",
      "Learning to take calculated risks for personal growth"
    );
    recommendations.push(
      "Practice small trust exercises with low-stakes situations", 
      "Keep a journal of times when trust yielded positive results",
      "Work with a therapist to explore the roots of distrust patterns"
    );
  }
  
  if (primaryChoice === 'f' || secondaryChoice === 'f') {
    strengths.push("Self-awareness", "Emotional depth", "Capacity for introspection");
    challenges.push(
      "Tendency toward rumination and dwelling on negative thoughts", 
      "May use self-criticism as a defense mechanism against external criticism",
      "Often struggles with making decisions due to fear of regret"
    );
    growthAreas.push(
      "Developing self-compassion and positive self-talk", 
      "Learning to distinguish between helpful reflection and unhelpful rumination",
      "Building confidence in your own judgment and decisions"
    );
    recommendations.push(
      "Practice time-limited reflection followed by intentional action", 
      "Use cognitive behavioral techniques to challenge negative thought patterns",
      "Create a 'decision framework' for yourself to reduce decision anxiety"
    );
  }
  
  return { strengths, challenges, growthAreas, recommendations };
};
