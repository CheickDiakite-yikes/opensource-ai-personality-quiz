
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Deep Insight Analysis function called");
    
    // Parse the request body to get the responses
    const { responses } = await req.json();
    
    if (!responses || Object.keys(responses).length === 0) {
      console.error("No responses provided in the request");
      return new Response(
        JSON.stringify({ 
          error: "No responses provided", 
          success: false 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Processing ${Object.keys(responses).length} responses`);
    
    // Generate analysis based on responses (using a simplified version for now)
    const analysis = generateAnalysisFromResponses(responses);
    
    console.log("Analysis generated successfully");
    
    return new Response(
      JSON.stringify({ 
        analysis, 
        success: true,
        message: "Analysis generated successfully" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in deep-insight-analysis function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        success: false,
        message: "Failed to generate analysis" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Analyze response patterns to generate percentages
function analyzeResponsePatterns(responses) {
  console.log("Analyzing response patterns");
  
  // Extract key insights to personalize the analysis
  const responsesArray = Object.entries(responses);
  
  // Count different answer choices to detect patterns
  const answerCounts = {
    a: 0,
    b: 0, 
    c: 0,
    d: 0,
    e: 0,
    f: 0
  };
  
  responsesArray.forEach(([_, answer]) => {
    const lastChar = answer.charAt(answer.length - 1);
    if (lastChar === 'a') answerCounts.a++;
    if (lastChar === 'b') answerCounts.b++;
    if (lastChar === 'c') answerCounts.c++;
    if (lastChar === 'd') answerCounts.d++;
    if (lastChar === 'e') answerCounts.e++;
    if (lastChar === 'f') answerCounts.f++;
  });
  
  const totalResponses = responsesArray.length;
  const percentages = {
    a: Math.round((answerCounts.a / totalResponses) * 100),
    b: Math.round((answerCounts.b / totalResponses) * 100),
    c: Math.round((answerCounts.c / totalResponses) * 100),
    d: Math.round((answerCounts.d / totalResponses) * 100),
    e: Math.round((answerCounts.e / totalResponses) * 100),
    f: Math.round((answerCounts.f / totalResponses) * 100)
  };
  
  // Generate a unique response signature
  const responseSignature = `${percentages.a}-${percentages.b}-${percentages.c}-${percentages.d}-${percentages.e}-${percentages.f}`;
  
  // Determine primary tendencies based on highest percentages
  const sortedChoices = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)
    .map(([choice]) => choice);
  
  const primaryChoice = sortedChoices[0];
  const secondaryChoice = sortedChoices[1];
  
  return {
    percentages,
    primaryChoice,
    secondaryChoice,
    responseSignature
  };
}

// The main analysis generator function
function generateAnalysisFromResponses(responses) {
  // Analyze response patterns
  const { 
    percentages, 
    primaryChoice, 
    secondaryChoice, 
    responseSignature 
  } = analyzeResponsePatterns(responses);
  
  // Determine personality traits
  const { 
    primaryTrait, 
    analyticalScore, 
    emotionalScore, 
    adaptabilityScore,
    decisionMakingStyle,
    learningStyle,
    emotionalAwareness
  } = determinePersonalityTraits(primaryChoice);
  
  // Get secondary trait
  const secondaryTrait = determineSecondaryTrait(secondaryChoice);
  
  // Generate strengths and challenges
  const { 
    strengths, 
    challenges, 
    growthAreas, 
    recommendations 
  } = generateStrengthsAndChallenges(primaryChoice, secondaryChoice);
  
  // Create metadata
  const uniqueId = `analysis-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  
  // Generate final analysis
  return {
    id: uniqueId,
    createdAt: now,
    overview: `Based on your unique response pattern (${responseSignature}), you appear to be primarily a ${primaryTrait} with strong ${secondaryTrait} tendencies. Your responses reveal a thoughtful approach to various situations, with particular strengths in ${strengths.slice(0, 2).join(" and ")}. You demonstrate a balanced combination of analytical thinking, emotional awareness, and adaptability, with your strongest dimension being your ${primaryChoice === 'a' ? 'analytical capabilities' : primaryChoice === 'b' ? 'emotional intelligence' : primaryChoice === 'c' ? 'adaptability' : 'creative vision'}.`,
    traits: [
      {
        trait: "Analytical Thinking",
        score: analyticalScore,
        description: "Your analytical abilities help you understand complex situations and make reasoned decisions.",
        strengths: ["Methodical problem-solving", "Critical evaluation", "Pattern recognition"],
        challenges: ["May sometimes overthink decisions", "Could benefit from trusting intuition more"],
        growthSuggestions: ["Balance analysis with action", "Incorporate more intuitive approaches"]
      },
      {
        trait: "Emotional Intelligence",
        score: emotionalScore,
        description: "Your emotional awareness influences how you understand yourself and connect with others.",
        strengths: ["Self-awareness", "Empathy", "Relationship management"],
        challenges: ["Balancing emotional needs with practical considerations"],
        growthSuggestions: ["Practice mindfulness to deepen emotional awareness", "Seek feedback on interpersonal interactions"]
      },
      {
        trait: "Adaptability",
        score: adaptabilityScore,
        description: "Your flexibility in handling change and new situations is a key part of your approach to life.",
        strengths: ["Willingness to adjust when necessary", "Resilience when facing obstacles"],
        challenges: ["May need time to fully embrace major changes"],
        growthSuggestions: ["Intentionally seek new experiences", "Practice reframing challenges as opportunities"]
      }
    ],
    intelligence: {
      type: "Integrated",
      score: (analyticalScore + emotionalScore) / 2,
      description: "You exhibit balanced capabilities across analytical, emotional, and practical domains.",
      domains: [
        { name: "Logical-Mathematical", score: analyticalScore, description: "Your analytical and systematic thinking abilities." },
        { name: "Interpersonal", score: emotionalScore, description: "Your understanding of others' motivations and feelings." },
        { name: "Adaptability", score: adaptabilityScore, description: "Your ability to adjust to new situations and information." }
      ]
    },
    intelligenceScore: Math.round((analyticalScore + emotionalScore + adaptabilityScore) / 3),
    emotionalIntelligenceScore: Math.round(emotionalScore),
    cognitiveStyle: {
      primary: primaryTrait,
      secondary: secondaryTrait,
      description: `Your thinking style combines elements of ${primaryTrait.toLowerCase()} approaches with ${secondaryTrait.toLowerCase()} tendencies, creating a unique cognitive profile.`
    },
    valueSystem: {
      strengths: ["Integrity", "Growth", "Connection", "Understanding"],
      challenges: ["Balancing competing priorities", "Recognizing when values conflict"],
      compatibleTypes: ["Growth-oriented individuals", "People with complementary strengths"]
    },
    motivators: ["Personal growth", "Meaningful achievement", "Understanding complex systems", "Authentic connection"],
    inhibitors: ["Self-doubt", "Perfectionism", "Fear of making wrong choices"],
    weaknesses: ["May struggle with ambiguity", "Sometimes hesitant to take risks", "Occasional perfectionism"],
    growthAreas: growthAreas,
    relationshipPatterns: {
      strengths: ["Good listening skills", "Thoughtfulness", "Depth of connection"],
      challenges: ["May withhold feelings to maintain harmony", "Could be more assertive about needs"],
      compatibleTypes: ["Open communicators", "Growth-oriented individuals", "Those who appreciate depth"]
    },
    careerSuggestions: ["Strategic advisor", "Research specialist", "Program developer", "Systems analyst", "Consultant", "Educator"],
    learningPathways: ["Structured courses with practical applications", "Collaborative learning environments", "Self-directed deep dives"],
    roadmap: "Focus on leveraging your natural strengths while developing in areas that will complement your core tendencies. Consider engaging in activities that challenge your comfort zone in small, progressive steps.",
    coreTraits: {
      primary: primaryTrait,
      secondary: secondaryTrait,
      strengths: strengths,
      challenges: challenges
    },
    cognitivePatterning: {
      decisionMaking: decisionMakingStyle,
      learningStyle: learningStyle,
      attention: "Your attention is most focused when dealing with content that aligns with your values and interests. Your response pattern suggests you can maintain strong focus when engaged with meaningful material."
    },
    emotionalArchitecture: {
      emotionalAwareness: emotionalAwareness,
      regulationStyle: "You tend to process emotions through a combination of reflection and discussion. This balanced approach helps you manage emotional experiences effectively in most situations.",
      empathicCapacity: "You demonstrate good empathy for others, particularly those whose experiences you can relate to. You're able to perspective-take while maintaining appropriate emotional boundaries."
    },
    interpersonalDynamics: {
      attachmentStyle: "Your attachment style shows a balanced approach to relationships, valuing both connection and independence.",
      communicationPattern: "You communicate thoughtfully and prefer depth over small talk. You listen well and generally express your thoughts clearly.",
      conflictResolution: "Your approach to conflict emphasizes finding common ground while addressing issues directly but tactfully."
    },
    growthPotential: {
      developmentAreas: growthAreas,
      recommendations: recommendations
    },
    responsePatterns: {
      percentages: percentages,
      primaryChoice: primaryChoice,
      secondaryChoice: secondaryChoice,
      responseSignature: responseSignature
    }
  };
}

// Function to determine personality traits based on response patterns
function determinePersonalityTraits(primaryChoice) {
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
}

// Function to determine secondary trait based on response pattern
function determineSecondaryTrait(secondaryChoice) {
  switch(secondaryChoice) {
    case 'a': return "Systematic Thinker";
    case 'b': return "Relationship Focused";
    case 'c': return "Pragmatic Adapter";
    case 'd': return "Creative Explorer";
    case 'e': return "Principled Leader";
    case 'f': return "Detailed Organizer";
    default: return "Balanced Thinker";
  }
}

// Function to generate strengths based on response patterns
function generateStrengthsAndChallenges(
  primaryChoice, 
  secondaryChoice
) {
  const strengths = [];
  const challenges = [];
  const growthAreas = [];
  const recommendations = [];
  
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
  
  if (primaryChoice === 'e' || secondaryChoice === 'e') {
    strengths.push("Principled leadership", "Ethical decision-making", "Consistent values");
    challenges.push("May be perceived as inflexible", "Could struggle with pragmatic compromises");
    growthAreas.push("Finding balance between ideals and practicality", "Embracing necessary change");
    recommendations.push("Practice flexible thinking exercises", "Explore diverse perspectives");
  }
  
  if (primaryChoice === 'f' || secondaryChoice === 'f') {
    strengths.push("Attention to detail", "Organizational skills", "Thoroughness");
    challenges.push("May get caught in perfectionism", "Could lose sight of big picture");
    growthAreas.push("Developing higher-level strategic thinking", "Learning when good enough is sufficient");
    recommendations.push("Set time limits for detailed work", "Regularly step back to review larger goals");
  }
  
  return { strengths, challenges, growthAreas, recommendations };
}
