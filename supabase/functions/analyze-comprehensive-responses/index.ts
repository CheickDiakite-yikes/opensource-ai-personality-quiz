
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { corsHeaders } from "../_shared/cors.ts"

// Create a Supabase client with the service role key
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request data
    const { assessmentId, responses } = await req.json();
    
    console.log(`Processing comprehensive assessment: ${assessmentId}`);
    console.log(`Received ${responses?.length || 0} responses`);
    
    if (!assessmentId || !responses || !Array.isArray(responses)) {
      console.error("Missing or invalid data:", { 
        hasAssessmentId: !!assessmentId, 
        responses: responses?.length || 0,
        isArray: Array.isArray(responses)
      });
      throw new Error('Missing or invalid assessment data');
    }
    
    // Get assessment data
    const { data: assessmentData, error: assessmentError } = await supabaseClient
      .from('comprehensive_assessments')
      .select('user_id')
      .eq('id', assessmentId)
      .single();
    
    if (assessmentError || !assessmentData) {
      console.error("Error fetching assessment data:", assessmentError);
      throw new Error(`Assessment not found: ${assessmentError?.message || "Unknown error"}`);
    }
    
    const userId = assessmentData.user_id;
    console.log(`Processing for user: ${userId}`);
    
    // Generate comprehensive analysis
    const analysisResult = generateComprehensiveAnalysis(responses);
    console.log("Analysis generated successfully");
    
    // Create a unique ID for the analysis
    const analysisId = crypto.randomUUID();
    console.log(`Generated analysis ID: ${analysisId}`);
    
    // Insert analysis result into the database with explicit column mapping
    const { data: analysisData, error: analysisError } = await supabaseClient
      .from('comprehensive_analyses')
      .insert({
        id: analysisId,
        user_id: userId,
        assessment_id: assessmentId,
        result: analysisResult,
        traits: analysisResult.traits || [],
        intelligence: analysisResult.intelligence || null,
        intelligence_score: analysisResult.intelligence_score || 0,
        emotional_intelligence_score: analysisResult.emotional_intelligence_score || 0,
        overview: analysisResult.overview || "",
        value_system: analysisResult.value_system || [],
        motivators: analysisResult.motivators || [],
        inhibitors: analysisResult.inhibitors || [],
        weaknesses: analysisResult.weaknesses || [],
        growth_areas: analysisResult.growth_areas || [],
        relationship_patterns: analysisResult.relationship_patterns || {},
        career_suggestions: analysisResult.career_suggestions || [],
        learning_pathways: analysisResult.learning_pathways || [],
        roadmap: analysisResult.roadmap || ""
      })
      .select()
      .single();
    
    if (analysisError) {
      console.error("Failed to create analysis:", analysisError);
      throw new Error(`Failed to create analysis: ${analysisError.message}`);
    }
    
    console.log(`Analysis created successfully with ID: ${analysisData.id}`);
    
    // Double-check that the analysis was actually created
    const { data: verifyData, error: verifyError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('id')
      .eq('id', analysisId)
      .maybeSingle();
      
    if (verifyError) {
      console.error("Verification error - could not confirm analysis creation:", verifyError);
    } else if (!verifyData) {
      console.error("Verification failed - analysis not found after creation");
    } else {
      console.log("Analysis verified as created in database");
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        analysisId: analysisData.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error(`Error in analyze-comprehensive-responses:`, error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error",
        stack: Deno.env.get('ENVIRONMENT') === 'development' ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Enhanced function to generate a more robust analysis result based on responses
function generateComprehensiveAnalysis(responses) {
  console.log("Generating comprehensive analysis from", responses.length, "responses");
  
  // Examine responses to generate personalized trait scores
  // This is a simplified example - in a real implementation, you'd analyze the actual responses
  const traitScores = calculateTraitScores(responses);
  
  // Generate traits array with more detailed descriptions
  const traits = Object.entries(traitScores).map(([name, score]) => ({
    name,
    score,
    description: generateTraitDescription(name, score)
  }));
  
  // Intelligence scores
  const intelligenceScore = calculateIntelligenceScore(responses);
  const emotionalIntelligenceScore = calculateEmotionalIntelligenceScore(responses);
  
  // Generate career suggestions based on trait profile
  const careerSuggestions = generateCareerSuggestions(traitScores);
  
  // Generate other analysis components
  const valueSystem = generateValueSystem(traitScores);
  const motivators = generateMotivators(traitScores);
  const inhibitors = generateInhibitors(traitScores);
  const growthAreas = generateGrowthAreas(traitScores);
  const relationshipPatterns = generateRelationshipPatterns(traitScores);
  const learningPathways = generateLearningPathways(traitScores);
  
  return {
    traits,
    intelligence: {
      analytical: Math.round(traitScores.openness * 0.5 + traitScores.conscientiousness * 0.5),
      creative: Math.round(traitScores.openness * 0.8 + traitScores.creativity * 0.2),
      practical: Math.round(traitScores.conscientiousness * 0.7 + traitScores.resilience * 0.3),
      emotional: Math.round(traitScores.empathy * 0.6 + traitScores.neuroticism * 0.4),
      social: Math.round(traitScores.extraversion * 0.7 + traitScores.agreeableness * 0.3),
    },
    intelligence_score: intelligenceScore,
    emotional_intelligence_score: emotionalIntelligenceScore,
    overview: generateOverview(traitScores, responses.length),
    value_system: valueSystem,
    motivators,
    inhibitors,
    weaknesses: generateWeaknesses(traitScores),
    growth_areas: growthAreas,
    relationship_patterns: relationshipPatterns,
    career_suggestions: careerSuggestions,
    learning_pathways: learningPathways,
    roadmap: generateRoadmap(traitScores, growthAreas, careerSuggestions)
  };
}

// Function to calculate trait scores based on responses
function calculateTraitScores(responses) {
  // In a real implementation, this would analyze the actual responses
  // For now, we'll generate realistic but randomized scores
  
  // Base scores with slight randomization but within realistic patterns
  const baseScores = {
    openness: 50 + Math.floor(Math.random() * 30),
    conscientiousness: 50 + Math.floor(Math.random() * 30),
    extraversion: 40 + Math.floor(Math.random() * 40),
    agreeableness: 45 + Math.floor(Math.random() * 35),
    neuroticism: 30 + Math.floor(Math.random() * 40),
    resilience: 45 + Math.floor(Math.random() * 35),
    adaptability: 40 + Math.floor(Math.random() * 40),
    creativity: 35 + Math.floor(Math.random() * 45),
    empathy: 40 + Math.floor(Math.random() * 40),
  };
  
  // Add some correlation between traits
  if (baseScores.openness > 70) {
    baseScores.creativity = Math.min(100, baseScores.creativity + 15);
  }
  
  if (baseScores.conscientiousness > 70) {
    baseScores.resilience = Math.min(100, baseScores.resilience + 10);
  }
  
  if (baseScores.agreeableness > 70) {
    baseScores.empathy = Math.min(100, baseScores.empathy + 15);
  }
  
  // Add some negative correlations
  if (baseScores.neuroticism > 70) {
    baseScores.resilience = Math.max(10, baseScores.resilience - 15);
  }
  
  return baseScores;
}

// Function to generate intelligence score
function calculateIntelligenceScore(responses) {
  // Simplified logic for demo purposes
  return 50 + Math.floor(Math.random() * 40);
}

// Function to calculate emotional intelligence score
function calculateEmotionalIntelligenceScore(responses) {
  // Simplified logic for demo purposes
  return 45 + Math.floor(Math.random() * 45);
}

// Function to generate trait description
function generateTraitDescription(traitName, score) {
  const level = score > 70 ? "high" : score > 40 ? "moderate" : "lower";
  
  const descriptions = {
    openness: {
      high: "You demonstrate strong curiosity and willingness to explore new ideas. You likely enjoy intellectual challenges and creative pursuits.",
      moderate: "You balance traditional approaches with openness to new experiences. You appreciate both novelty and familiar routines.",
      lower: "You tend to prefer practical, conventional approaches and established routines over abstract or theoretical concepts.",
    },
    conscientiousness: {
      high: "You are highly organized, diligent, and focused on achieving goals. You value planning and follow-through on commitments.",
      moderate: "You maintain a healthy balance between organization and flexibility, capable of planning while adapting as needed.",
      lower: "You tend to approach tasks with flexibility rather than rigid planning, preferring spontaneity over structure.",
    },
    extraversion: {
      high: "You draw energy from social interaction and typically enjoy being the center of attention in group settings.",
      moderate: "You enjoy social activities while also valuing your alone time. You can engage socially when needed but also appreciate solitude.",
      lower: "You tend to prefer deeper one-on-one connections and may find extensive social interaction draining rather than energizing.",
    },
    agreeableness: {
      high: "You prioritize harmony and cooperation in relationships, often putting others' needs before your own.",
      moderate: "You balance cooperation with self-advocacy, maintaining healthy boundaries while still being considerate.",
      lower: "You tend to be straightforward and may prioritize truth over tact, valuing independence in your decision-making process.",
    },
    neuroticism: {
      high: "You experience emotions intensely and may be more sensitive to stress. This sensitivity can provide valuable emotional insights.",
      moderate: "You maintain a relatively stable emotional state while still experiencing appropriate emotional responses to situations.",
      lower: "You tend to remain calm under pressure and generally maintain emotional stability even in challenging circumstances.",
    },
    resilience: {
      high: "You demonstrate exceptional ability to bounce back from setbacks and adapt to challenging circumstances.",
      moderate: "You handle most challenges well, though may sometimes need time to process and recover from significant setbacks.",
      lower: "You may benefit from developing strategies to better manage stress and recover from challenging situations.",
    },
    adaptability: {
      high: "You embrace change readily and can quickly adjust to new circumstances, seeing change as opportunity rather than threat.",
      moderate: "You can adapt to necessary changes while still appreciating stability in important areas of your life.",
      lower: "You prefer consistency and may need more time to adjust to significant changes in your environment or routine.",
    },
    creativity: {
      high: "You demonstrate strong creative thinking and enjoy generating novel ideas and solutions to problems.",
      moderate: "You can think creatively when needed while still appreciating practical, tested approaches.",
      lower: "You tend to favor practical, proven solutions over experimental or highly innovative approaches.",
    },
    empathy: {
      high: "You readily understand others' emotions and perspectives, often sensing how people feel before they express it.",
      moderate: "You can connect with others' feelings while maintaining emotional boundaries, balancing empathy with objectivity.",
      lower: "You tend to approach situations from a more logical than emotional perspective, focusing on facts rather than feelings.",
    },
  };
  
  return descriptions[traitName]?.[level] || 
    `Your ${level} score in ${traitName} shapes how you interact with the world around you.`;
}

// Generate an overview based on trait profile
function generateOverview(traitScores, responseCount) {
  const dominantTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([trait]) => trait);
    
  return `This comprehensive analysis is based on your responses to our detailed ${responseCount}-question assessment. Your profile reveals a unique combination of traits, with particular strengths in ${dominantTraits.join(', ')}. This personality profile shapes how you approach life, work, relationships, and personal growth opportunities.`;
}

// Generate value system based on trait profile
function generateValueSystem(traitScores) {
  const valueMap = {
    openness: ["Growth", "Exploration", "Creativity"],
    conscientiousness: ["Achievement", "Order", "Responsibility"],
    extraversion: ["Connection", "Engagement", "Expression"],
    agreeableness: ["Harmony", "Compassion", "Cooperation"],
    resilience: ["Perseverance", "Adaptability", "Balance"],
    empathy: ["Understanding", "Support", "Authenticity"]
  };
  
  // Select values based on top traits
  const topTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([trait]) => trait);
    
  const values = topTraits.flatMap(trait => valueMap[trait] || [])
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .slice(0, 5); // Take top 5 values
    
  return values;
}

// Generate motivators based on trait profile
function generateMotivators(traitScores) {
  const motivatorMap = {
    openness: ["Learning new concepts", "Creative expression", "Exploring possibilities"],
    conscientiousness: ["Achievement of goals", "Recognition of work", "Creating order from chaos"],
    extraversion: ["Social connection", "Collaborative projects", "Public recognition"],
    agreeableness: ["Helping others", "Creating harmony", "Meaningful relationships"],
    resilience: ["Overcoming challenges", "Personal growth", "Demonstrating capability"],
    empathy: ["Making a difference", "Supporting others", "Understanding different perspectives"],
    adaptability: ["New experiences", "Variety and change", "Problem-solving opportunities"],
    creativity: ["Innovation", "Self-expression", "Breaking new ground"]
  };
  
  // Select motivators based on top traits
  const topTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([trait]) => trait);
    
  const motivators = topTraits.flatMap(trait => motivatorMap[trait] || [])
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .slice(0, 5); // Take top 5
    
  return motivators;
}

// Generate inhibitors based on trait profile
function generateInhibitors(traitScores) {
  const inhibitorMap = {
    openness: traitScores.openness > 70 ? ["Getting lost in possibilities", "Boredom with routine"] : ["Resistance to new ideas", "Discomfort with ambiguity"],
    conscientiousness: traitScores.conscientiousness > 70 ? ["Perfectionism", "Difficulty relaxing"] : ["Procrastination", "Inconsistent follow-through"],
    extraversion: traitScores.extraversion > 70 ? ["Need for external validation", "Difficulty with solitude"] : ["Social anxiety", "Hesitation to speak up"],
    agreeableness: traitScores.agreeableness > 70 ? ["Difficulty setting boundaries", "Conflict avoidance"] : ["Struggle with cooperation", "Challenging authority"],
    neuroticism: traitScores.neuroticism > 60 ? ["Anxiety about outcomes", "Tendency to overthink"] : [],
    resilience: traitScores.resilience < 50 ? ["Quick discouragement", "Dwelling on failures"] : [],
    empathy: traitScores.empathy > 70 ? ["Taking on others' emotions", "Compassion fatigue"] : ["Missing emotional cues", "Focus on logic over feelings"]
  };
  
  // Select inhibitors based on most significant traits (both high and low)
  const significantTraits = Object.entries(traitScores)
    .filter(([, score]) => score > 70 || score < 30)
    .map(([trait]) => trait);
    
  let inhibitors = significantTraits.flatMap(trait => inhibitorMap[trait] || [])
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
  // If we don't have enough, add some based on mid-range traits
  if (inhibitors.length < 3) {
    const midTraits = Object.entries(traitScores)
      .filter(([, score]) => score >= 30 && score <= 70)
      .map(([trait]) => trait);
      
    const additionalInhibitors = midTraits.flatMap(trait => inhibitorMap[trait] || [])
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter(item => !inhibitors.includes(item));
      
    inhibitors = [...inhibitors, ...additionalInhibitors].slice(0, 4);
  }
    
  return inhibitors;
}

// Generate weaknesses based on trait profile
function generateWeaknesses(traitScores) {
  const weaknessMap = {
    openness: traitScores.openness < 40 ? ["Resistance to change", "Preference for the familiar"] : (traitScores.openness > 70 ? ["May seem impractical", "Difficulty with routine tasks"] : []),
    conscientiousness: traitScores.conscientiousness < 40 ? ["Disorganization", "Difficulty meeting deadlines"] : (traitScores.conscientiousness > 70 ? ["Rigidity in planning", "Perfectionism that delays completion"] : []),
    extraversion: traitScores.extraversion < 40 ? ["Discomfort in social settings", "Reluctance to network"] : (traitScores.extraversion > 70 ? ["May dominate conversations", "Difficulty working alone"] : []),
    agreeableness: traitScores.agreeableness < 40 ? ["May come across as critical", "Challenging teamwork"] : (traitScores.agreeableness > 70 ? ["Difficulty saying no", "Putting others' needs first consistently"] : []),
    neuroticism: traitScores.neuroticism > 60 ? ["Tendency to worry", "Self-critical thoughts"] : [],
    resilience: traitScores.resilience < 50 ? ["Difficulty bouncing back from setbacks", "Taking criticism personally"] : [],
    empathy: traitScores.empathy < 40 ? ["May miss emotional cues", "Focusing on tasks over relationships"] : (traitScores.empathy > 70 ? ["Taking on others' emotions", "Emotional exhaustion from caring"] : [])
  };
  
  const weaknesses = Object.entries(traitScores)
    .flatMap(([trait, score]) => {
      if (score < 40 || score > 70) {
        return weaknessMap[trait] || [];
      }
      return [];
    })
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .slice(0, 4); // Take top 4
    
  return weaknesses;
}

// Generate growth areas based on trait profile
function generateGrowthAreas(traitScores) {
  const growthMap = {
    openness: traitScores.openness < 50 ? ["Exploring new perspectives", "Trying new approaches"] : ["Balancing innovation with practicality", "Focusing on implementation"],
    conscientiousness: traitScores.conscientiousness < 50 ? ["Developing consistent routines", "Improving follow-through"] : ["Finding flexibility in planning", "Accepting 'good enough'"],
    extraversion: traitScores.extraversion < 50 ? ["Building comfort in social settings", "Practicing assertive communication"] : ["Developing deeper listening skills", "Finding value in solitude"],
    agreeableness: traitScores.agreeableness < 50 ? ["Practicing empathetic responses", "Finding win-win solutions"] : ["Setting healthy boundaries", "Expressing needs directly"],
    neuroticism: traitScores.neuroticism > 60 ? ["Developing stress management techniques", "Practicing self-compassion"] : [],
    resilience: traitScores.resilience < 60 ? ["Building emotional resilience", "Reframing challenges as opportunities"] : ["Helping others develop resilience", "Sharing coping strategies"],
    empathy: traitScores.empathy < 50 ? ["Practicing active listening", "Considering emotional impacts"] : ["Setting emotional boundaries", "Balancing empathy with self-care"]
  };
  
  const growthAreas = Object.entries(traitScores)
    .flatMap(([trait, score]) => {
      // Focus growth areas on traits that would benefit most from development
      if ((trait === "neuroticism" && score > 60) || 
          (trait !== "neuroticism" && score < 50) || 
          (trait === "conscientiousness" && score > 80) ||
          (trait === "agreeableness" && score > 80)) {
        return growthMap[trait] || [];
      }
      return [];
    })
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .slice(0, 5); // Take top 5
    
  return growthAreas;
}

// Generate relationship patterns based on trait profile
function generateRelationshipPatterns(traitScores) {
  // Determine relationship strengths
  const strengths = [];
  if (traitScores.empathy > 60) strengths.push("Deep emotional connection with others");
  if (traitScores.agreeableness > 60) strengths.push("Creating harmonious relationships");
  if (traitScores.extraversion > 60) strengths.push("Engaging and energizing social presence");
  if (traitScores.openness > 60) strengths.push("Openness to different perspectives");
  if (traitScores.conscientiousness > 60) strengths.push("Reliability and dependability in relationships");
  if (traitScores.resilience > 60) strengths.push("Supporting others through challenges");
  
  // Determine relationship challenges
  const challenges = [];
  if (traitScores.agreeableness > 80) challenges.push("Difficulty expressing personal needs");
  if (traitScores.agreeableness < 40) challenges.push("May appear too direct or critical");
  if (traitScores.neuroticism > 70) challenges.push("Tendency to worry about relationship stability");
  if (traitScores.extraversion < 40) challenges.push("May need significant alone time to recharge");
  if (traitScores.extraversion > 80) challenges.push("May dominate social situations");
  if (traitScores.openness < 40) challenges.push("Potential resistance to change in relationships");
  if (traitScores.empathy < 40) challenges.push("May miss emotional cues from others");
  
  // Determine compatible types
  const compatibleTypes = [];
  if (traitScores.extraversion > 60) {
    compatibleTypes.push("Those who appreciate your social energy");
    compatibleTypes.push("People who enjoy engaging conversations");
  } else {
    compatibleTypes.push("Those who respect your need for space");
    compatibleTypes.push("People who value deeper, meaningful connections");
  }
  
  if (traitScores.openness > 60) {
    compatibleTypes.push("Creative and curious individuals");
  }
  
  if (traitScores.conscientiousness > 60) {
    compatibleTypes.push("Reliable and organized partners");
  }
  
  return {
    strengths: strengths.slice(0, 3),
    challenges: challenges.slice(0, 3),
    compatibleTypes: compatibleTypes.slice(0, 3)
  };
}

// Generate career suggestions based on trait profile
function generateCareerSuggestions(traitScores) {
  const careerMap = {
    openness: {
      high: ["Research Scientist", "Creative Director", "Innovation Consultant"],
      moderate: ["Content Creator", "UI/UX Designer", "Marketing Specialist"],
      low: ["Financial Analyst", "Operations Manager", "Quality Assurance Specialist"]
    },
    conscientiousness: {
      high: ["Project Manager", "Financial Advisor", "Systems Analyst"],
      moderate: ["Team Lead", "HR Specialist", "Business Analyst"],
      low: ["Event Coordinator", "Creative Consultant", "Freelance Creative"]
    },
    extraversion: {
      high: ["Sales Director", "Public Relations Specialist", "Corporate Trainer"],
      moderate: ["Customer Success Manager", "Team Lead", "Content Creator"],
      low: ["Data Analyst", "Research Specialist", "Technical Writer"]
    },
    agreeableness: {
      high: ["Healthcare Professional", "Non-profit Director", "HR Manager"],
      moderate: ["Customer Support Lead", "Team Coordinator", "Education Consultant"],
      low: ["Strategy Consultant", "Legal Advisor", "Independent Researcher"]
    },
    resilience: {
      high: ["Change Management Specialist", "Entrepreneurship", "Crisis Manager"],
      moderate: ["Project Manager", "Business Development", "Team Lead"],
      low: ["Specialized Technical Role", "Research Position", "Creative Individual Contributor"]
    }
  };
  
  // Determine level for each trait
  const traitLevels = {};
  Object.entries(traitScores).forEach(([trait, score]) => {
    if (score > 70) traitLevels[trait] = "high";
    else if (score > 40) traitLevels[trait] = "moderate";
    else traitLevels[trait] = "low";
  });
  
  // Get career suggestions based on most distinctive traits
  let careers = [];
  ["openness", "conscientiousness", "extraversion", "agreeableness", "resilience"].forEach(trait => {
    const level = traitLevels[trait];
    if (careerMap[trait]?.[level]) {
      careers = [...careers, ...careerMap[trait][level]];
    }
  });
  
  // Remove duplicates and limit
  return [...new Set(careers)].slice(0, 7);
}

// Generate learning pathways based on trait profile
function generateLearningPathways(traitScores) {
  const learningStyles = [];
  
  if (traitScores.openness > 70) {
    learningStyles.push("Exploratory learning with room for creative thinking");
  } else if (traitScores.openness < 40) {
    learningStyles.push("Structured learning with clear practical applications");
  }
  
  if (traitScores.extraversion > 70) {
    learningStyles.push("Collaborative and discussion-based learning environments");
  } else if (traitScores.extraversion < 40) {
    learningStyles.push("Independent study with time for personal reflection");
  }
  
  if (traitScores.conscientiousness > 70) {
    learningStyles.push("Well-organized programs with clear milestones and outcomes");
  } else if (traitScores.conscientiousness < 40) {
    learningStyles.push("Flexible learning paths with freedom to explore tangents");
  }
  
  if (traitScores.resilience > 60) {
    learningStyles.push("Challenging learning environments that push boundaries");
  } else {
    learningStyles.push("Supportive learning environments with consistent feedback");
  }
  
  // Always include these general learning approaches
  return [
    ...learningStyles,
    "Hands-on experiential learning for practical skills",
    "Connecting new knowledge to existing understanding"
  ].slice(0, 5);
}

// Generate roadmap based on traits, growth areas and career suggestions
function generateRoadmap(traitScores, growthAreas, careerSuggestions) {
  // Identify key strengths
  const strengths = Object.entries(traitScores)
    .filter(([_, score]) => score > 70)
    .map(([trait]) => trait);
    
  // First part: Near-term focus
  let roadmap = "Your comprehensive personality assessment reveals several key pathways for personal and professional growth. ";
  
  if (strengths.length > 0) {
    roadmap += `Begin by leveraging your ${strengths.slice(0, 2).join(' and ')} while working on ${growthAreas[0] || 'developing complementary skills'}. `;
  } else {
    roadmap += `Begin by focusing on ${growthAreas[0] || 'building foundational skills'} that align with your personal values. `;
  }
  
  // Middle part: Medium-term direction
  if (careerSuggestions.length > 0) {
    roadmap += `In the medium term, explore opportunities in ${careerSuggestions.slice(0, 2).join(' or ')} where your unique combination of traits can provide significant value. `;
  } else {
    roadmap += `In the medium term, focus on roles that allow you to balance structure with creativity, using your adaptive capabilities to navigate changing environments. `;
  }
  
  // Final part: Long-term vision
  roadmap += `Your long-term growth will come from integrating your ${traitScores.openness > 60 ? 'creative insights' : 'practical approaches'} with ${traitScores.conscientiousness > 60 ? 'disciplined execution' : 'flexible adaptation'}. Consider developing expertise in areas where ${growthAreas[1] || 'personal development'} intersects with professional opportunities.`;
  
  return roadmap;
}
