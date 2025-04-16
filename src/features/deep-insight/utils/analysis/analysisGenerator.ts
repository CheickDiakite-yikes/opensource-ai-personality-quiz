import { DeepInsightResponses } from "../../types";
import { PersonalityAnalysis } from "@/utils/types";
import { analyzeResponsePatterns } from "./patternAnalyzer";
import { determinePersonalityTraits } from "./personalityTraits";
import { generateStrengthsAndChallenges } from "./strengthsChallenges";
import { AnalysisData, ResponsePatternAnalysis } from "./types";

/**
 * Main function to generate a complete analysis from assessment responses
 */
export const generateAnalysisFromResponses = (responses: DeepInsightResponses): AnalysisData => {
  console.log("Starting analysis generation from responses");
  
  // Analyze response patterns
  const responsePatterns = analyzeResponsePatterns(responses);
  
  // Determine personality traits
  const traitsAnalysis = determinePersonalityTraits(responsePatterns.primaryChoice, responsePatterns.secondaryChoice);
  
  // Generate strengths and challenges
  const strengthsChallenges = generateStrengthsAndChallenges(responsePatterns.primaryChoice, responsePatterns.secondaryChoice);
  
  // Create the analysis object
  const analysis: AnalysisData = {
    id: generateUniqueId(),
    createdAt: new Date().toISOString(),
    overview: generateOverview(traitsAnalysis.primaryTrait, responsePatterns),
    
    // Core traits
    coreTraits: {
      primary: traitsAnalysis.primaryTrait,
      secondary: determineSupportingTrait(traitsAnalysis),
      strengths: strengthsChallenges.strengths,
      challenges: strengthsChallenges.challenges
    },
    
    // Traits data
    traits: generateTraits(traitsAnalysis, responsePatterns),
    
    // Intelligence data
    intelligence: {
      type: determineIntelligenceType(traitsAnalysis),
      score: traitsAnalysis.analyticalScore * 10,
      description: generateIntelligenceDescription(traitsAnalysis),
      domains: generateIntelligenceDomains(traitsAnalysis)
    },
    
    // Intelligence scores
    intelligenceScore: Math.round(traitsAnalysis.analyticalScore * 10),
    emotionalIntelligenceScore: Math.round(traitsAnalysis.emotionalScore * 10),
    
    // Cognitive style
    cognitiveStyle: {
      primary: determineCognitiveStyleName(traitsAnalysis),
      secondary: determineSecondaryCognitiveStyle(traitsAnalysis),
      description: generateCognitiveStyleDescription(traitsAnalysis)
    },
    
    // Cognitive patterning
    cognitivePatterning: {
      decisionMaking: traitsAnalysis.decisionMakingStyle,
      learningStyle: traitsAnalysis.learningStyle,
      attention: generateAttentionPattern(traitsAnalysis, responsePatterns)
    },
    
    // Emotional architecture
    emotionalArchitecture: {
      emotionalAwareness: traitsAnalysis.emotionalAwareness,
      regulationStyle: generateEmotionalRegulationStyle(traitsAnalysis),
      empathicCapacity: generateEmpathicCapacity(traitsAnalysis)
    },
    
    // Interpersonal dynamics
    interpersonalDynamics: {
      attachmentStyle: generateAttachmentStyle(traitsAnalysis),
      communicationPattern: generateCommunicationPattern(traitsAnalysis),
      conflictResolution: generateConflictResolutionStyle(traitsAnalysis)
    },
    
    // Value system
    valueSystem: generateValueSystem(traitsAnalysis),
    
    // Motivators and inhibitors
    motivators: generateMotivators(traitsAnalysis, responsePatterns),
    inhibitors: generateInhibitors(traitsAnalysis, responsePatterns),
    
    // Growth areas
    weaknesses: strengthsChallenges.challenges.slice(0, 3),
    growthAreas: strengthsChallenges.growthAreas,
    
    // Relationship patterns
    relationshipPatterns: {
      strengths: generateRelationshipStrengths(traitsAnalysis),
      challenges: generateRelationshipChallenges(traitsAnalysis),
      compatibleTypes: generateCompatibleTypes(traitsAnalysis)
    },
    
    // Career and learning
    careerSuggestions: generateCareerSuggestions(traitsAnalysis),
    learningPathways: generateLearningPathways(traitsAnalysis),
    
    // Roadmap
    roadmap: generateGrowthRoadmap(traitsAnalysis),
    
    // Growth potential
    growthPotential: {
      developmentAreas: strengthsChallenges.growthAreas,
      recommendations: strengthsChallenges.recommendations
    },
    
    // Include the response patterns in the analysis
    responsePatterns
  };
  
  console.log("Analysis generation complete");
  return analysis;
};

// Generate a unique ID for the analysis
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Generate an overview based on primary trait and response patterns
const generateOverview = (primaryTrait: string, responsePatterns: ResponsePatternAnalysis): string => {
  let overview = `Based on your responses, you exhibit a strong ${primaryTrait} trait. `;
  
  if (responsePatterns.primaryChoice === 'a') {
    overview += "You tend to approach situations with a logical and analytical mindset.";
  } else if (responsePatterns.primaryChoice === 'b') {
    overview += "You prioritize emotional connections and empathy in your interactions.";
  } else if (responsePatterns.primaryChoice === 'c') {
    overview += "You are adaptable and focus on practical solutions to challenges.";
  } else {
    overview += "You demonstrate creativity and innovative thinking in your approach.";
  }
  
  return overview;
};

// Determine a supporting trait based on trait analysis
const determineSupportingTrait = (traitsAnalysis: any): string => {
  const { analyticalScore, emotionalScore, adaptabilityScore } = traitsAnalysis;
  
  if (emotionalScore > analyticalScore && emotionalScore > adaptabilityScore) {
    return "Emotional Intelligence";
  } else if (adaptabilityScore > analyticalScore && adaptabilityScore > emotionalScore) {
    return "Adaptability";
  } else {
    return "Analytical Thinking";
  }
};

// Generate traits data
const generateTraits = (traitsAnalysis: any, responsePatterns: ResponsePatternAnalysis) => {
  const traits = [
    {
      trait: traitsAnalysis.primaryTrait,
      score: traitsAnalysis.analyticalScore,
      description: "A measure of your analytical and problem-solving abilities.",
      strengths: ["Logical reasoning", "Critical thinking", "Problem decomposition"],
      challenges: ["Overthinking", "Analysis paralysis", "Ignoring intuition"],
      growthSuggestions: ["Trust your gut", "Balance logic with emotion", "Embrace uncertainty"]
    },
    {
      trait: "Emotional Intelligence",
      score: traitsAnalysis.emotionalScore,
      description: "Reflects your capacity to understand and manage emotions.",
      strengths: ["Empathy", "Social awareness", "Relationship management"],
      challenges: ["Oversensitivity", "Emotional reactivity", "Difficulty with conflict"],
      growthSuggestions: ["Set boundaries", "Practice self-care", "Develop assertiveness"]
    },
    {
      trait: "Adaptability",
      score: traitsAnalysis.adaptabilityScore,
      description: "Indicates your ability to adjust and thrive in changing environments.",
      strengths: ["Flexibility", "Resourcefulness", "Open-mindedness"],
      challenges: ["Impulsivity", "Lack of planning", "Difficulty with routine"],
      growthSuggestions: ["Plan ahead", "Reflect on experiences", "Embrace structure"]
    }
  ];
  
  return traits;
};

// Determine intelligence type
const determineIntelligenceType = (traitsAnalysis: any) => {
  if (traitsAnalysis.analyticalScore > traitsAnalysis.emotionalScore) {
    return "Analytical Intelligence";
  } else {
    return "Emotional Intelligence";
  }
};

// Generate intelligence description
const generateIntelligenceDescription = (traitsAnalysis: any): string => {
  return `Your intelligence is characterized by a strong focus on ${determineIntelligenceType(traitsAnalysis)}.`;
};

// Generate intelligence domains
const generateIntelligenceDomains = (traitsAnalysis: any) => {
  return [
    {
      name: "Logical Reasoning",
      score: traitsAnalysis.analyticalScore,
      description: "Your ability to draw logical conclusions from information."
    },
    {
      name: "Emotional Perception",
      score: traitsAnalysis.emotionalScore,
      description: "Your skill in recognizing and interpreting emotions in yourself and others."
    }
  ];
};

// Determine cognitive style name
const determineCognitiveStyleName = (traitsAnalysis: any): string => {
  if (traitsAnalysis.decisionMakingStyle.includes("Intuitive")) {
    return "Intuitive Thinker";
  } else {
    return "Analytical Thinker";
  }
};

// Determine secondary cognitive style
const determineSecondaryCognitiveStyle = (traitsAnalysis: any): string => {
  if (traitsAnalysis.learningStyle.includes("Visual")) {
    return "Visual Learner";
  } else {
    return "Auditory Learner";
  }
};

// Generate cognitive style description
const generateCognitiveStyleDescription = (traitsAnalysis: any): string => {
  return `You have an ${determineCognitiveStyleName(traitsAnalysis)} style, which means you prefer to process information in a ${determineSecondaryCognitiveStyle(traitsAnalysis)} manner.`;
};

// Generate attention pattern
const generateAttentionPattern = (traitsAnalysis: any, responsePatterns: ResponsePatternAnalysis): string => {
  if (responsePatterns.primaryChoice === 'a') {
    return "You have a focused attention pattern, preferring to concentrate on one task at a time.";
  } else {
    return "You have a flexible attention pattern, able to switch between tasks as needed.";
  }
};

// Generate emotional regulation style
const generateEmotionalRegulationStyle = (traitsAnalysis: any): string => {
  if (traitsAnalysis.emotionalAwareness.includes("High")) {
    return "You have a balanced emotional regulation style, able to manage your emotions effectively.";
  } else {
    return "You have a developing emotional regulation style, and may benefit from practicing emotional management techniques.";
  }
};

// Generate empathic capacity
const generateEmpathicCapacity = (traitsAnalysis: any): string => {
  if (traitsAnalysis.emotionalScore > 7) {
    return "You have a high empathic capacity, able to understand and share the feelings of others.";
  } else {
    return "You have a moderate empathic capacity, and can improve your ability to connect with others emotionally.";
  }
};

// Generate attachment style
const generateAttachmentStyle = (traitsAnalysis: any): string => {
  if (traitsAnalysis.adaptabilityScore > 7) {
    return "You have a secure attachment style, comfortable with intimacy and independence.";
  } else {
    return "You have an anxious attachment style, seeking reassurance and validation from others.";
  }
};

// Generate communication pattern
const generateCommunicationPattern = (traitsAnalysis: any): string => {
  if (traitsAnalysis.decisionMakingStyle.includes("Collaborative")) {
    return "You have a collaborative communication pattern, valuing input from others.";
  } else {
    return "You have a direct communication pattern, preferring to express your thoughts and feelings clearly.";
  }
};

// Generate conflict resolution style
const generateConflictResolutionStyle = (traitsAnalysis: any): string => {
  if (traitsAnalysis.emotionalScore > 7) {
    return "You have a compassionate conflict resolution style, seeking to understand and address the needs of all parties.";
  } else {
    return "You have a assertive conflict resolution style, standing up for your beliefs and needs.";
  }
};

// Generate value system
const generateValueSystem = (traitsAnalysis: any) => {
  return ["Integrity", "Compassion", "Innovation"];
};

// Generate motivators
const generateMotivators = (traitsAnalysis: any, responsePatterns: ResponsePatternAnalysis): string[] => {
  const motivators = ["Recognition", "Achievement", "Personal Growth"];
  
  if (responsePatterns.primaryChoice === 'd') {
    motivators.push("Creative Expression");
  }
  
  return motivators;
};

// Generate inhibitors
const generateInhibitors = (traitsAnalysis: any, responsePatterns: ResponsePatternAnalysis): string[] => {
  const inhibitors = ["Criticism", "Routine", "Lack of Autonomy"];
  
  if (responsePatterns.primaryChoice === 'a') {
    inhibitors.push("Ambiguity");
  }
  
  return inhibitors;
};

// Generate relationship strengths
const generateRelationshipStrengths = (traitsAnalysis: any): string[] => {
  return ["Empathy", "Communication", "Support"];
};

// Generate relationship challenges
const generateRelationshipChallenges = (traitsAnalysis: any): string[] => {
  return ["Conflict Avoidance", "Emotional Reactivity", "Boundary Setting"];
};

// Generate compatible types
const generateCompatibleTypes = (traitsAnalysis: any): string[] => {
  return ["Analytical", "Creative", "Emotional"];
};

// Generate career suggestions
const generateCareerSuggestions = (traitsAnalysis: any): string[] => {
  return ["Data Scientist", "Therapist", "Entrepreneur"];
};

// Generate learning pathways
const generateLearningPathways = (traitsAnalysis: any): string[] => {
  return ["Online Courses", "Mentorship", "Workshops"];
};

// Generate growth roadmap
const generateGrowthRoadmap = (traitsAnalysis: any): string => {
  return "Focus on developing your emotional intelligence and communication skills to enhance your relationships and career.";
};
