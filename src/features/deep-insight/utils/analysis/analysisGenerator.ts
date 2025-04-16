import { DeepInsightResponses } from "../../types";
import { analyzeResponsePatterns } from "./patternAnalyzer";
import { determinePersonalityTraits } from "./personalityTraits";
import { generateStrengthsChallenges } from "./strengthsChallenges";
import { AnalysisData } from "./types";

// Main function to generate full analysis from responses
export function generateAnalysisFromResponses(responses: DeepInsightResponses): AnalysisData {
  // Get the response pattern analysis
  const responsePatterns = analyzeResponsePatterns(responses);
  
  // Get personality traits determination
  const traitsResult = determinePersonalityTraits(responses);
  
  // Get strengths and challenges
  const strengthsChallenges = generateStrengthsChallenges(responses);
  
  // Create the complete analysis object
  const analysis: AnalysisData = {
    // Build comprehensive personality analysis
    traits: generateTraits(responses, traitsResult),
    
    // Core identity elements
    primaryArchetype: traitsResult.primaryTrait,
    summary: generateSummary(traitsResult),
    
    // Response patterns
    responsePatterns: responsePatterns,
    
    // Core traits
    coreTraits: {
      primary: traitsResult.primaryTrait,
      secondary: getSecondaryTrait(traitsResult),
      strengths: strengthsChallenges.strengths,
      challenges: strengthsChallenges.challenges
    },
    
    // Cognitive patterns
    cognitivePatterning: {
      decisionMaking: traitsResult.decisionMakingStyle,
      learningStyle: traitsResult.learningStyle,
      attention: generateAttentionStyle(responses)
    },
    
    // Emotional architecture
    emotionalArchitecture: {
      emotionalAwareness: traitsResult.emotionalAwareness,
      regulationStyle: generateEmotionalRegulation(responses),
      empathicCapacity: generateEmpathicCapacity(responses)
    },
    
    // Interpersonal dynamics
    interpersonalDynamics: {
      attachmentStyle: generateAttachmentStyle(responses),
      communicationPattern: generateCommunicationPattern(responses, traitsResult),
      conflictResolution: generateConflictStyle(responses)
    },
    
    // Growth and development
    growthPotential: {
      developmentAreas: strengthsChallenges.growthAreas,
      recommendations: strengthsChallenges.recommendations
    },
    
    // Additional insights
    intelligenceType: getIntelligenceType(traitsResult),
    dominantTraits: generateDominantTraits(traitsResult),
    motivators: generateMotivators(responses),
    inhibitors: generateInhibitors(responses),
    careerSuggestions: generateCareerSuggestions(traitsResult, responsePatterns),
    relationshipPatterns: {
      attachmentStyle: generateAttachmentStyle(responses),
      compatibleTypes: generateCompatibleTypes(traitsResult)
    },
    learningPathways: generateLearningPathways(traitsResult)
  };
  
  return analysis;
}

// Helper function to generate a summary based on traits
function generateSummary(traits: PersonalityTraitsDetermination): string {
  const { primaryTrait, analyticalScore, emotionalScore } = traits;
  
  if (analyticalScore > emotionalScore) {
    return `You are primarily a ${primaryTrait} thinker who approaches life with analytical precision. You value logic and structure, and excel in environments that reward systematic thinking. Your decision-making tends to be methodical, weighing options carefully before proceeding.`;
  } else {
    return `You are primarily a ${primaryTrait} personality who navigates life with emotional intelligence. You're attuned to both your feelings and those of others, which gives you strong interpersonal skills. Your decision-making balances rational considerations with emotional wisdom.`;
  }
}

// Get secondary trait based on scores
function getSecondaryTrait(traits: PersonalityTraitsDetermination): string {
  const { primaryTrait, analyticalScore, emotionalScore, adaptabilityScore } = traits;
  
  // Determine secondary trait based on second highest score
  if (primaryTrait !== "Analytical" && analyticalScore > emotionalScore && analyticalScore > adaptabilityScore) {
    return "Analytical";
  } else if (primaryTrait !== "Emotional" && emotionalScore > analyticalScore && emotionalScore > adaptabilityScore) {
    return "Emotional";
  } else if (primaryTrait !== "Adaptive" && adaptabilityScore > analyticalScore && adaptabilityScore > emotionalScore) {
    return "Adaptive";
  } else {
    // Default secondary traits based on primary
    const secondaryTraits: Record<string, string> = {
      "Analytical": "Strategic",
      "Emotional": "Empathetic",
      "Adaptive": "Flexible",
      "Creative": "Innovative",
      "Practical": "Grounded"
    };
    
    return secondaryTraits[primaryTrait] || "Balanced";
  }
}

// Generate attention style based on responses
function generateAttentionStyle(responses: DeepInsightResponses): string {
  // Count responses that indicate different attention styles
  let focusedCount = 0;
  let broadCount = 0;
  let detailCount = 0;
  
  // Analyze specific questions related to attention
  Object.entries(responses).forEach(([id, response]) => {
    // Questions about focus and attention
    if (id.includes("focus") || id.includes("attention")) {
      if (response === "a" || response === "c") {
        focusedCount++;
      } else if (response === "b") {
        broadCount++;
      } else if (response === "d") {
        detailCount++;
      }
    }
  });
  
  // Determine predominant style
  if (focusedCount > broadCount && focusedCount > detailCount) {
    return "You have a sustained attention style, able to focus deeply on tasks for extended periods. You excel in environments that require concentration and can block out distractions effectively when engaged in meaningful work.";
  } else if (broadCount > focusedCount && broadCount > detailCount) {
    return "You have a broad, diffuse attention style that allows you to monitor multiple streams of information simultaneously. This gives you an advantage in dynamic environments where you need to track various elements, though you may sometimes find it challenging to maintain deep focus on a single task.";
  } else if (detailCount > focusedCount && detailCount > broadCount) {
    return "You have a detail-oriented attention style, noticing nuances and specifics that others might miss. This makes you excellent at quality control and precision work, though you may sometimes need to consciously zoom out to see the bigger picture.";
  } else {
    return "You have a flexible attention style that adapts based on context. You can shift between focused concentration and broader awareness depending on the situation, giving you versatility across different types of tasks and environments.";
  }
}

// Generate emotional regulation style
function generateEmotionalRegulation(responses: DeepInsightResponses): string {
  // Analyze responses related to emotional regulation
  let proactiveCount = 0;
  let reactiveCount = 0;
  let avoidantCount = 0;
  
  Object.entries(responses).forEach(([id, response]) => {
    if (id.includes("emotion") || id.includes("feel")) {
      if (response === "a" || response === "c") {
        proactiveCount++;
      } else if (response === "b") {
        reactiveCount++;
      } else if (response === "d") {
        avoidantCount++;
      }
    }
  });
  
  if (proactiveCount > reactiveCount && proactiveCount > avoidantCount) {
    return "You have a proactive regulation style, anticipating emotional responses and preparing for them. You're skilled at emotional self-management and can often prevent negative emotional spirals before they begin.";
  } else if (reactiveCount > proactiveCount && reactiveCount > avoidantCount) {
    return "You have an expressive regulation style, processing emotions as they arise and working through them actively. You're authentic in your emotional expression and use emotional feedback as important information for decision-making.";
  } else if (avoidantCount > proactiveCount && avoidantCount > reactiveCount) {
    return "You have a controlled regulation style, sometimes compartmentalizing emotions to deal with them at appropriate times. While this helps you maintain composure in challenging situations, you may benefit from creating more space to process feelings fully.";
  } else {
    return "You have an adaptive regulation style that changes based on context. You can be proactive, expressive, or controlled depending on what the situation calls for, giving you emotional versatility.";
  }
}

// Generate empathic capacity
function generateEmpathicCapacity(responses: DeepInsightResponses): string {
  // Count responses indicating empathy
  let empathyScore = 0;
  let totalEmpathyQuestions = 0;
  
  Object.entries(responses).forEach(([id, response]) => {
    if (id.includes("others") || id.includes("empathy") || id.includes("understand")) {
      totalEmpathyQuestions++;
      if (response === "b" || response === "d") {
        empathyScore++;
      }
    }
  });
  
  const empathyRatio = totalEmpathyQuestions > 0 ? empathyScore / totalEmpathyQuestions : 0.5;
  
  if (empathyRatio > 0.7) {
    return "You have highly developed empathic capacity, readily understanding others' emotional states and perspectives. This makes you an excellent listener and supporter, though you may need to ensure you don't absorb others' emotions at the expense of your own well-being.";
  } else if (empathyRatio > 0.4) {
    return "You have balanced empathic capacity, able to understand others' perspectives while maintaining appropriate emotional boundaries. You can connect with people authentically without becoming overwhelmed by their emotional states.";
  } else {
    return "You have a pragmatic approach to empathy, focusing more on practical solutions than emotional resonance. While you can understand others' perspectives intellectually, you may sometimes need to consciously tune into the emotional dimensions of situations.";
  }
}

// Generate attachment style
function generateAttachmentStyle(responses: DeepInsightResponses): string {
  // Analyze responses related to relationships
  let secureCount = 0;
  let anxiousCount = 0;
  let avoidantCount = 0;
  let totalRelationshipQuestions = 0;
  
  Object.entries(responses).forEach(([id, response]) => {
    if (id.includes("relationship") || id.includes("connect") || id.includes("trust")) {
      totalRelationshipQuestions++;
      if (response === "c") {
        secureCount++;
      } else if (response === "b") {
        anxiousCount++;
      } else if (response === "a" || response === "d") {
        avoidantCount++;
      }
    }
  });
  
  // Calculate percentages
  const securePercent = totalRelationshipQuestions > 0 ? (secureCount / totalRelationshipQuestions) * 100 : 33;
  const anxiousPercent = totalRelationshipQuestions > 0 ? (anxiousCount / totalRelationshipQuestions) * 100 : 33;
  const avoidantPercent = totalRelationshipQuestions > 0 ? (avoidantCount / totalRelationshipQuestions) * 100 : 33;
  
  // Determine predominant style
  if (securePercent > anxiousPercent && securePercent > avoidantPercent) {
    return "You demonstrate a predominantly secure attachment style, characterized by comfort with both intimacy and independence. You generally trust others, communicate openly about needs and concerns, and recover relatively quickly from relationship setbacks.";
  } else if (anxiousPercent > securePercent && anxiousPercent > avoidantPercent) {
    return "You show patterns consistent with an anxious attachment style, where you deeply value close relationships but may sometimes worry about their stability. You're attentive to emotional nuances and invest significantly in maintaining connections, though you may occasionally need reassurance.";
  } else if (avoidantPercent > securePercent && avoidantPercent > anxiousPercent) {
    return "Your responses suggest an independent attachment style, where you value self-sufficiency and personal space. While you can form meaningful connections, you're comfortable with autonomy and may need time to process emotions privately before sharing them with others.";
  } else {
    return "You display a flexible attachment style that adapts based on relationship context. You can move between connection and independence as needed, though you may lean slightly more toward one pattern in times of stress.";
  }
}

// Generate communication pattern
function generateCommunicationPattern(responses: DeepInsightResponses, traits: PersonalityTraitsDetermination): string {
  const { analyticalScore, emotionalScore } = traits;
  
  // Analyze communication-related responses
  let directCount = 0;
  let expressiveCount = 0;
  let reflectiveCount = 0;
  let totalCommunicationQuestions = 0;
  
  Object.entries(responses).forEach(([id, response]) => {
    if (id.includes("communicate") || id.includes("express") || id.includes("talk")) {
      totalCommunicationQuestions++;
      if (response === "a" || response === "c") {
        directCount++;
      } else if (response === "b") {
        expressiveCount++;
      } else if (response === "d") {
        reflectiveCount++;
      }
    }
  });
  
  // Combine with personality traits
  if (analyticalScore > emotionalScore && directCount > expressiveCount) {
    return "You have a precise, direct communication style focused on clarity and efficiency. You value getting to the point and sharing information accurately, which makes you effective in professional contexts and problem-solving discussions.";
  } else if (emotionalScore > analyticalScore && expressiveCount > directCount) {
    return "You have an expressive, narrative communication style that conveys both information and emotional context. You're skilled at creating connection through communication and can articulate feelings and experiences in ways that resonate with others.";
  } else if (reflectiveCount > directCount && reflectiveCount > expressiveCount) {
    return "You have a thoughtful, measured communication style where you consider your words carefully before speaking. You're a good listener who processes information thoroughly, though you may sometimes need time before responding to complex topics.";
  } else {
    return "You have an adaptable communication style that shifts based on context. You can be direct when clarity is needed, expressive when connection is important, and reflective when dealing with complex topics, giving you versatility across different situations.";
  }
}

// Generate conflict resolution style
function generateConflictStyle(responses: DeepInsightResponses): string {
  // Analyze conflict-related responses
  let collaborativeCount = 0;
  let accommodatingCount = 0;
  let avoidantCount = 0;
  let competitiveCount = 0;
  let totalConflictQuestions = 0;
  
  Object.entries(responses).forEach(([id, response]) => {
    if (id.includes("conflict") || id.includes("disagree") || id.includes("problem")) {
      totalConflictQuestions++;
      if (response === "c") {
        collaborativeCount++;
      } else if (response === "b") {
        accommodatingCount++;
      } else if (response === "d") {
        avoidantCount++;
      } else if (response === "a") {
        competitiveCount++;
      }
    }
  });
  
  // Determine predominant style
  if (collaborativeCount > accommodatingCount && collaborativeCount > avoidantCount && collaborativeCount > competitiveCount) {
    return "You approach conflict with a collaborative mindset, seeking solutions that address everyone's core concerns. You're willing to engage directly with disagreements while maintaining respect for different perspectives, which helps you build stronger relationships through conflict resolution.";
  } else if (accommodatingCount > collaborativeCount && accommodatingCount > avoidantCount && accommodatingCount > competitiveCount) {
    return "You tend to prioritize harmony in conflict situations, often accommodating others' needs to maintain positive relationships. While this helps preserve connections, you may sometimes benefit from more directly expressing your own needs and boundaries.";
  } else if (avoidantCount > collaborativeCount && avoidantCount > accommodatingCount && avoidantCount > competitiveCount) {
    return "You often prefer to step back from conflicts to gain perspective before engaging, which gives you time to process emotions and consider solutions. While this thoughtful approach has advantages, directly addressing issues promptly can sometimes prevent them from growing larger.";
  } else if (competitiveCount > collaborativeCount && competitiveCount > accommodatingCount && competitiveCount > avoidantCount) {
    return "You approach conflict with confidence and clarity about your position. You're comfortable advocating for your perspective and can be persuasive in making your case. Balancing this strength with active listening can help you reach more integrative solutions.";
  } else {
    return "You have a flexible conflict resolution style that adapts based on the situation and relationships involved. You can collaborate, accommodate, step back, or advocate firmly depending on what the context requires, giving you versatility in handling different types of disagreements.";
  }
}

// Generate intelligence type
function getIntelligenceType(traits: PersonalityTraitsDetermination): string {
  const { primaryTrait, analyticalScore, emotionalScore, adaptabilityScore } = traits;
  
  if (analyticalScore > emotionalScore && analyticalScore > adaptabilityScore) {
    return "Logical-Analytical";
  } else if (emotionalScore > analyticalScore && emotionalScore > adaptabilityScore) {
    return "Emotional-Social";
  } else if (adaptabilityScore > analyticalScore && adaptabilityScore > emotionalScore) {
    return "Practical-Adaptive";
  } else if (primaryTrait === "Creative") {
    return "Creative-Conceptual";
  } else {
    return "Integrated";
  }
}

// Generate dominant traits
function generateDominantTraits(traits: PersonalityTraitsDetermination): string[] {
  const { primaryTrait, analyticalScore, emotionalScore, adaptabilityScore } = traits;
  
  const traitMap: Record<string, string[]> = {
    "Analytical": ["Logical", "Systematic", "Precise", "Objective", "Detail-oriented"],
    "Emotional": ["Empathetic", "Intuitive", "Expressive", "Relationship-oriented", "Perceptive"],
    "Adaptive": ["Flexible", "Resilient", "Pragmatic", "Resourceful", "Open-minded"],
    "Creative": ["Innovative", "Original", "Imaginative", "Conceptual", "Artistic"],
    "Practical": ["Reliable", "Structured", "Efficient", "Methodical", "Results-oriented"]
  };
  
  // Start with primary trait characteristics
  let dominantTraits = [...(traitMap[primaryTrait] || [])];
  
  // Add secondary characteristics based on scores
  if (analyticalScore > 7 && primaryTrait !== "Analytical") {
    dominantTraits.push("Logical", "Systematic");
  }
  
  if (emotionalScore > 7 && primaryTrait !== "Emotional") {
    dominantTraits.push("Empathetic", "Intuitive");
  }
  
  if (adaptabilityScore > 7 && primaryTrait !== "Adaptive") {
    dominantTraits.push("Flexible", "Resilient");
  }
  
  // Ensure we don't have duplicates and limit to 7 traits
  return [...new Set(dominantTraits)].slice(0, 7);
}

// Generate motivators based on responses
function generateMotivators(responses: DeepInsightResponses): string[] {
  const motivatorMap: Record<string, string[]> = {
    "a": ["Achievement", "Mastery", "Excellence", "Recognition", "Influence"],
    "b": ["Connection", "Harmony", "Making a difference", "Authenticity", "Belonging"],
    "c": ["Security", "Stability", "Practical results", "Efficiency", "Structure"],
    "d": ["Growth", "Discovery", "Innovation", "Freedom", "Creativity"]
  };
  
  // Count response frequencies
  const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
  Object.values(responses).forEach(response => {
    if (response in counts) {
      counts[response]++;
    }
  });
  
  // Sort responses by frequency
  const sortedResponses = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Collect motivators based on most frequent responses
  let motivators: string[] = [];
  sortedResponses.forEach(response => {
    if (response in motivatorMap) {
      motivators = [...motivators, ...motivatorMap[response]];
    }
  });
  
  // Return unique motivators, limited to 8
  return [...new Set(motivators)].slice(0, 8);
}

// Generate inhibitors based on responses
function generateInhibitors(responses: DeepInsightResponses): string[] {
  // Map response patterns to potential inhibitors
  const inhibitorMap: Record<string, string[]> = {
    "a": ["Perfectionism", "Overanalyzing", "Difficulty delegating", "Impatience with inefficiency"],
    "b": ["Taking criticism personally", "Avoiding necessary conflict", "Emotional exhaustion", "Difficulty with boundaries"],
    "c": ["Resistance to change", "Risk aversion", "Overlooking long-term possibilities", "Inflexibility"],
    "d": ["Difficulty with follow-through", "Scattered focus", "Impracticality", "Overlooking details"]
  };
  
  // Count response frequencies
  const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
  Object.values(responses).forEach(response => {
    if (response in counts) {
      counts[response]++;
    }
  });
  
  // Sort responses by frequency
  const sortedResponses = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Collect inhibitors based on most frequent responses
  let inhibitors: string[] = [];
  sortedResponses.forEach(response => {
    if (response in inhibitorMap) {
      inhibitors = [...inhibitors, ...inhibitorMap[response]];
    }
  });
  
  // Return unique inhibitors, limited to 6
  return [...new Set(inhibitors)].slice(0, 6);
}

// Generate career suggestions
function generateCareerSuggestions(traits: PersonalityTraitsDetermination, patterns: ResponsePatternAnalysis): string[] {
  const { primaryTrait, analyticalScore, emotionalScore, adaptabilityScore } = traits;
  const { primaryChoice } = patterns;
  
  // Career maps based on primary trait
  const careerMap: Record<string, string[]> = {
    "Analytical": [
      "Data Scientist", "Systems Analyst", "Research Scientist", 
      "Financial Analyst", "Software Engineer", "Management Consultant",
      "Economist", "Biomedical Engineer", "Legal Analyst"
    ],
    "Emotional": [
      "Psychologist", "Human Resources Specialist", "Counselor", 
      "Social Worker", "Marketing Strategist", "Healthcare Provider",
      "Teacher", "Organizational Development Consultant", "Mediator"
    ],
    "Adaptive": [
      "Project Manager", "Entrepreneur", "Business Development", 
      "Consultant", "Product Manager", "Emergency Response",
      "Sales Executive", "Operations Manager", "Diplomat"
    ],
    "Creative": [
      "UX Designer", "Content Strategist", "Art Director", 
      "Product Designer", "Creative Director", "Architect",
      "Marketing Creative", "Innovation Consultant", "Game Designer"
    ],
    "Practical": [
      "Engineering Manager", "Financial Planner", "Operations Director", 
      "Quality Assurance Specialist", "Healthcare Administrator", "Logistics Manager",
      "Construction Manager", "Manufacturing Supervisor", "Compliance Officer"
    ]
  };
  
  // Start with careers from primary trait
  let careers = [...(careerMap[primaryTrait] || [])];
  
  // Add careers based on response patterns
  if (primaryChoice === "a" && analyticalScore > 6) {
    careers.push("Strategic Consultant", "Research Director", "Policy Analyst");
  } else if (primaryChoice === "b" && emotionalScore > 6) {
    careers.push("Leadership Coach", "Public Relations Specialist", "Customer Experience Manager");
  } else if (primaryChoice === "c" && adaptabilityScore > 6) {
    careers.push("Change Management Consultant", "Crisis Manager", "International Business Developer");
  } else if (primaryChoice === "d") {
    careers.push("Innovation Strategist", "Creative Consultant", "Design Thinking Facilitator");
  }
  
  // Ensure we don't have duplicates and limit to 9 careers
  return [...new Set(careers)].slice(0, 9);
}

// Generate compatible personality types
function generateCompatibleTypes(traits: PersonalityTraitsDetermination): string[] {
  const { primaryTrait } = traits;
  
  // Map of compatible types
  const compatibilityMap: Record<string, string[]> = {
    "Analytical": [
      "Creative types who bring fresh perspectives",
      "Practical types who help implement ideas",
      "Other analytical types who enjoy deep discussion"
    ],
    "Emotional": [
      "Analytical types who provide structure and clarity",
      "Other emotional types who understand emotional needs",
      "Adaptive types who navigate change with sensitivity"
    ],
    "Adaptive": [
      "Stable, practical types who provide grounding",
      "Creative types who inspire new approaches",
      "Analytical types who help evaluate options systematically"
    ],
    "Creative": [
      "Practical types who help bring ideas to life",
      "Analytical types who help refine concepts",
      "Other creative types who inspire and collaborate"
    ],
    "Practical": [
      "Creative types who bring fresh perspectives",
      "Emotional types who add depth to relationships",
      "Other practical types who share similar values"
    ]
  };
  
  return compatibilityMap[primaryTrait] || [
    "Those who complement your strengths",
    "Those who share your core values",
    "Those who communicate in compatible ways"
  ];
}

// Generate learning pathways
function generateLearningPathways(traits: PersonalityTraitsDetermination): string[] {
  const { primaryTrait, learningStyle } = traits;
  
  // Base pathways on primary trait
  const basePathways: Record<string, string[]> = {
    "Analytical": [
      "Structured courses with clear learning objectives",
      "Research-based independent study",
      "Systematic skill development programs"
    ],
    "Emotional": [
      "Interactive workshops with group discussion",
      "Mentorship and coaching relationships",
      "Learning experiences with emotional engagement"
    ],
    "Adaptive": [
      "Flexible learning formats that can adapt to changing needs",
      "Project-based learning with real-world applications",
      "Diverse learning experiences across multiple domains"
    ],
    "Creative": [
      "Exploratory learning with room for experimentation",
      "Interdisciplinary programs that connect diverse fields",
      "Self-directed projects with creative components"
    ],
    "Practical": [
      "Applied learning with clear practical outcomes",
      "Skill-based training with immediate application",
      "Structured programs with measurable results"
    ]
  };
  
  // Add pathways based on learning style
  let additionalPathways: string[] = [];
  if (learningStyle.includes("visual")) {
    additionalPathways.push("Visual learning formats with diagrams, charts and videos");
  } else if (learningStyle.includes("hands-on")) {
    additionalPathways.push("Experiential learning through direct practice and application");
  } else if (learningStyle.includes("auditory")) {
    additionalPathways.push("Audio-based learning through lectures, discussions and podcasts");
  } else {
    additionalPathways.push("Mixed-media learning that engages multiple senses");
  }
  
  // Combine and return unique pathways
  return [...(basePathways[primaryTrait] || []), ...additionalPathways];
}

// Generate traits based on responses and personality determination
function generateTraits(responses: DeepInsightResponses, traits: PersonalityTraitsDetermination): any[] {
  const { primaryTrait, analyticalScore, emotionalScore, adaptabilityScore } = traits;
  
  // Base traits that everyone gets assessed on
  const baseTraits = [
    {
      trait: "Analytical Thinking",
      score: analyticalScore,
      description: "Ability to break down complex problems and think logically"
    },
    {
      trait: "Emotional Intelligence",
      score: emotionalScore,
      description: "Capacity to understand and manage emotions effectively"
    },
    {
      trait: "Adaptability",
      score: adaptabilityScore,
      description: "Flexibility in responding to changing circumstances"
    }
  ];
  
  // Additional traits based on response patterns
  const additionalTraits = [];
  
  // Count response frequencies
  const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
  Object.values(responses).forEach(response => {
    if (response in counts) {
      counts[response]++;
    }
  });
  
  // Calculate total responses
  const totalResponses = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  // Calculate percentages
  const percentages = {
    a: totalResponses > 0 ? (counts.a / totalResponses) * 10 : 0,
    b: totalResponses > 0 ? (counts.b / totalResponses) * 10 : 0,
    c: totalResponses > 0 ? (counts.c / totalResponses) * 10 : 0,
    d: totalResponses > 0 ? (counts.d / totalResponses) * 10 : 0
  };
  
  // Add traits based on response patterns
  if (percentages.a > 3) {
    additionalTraits.push({
      trait: "Systematic",
      score: percentages.a,
      description: "Preference for organized, methodical approaches"
    });
  }
  
  if (percentages.b > 3) {
    additionalTraits.push({
      trait: "Empathetic",
      score: percentages.b,
      description: "Ability to understand others' perspectives and feelings"
    });
  }
  
  if (percentages.c > 3) {
    additionalTraits.push({
      trait: "Practical",
      score: percentages.c,
      description: "Focus on realistic, implementable solutions"
    });
  }
  
  if (percentages.d > 3) {
    additionalTraits.push({
      trait: "Creative",
      score: percentages.d,
      description: "Capacity for original thinking and novel approaches"
    });
  }
  
  // Add traits specific to primary personality type
  const typeSpecificTraits: Record<string, any[]> = {
    "Analytical": [
      {
        trait: "Detail Orientation",
        score: 7 + Math.random() * 3,
        description: "Attention to specifics and precision"
      },
      {
        trait: "Critical Thinking",
        score: 7 + Math.random() * 3,
        description: "Ability to evaluate information objectively"
      }
    ],
    "Emotional": [
      {
        trait: "Social Awareness",
        score: 7 + Math.random() * 3,
        description: "Understanding of social dynamics and relationships"
      },
      {
        trait: "Emotional Expression",
        score: 7 + Math.random() * 3,
        description: "Ability to communicate feelings effectively"
      }
    ],
    "Adaptive": [
      {
        trait: "Resilience",
        score: 7 + Math.random() * 3,
        description: "Capacity to recover from setbacks"
      },
      {
        trait: "Versatility",
        score: 7 + Math.random() * 3,
        description: "Ability to function well in diverse situations"
      }
    ],
    "Creative": [
      {
        trait: "Originality",
        score: 7 + Math.random() * 3,
        description: "Generation of novel ideas and approaches"
      },
      {
        trait: "Conceptual Thinking",
        score: 7 + Math.random() * 3,
        description: "Ability to work with abstract concepts and patterns"
      }
    ],
    "Practical": [
      {
        trait: "Reliability",
        score: 7 + Math.random() * 3,
        description: "Consistency in following through on commitments"
      },
      {
        trait: "Efficiency",
        score: 7 + Math.random() * 3,
        description: "Optimization of resources and processes"
      }
    ]
  };
  
  // Combine all traits
  const allTraits = [
    ...baseTraits,
    ...additionalTraits,
    ...(typeSpecificTraits[primaryTrait] || [])
  ];
  
  // Ensure scores are properly formatted (0-10 scale)
  return allTraits.map(trait => ({
    ...trait,
    score: Math.min(10, Math.max(0, Math.round(trait.score * 10) / 10))
  }));
}
