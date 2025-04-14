import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { corsHeaders } from "../_shared/cors.ts"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key");
}

const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { id, useMockData = false } = await req.json();
    
    console.log(`[get-comprehensive-analysis] Fetching analysis with ID: ${id}, useMockData: ${useMockData}`);

    if (!id) {
      throw new Error('Analysis ID is required');
    }

    let analysisData;
    
    // First try to get analysis with the direct ID using maybeSingle() instead of single()
    try {
      const { data: directResult, error: directError } = await supabaseClient
        .from('comprehensive_analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (directError) {
        console.error("[get-comprehensive-analysis] Error in direct query:", directError);
        throw new Error(`Query error: ${directError.message}`);
      }
      
      if (directResult) {
        console.log("[get-comprehensive-analysis] Successfully retrieved analysis via direct query");
        analysisData = directResult;
      } else {
        console.log("[get-comprehensive-analysis] No analysis found with direct query, trying assessment_id");
        
        // Try looking it up by assessment_id
        const { data: assessmentResult, error: assessmentError } = await supabaseClient
          .from('comprehensive_analyses')
          .select('*')
          .eq('assessment_id', id)
          .maybeSingle();
          
        if (assessmentError) {
          console.error("[get-comprehensive-analysis] Error in assessment_id query:", assessmentError);
          throw new Error(`Query error: ${assessmentError.message}`);
        }
        
        if (assessmentResult) {
          console.log("[get-comprehensive-analysis] Successfully retrieved analysis via assessment_id");
          analysisData = assessmentResult;
        } else {
          console.log("[get-comprehensive-analysis] No analysis found by assessment_id, trying recent analysis");
          
          // If all else fails, get the most recent analysis
          const { data: recentData, error: recentError } = await supabaseClient
            .from('comprehensive_analyses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (recentError) {
            console.error("[get-comprehensive-analysis] Error fetching recent analysis:", recentError);
            throw new Error("No analysis found and couldn't fetch recent analysis");
          }
          
          if (recentData) {
            console.log("[get-comprehensive-analysis] Using most recent analysis as fallback");
            analysisData = recentData;
          } else {
            throw new Error("No analyses found in database");
          }
        }
      }
    } catch (queryError) {
      console.error("[get-comprehensive-analysis] Query failed:", queryError);
      throw queryError;
    }
    
    // Process and format the analysis data for client use
    try {
      // If there's a result field containing the complete analysis, use it
      if (analysisData.result && typeof analysisData.result === 'object') {
        console.log("[get-comprehensive-analysis] Using result field from analysis");
        return new Response(
          JSON.stringify({
            ...analysisData.result,
            id: analysisData.id,
            message: id !== analysisData.id ? 
              `Requested analysis not found. Showing analysis from ${new Date(analysisData.created_at).toLocaleDateString()}` : 
              undefined
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Otherwise, build a response from the individual fields
      console.log("[get-comprehensive-analysis] Building comprehensive analysis from individual fields");
      const formattedAnalysis = {
        id: analysisData.id,
        createdAt: analysisData.created_at,
        overview: analysisData.overview || null,
        traits: analysisData.traits || null,
        intelligence: analysisData.intelligence || null,
        intelligenceScore: analysisData.intelligence_score || null,
        emotionalIntelligenceScore: analysisData.emotional_intelligence_score || null,
        valueSystem: analysisData.value_system || null,
        motivators: analysisData.motivators || null,
        inhibitors: analysisData.inhibitors || null, 
        weaknesses: analysisData.weaknesses || null,
        growthAreas: analysisData.growth_areas || null,
        relationshipPatterns: analysisData.relationship_patterns || null,
        careerSuggestions: analysisData.career_suggestions || null,
        learningPathways: analysisData.learning_pathways || null,
        roadmap: analysisData.roadmap || null,
        message: id !== analysisData.id ? 
          `Requested analysis not found. Showing analysis from ${new Date(analysisData.created_at).toLocaleDateString()}` : 
          undefined
      };
      
      // Fill in any missing fields only if explicitly in test mode with useMockData=true
      if (useMockData === true) {
        console.log("[get-comprehensive-analysis] Using mock data to fill in missing fields (test mode)");
        
        if (!formattedAnalysis.overview) formattedAnalysis.overview = generateEnhancedOverview();
        if (!formattedAnalysis.traits) formattedAnalysis.traits = generateEnhancedTraits();
        if (!formattedAnalysis.intelligence) formattedAnalysis.intelligence = generateEnhancedIntelligence();
        if (!formattedAnalysis.intelligenceScore) formattedAnalysis.intelligenceScore = 75;
        if (!formattedAnalysis.emotionalIntelligenceScore) formattedAnalysis.emotionalIntelligenceScore = 70;
        if (!formattedAnalysis.valueSystem) formattedAnalysis.valueSystem = ["Growth", "Connection", "Achievement", "Exploration", "Balance", "Integrity"];
        if (!formattedAnalysis.motivators) formattedAnalysis.motivators = generateEnhancedMotivators();
        if (!formattedAnalysis.inhibitors) formattedAnalysis.inhibitors = ["Self-doubt", "Perfectionism", "Fear of failure", "Decision paralysis", "Overthinking"];
        if (!formattedAnalysis.weaknesses) formattedAnalysis.weaknesses = ["May overthink decisions", "Could struggle with boundaries", "Occasional procrastination when faced with ambiguity", "Tendency to avoid necessary conflict", "Can be overly self-critical"];
        if (!formattedAnalysis.growthAreas) formattedAnalysis.growthAreas = generateEnhancedGrowthAreas();
        if (!formattedAnalysis.relationshipPatterns) formattedAnalysis.relationshipPatterns = generateEnhancedRelationshipPatterns();
        if (!formattedAnalysis.careerSuggestions) formattedAnalysis.careerSuggestions = ["Researcher", "Strategic Consultant", "Creative Director", "Educator", "Content Strategist", "Project Manager", "Human Resources Specialist"];
        if (!formattedAnalysis.learningPathways) formattedAnalysis.learningPathways = ["Self-directed exploration with structured feedback", "Practical application of theoretical concepts", "Collaborative learning environments", "Multimedia educational resources", "Project-based learning"];
        if (!formattedAnalysis.roadmap) formattedAnalysis.roadmap = generateEnhancedRoadmap();
        
        // Add message about test data
        formattedAnalysis.message = "This analysis contains test data. Some fields may be generated for demonstration purposes.";
      } else {
        // If any required fields are missing and we're NOT in test mode, report this
        const missingFields = [];
        if (!formattedAnalysis.overview) missingFields.push('overview');
        if (!formattedAnalysis.traits || !formattedAnalysis.traits.length) missingFields.push('traits');
        if (!formattedAnalysis.intelligence) missingFields.push('intelligence');
        
        if (missingFields.length > 0) {
          console.warn(`[get-comprehensive-analysis] Analysis missing key fields: ${missingFields.join(', ')}`);
          
          // Return error response instead of incomplete data
          return new Response(
            JSON.stringify({ 
              error: "Incomplete analysis data", 
              message: `Your analysis is still processing. Missing: ${missingFields.join(', ')}`,
              analysisId: analysisData.id,
              status: "processing"
            }),
            { 
              status: 202, // Accepted but processing
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }
      
      return new Response(
        JSON.stringify(formattedAnalysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (formatError) {
      console.error("[get-comprehensive-analysis] Error formatting analysis:", formatError);
      throw new Error(`Failed to format analysis data: ${formatError.message}`);
    }
    
  } catch (error) {
    console.error("[get-comprehensive-analysis] Error:", error);
    
    // Return error response - NOT mock data
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve analysis",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        status: "error"
      }),
      { 
        status: 404,  // Not found
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Keep these helper functions, but make sure they are only used with useMockData=true
function generateEnhancedTraits() {
  return [
    {
      trait: "Analytical Thinking",
      score: 7.8,
      description: "You have a natural inclination to analyze situations carefully and consider multiple perspectives. This trait enables you to dissect complex problems into manageable components and identify patterns that others might miss.",
      strengths: ["Problem-solving abilities", "Critical thinking", "Attention to detail", "Systematic approach", "Evidence-based decision making"],
      challenges: ["May overthink simple situations", "Could get caught in analysis paralysis", "Occasional perfectionism"],
      growthSuggestions: [
        "Practice combining analysis with intuition", 
        "Set time limits for decisions to avoid overthinking", 
        "Establish frameworks for when different levels of analysis are appropriate",
        "Share your analytical process with others to gain perspective"
      ]
    },
    {
      trait: "Creativity",
      score: 7.2,
      description: "You possess a strong creative drive that enables you to think outside conventional boundaries. This manifests as an ability to generate novel ideas, make unexpected connections, and approach problems with innovative solutions.",
      strengths: ["Innovative problem-solving", "Original thinking", "Connecting disparate ideas", "Adaptability to new situations", "Appreciation for aesthetics"],
      challenges: ["May struggle with highly structured environments", "Sometimes generates too many ideas without implementation", "Can be resistant to conventional approaches even when they're optimal"],
      growthSuggestions: [
        "Develop frameworks to channel creative energy productively",
        "Partner with detail-oriented individuals on implementation",
        "Practice selecting and refining your best ideas",
        "Balance creative exploration with structured execution"
      ]
    },
    {
      trait: "Empathy",
      score: 8.1,
      description: "You possess a natural ability to understand and share the feelings of others. This deep emotional intelligence allows you to form meaningful connections, support others effectively, and navigate social situations with sensitivity and awareness.",
      strengths: ["Deep understanding of others' perspectives", "Strong active listening skills", "Ability to build rapport quickly", "Skilled at mediating conflicts", "Creating psychological safety"],
      challenges: ["Risk of taking on others' emotional burdens", "May prioritize others' needs over your own", "Can become emotionally drained in intense interpersonal situations"],
      growthSuggestions: [
        "Establish healthy emotional boundaries",
        "Practice self-care routines to prevent empathy fatigue",
        "Develop techniques to separate others' emotions from your own",
        "Use your empathic insights to guide effective action"
      ]
    },
    {
      trait: "Adaptability",
      score: 7.5,
      description: "You demonstrate remarkable flexibility when facing changing circumstances and new information. This trait enables you to pivot strategies, adjust expectations, and find opportunity in unexpected situations.",
      strengths: ["Comfort with ambiguity", "Resilience during change", "Learning agility", "Open-mindedness", "Resource optimization"],
      challenges: ["May sometimes appear inconsistent to others", "Could struggle with establishing routines", "Occasionally undervalues stability"],
      growthSuggestions: [
        "Develop core principles that remain constant amid change",
        "Communicate your adaptations clearly to others",
        "Practice balancing flexibility with consistency",
        "Reflect on patterns in your adaptations to develop wisdom"
      ]
    },
    {
      trait: "Conscientiousness",
      score: 6.9,
      description: "You exhibit a solid sense of responsibility and attention to commitments. This trait manifests as reliability, organizational skills, and follow-through on obligations, though there's room for strengthening systematic approaches.",
      strengths: ["Reliability", "Goal orientation", "Attention to quality", "Planning capabilities", "Ethical consistency"],
      challenges: ["Occasional procrastination with less engaging tasks", "Can be self-critical when standards aren't met", "Sometimes struggles with long-term consistency"],
      growthSuggestions: [
        "Develop structured systems for task management",
        "Break large commitments into smaller, trackable steps",
        "Practice self-compassion when facing challenges",
        "Connect detailed work to larger meaningful goals"
      ]
    }
  ];
}

function generateEnhancedIntelligence() {
  return {
    type: "Balanced Cognitive Profile",
    score: 7.5,
    description: "You demonstrate a well-balanced cognitive profile with particular strengths in analytical and creative thinking. Your intellectual approach combines systematic reasoning with innovative perspective-taking, allowing you to excel in both structured and unstructured problem domains.",
    domains: [
      {
        name: "Analytical Intelligence",
        score: 7.8,
        description: "Your ability to evaluate information critically and apply logical reasoning. You excel at identifying patterns, detecting inconsistencies, and constructing step-by-step solutions to complex problems."
      },
      {
        name: "Creative Intelligence",
        score: 7.3,
        description: "Your capacity for innovative thinking and generating original ideas. You demonstrate strengths in conceptual exploration, making novel connections between different domains, and developing unconventional approaches."
      },
      {
        name: "Emotional Intelligence",
        score: 7.9,
        description: "Your ability to recognize and manage emotions in yourself and others. This includes self-awareness, empathy, social skills, and emotion regulation, contributing to effective interpersonal functioning."
      },
      {
        name: "Practical Intelligence",
        score: 7.1,
        description: "Your capability to apply knowledge in real-world contexts and navigate everyday challenges. This involves adaptable problem-solving, resourcefulness, and translating abstract concepts into concrete actions."
      },
      {
        name: "Learning Agility",
        score: 7.6,
        description: "Your capacity to rapidly assimilate new information and develop competence in unfamiliar domains. This reflects your intellectual curiosity, mental flexibility, and effective learning strategies."
      }
    ]
  };
}

function generateEnhancedShadowAspects() {
  return [
    {
      trait: "Perfectionism",
      description: "Your drive for excellence can sometimes manifest as excessive perfectionism, leading to self-criticism and delayed action. While your high standards drive quality, they can become counterproductive when they prevent completion or cause unnecessary stress.",
      impactAreas: ["Decision making", "Self-acceptance", "Productivity", "Work-life balance", "Collaboration with others"],
      integrationSuggestions: [
        "Practice 'good enough' thinking for appropriate contexts", 
        "Set realistic standards based on importance and available resources",
        "Schedule specific time limits for refinement activities",
        "Develop awareness of when perfectionism is being triggered",
        "Celebrate progress alongside achievements"
      ]
    },
    {
      trait: "Avoidance Patterns",
      description: "A tendency to postpone challenging tasks or difficult conversations as a protective mechanism. This pattern often manifests as procrastination, overpreparation, or focusing on less important but more comfortable activities.",
      impactAreas: ["Project completion", "Relationship development", "Personal growth", "Decision making", "Stress management"],
      integrationSuggestions: [
        "Start with small steps toward difficult tasks", 
        "Practice purposeful discomfort in controlled situations",
        "Develop awareness of your specific avoidance triggers",
        "Create accountability structures for important challenges",
        "Reframe avoidance as information about areas for growth"
      ]
    },
    {
      trait: "People Pleasing",
      description: "Your natural empathy and desire for harmony can sometimes develop into excessive concern about others' approval, leading to difficulty setting boundaries and expressing your authentic needs and opinions.",
      impactAreas: ["Boundary setting", "Authentic self-expression", "Energy management", "Decision clarity", "Relationship depth"],
      integrationSuggestions: [
        "Practice small 'no' statements in lower-risk situations",
        "Develop scripts for setting boundaries compassionately",
        "Check in with your own needs before responding to requests",
        "Distinguish between empathy and responsibility for others' emotions",
        "Seek relationships that value authenticity over agreeableness"
      ]
    }
  ];
}

function generateEnhancedDetailedTraits() {
  return {
    primary: [
      {
        trait: "Strategic Thinking",
        score: 7.9,
        description: "You naturally consider long-term implications and connect immediate actions to broader goals. This enables you to create effective plans that anticipate obstacles and leverage opportunities in pursuit of meaningful outcomes.",
        strengths: ["Future planning", "Systems thinking", "Anticipating obstacles", "Resource optimization", "Connecting tactics to strategy"],
        challenges: ["May overcomplicate simple matters", "Could get lost in possibilities", "Occasional difficulty with immediate action"],
        growthSuggestions: [
          "Balance strategic vision with practical steps",
          "Practice communicating complex plans simply",
          "Establish criteria for when detailed planning is valuable",
          "Partner with action-oriented individuals",
          "Set regular reflection points to adjust strategies"
        ]
      },
      {
        trait: "Intellectual Curiosity",
        score: 8.2,
        description: "You exhibit a genuine love of learning and exploration of ideas that drives continuous personal development. This trait manifests as asking thoughtful questions, seeking diverse inputs, and finding connections across different domains of knowledge.",
        strengths: ["Continuous learning orientation", "Interdisciplinary thinking", "Question formulation", "Information synthesis", "Conceptual exploration"],
        challenges: ["May get distracted by tangential interests", "Sometimes pursues depth at expense of breadth", "Can prioritize interesting over practical"],
        growthSuggestions: [
          "Create structure for your learning explorations",
          "Connect curious investigations to practical applications",
          "Develop curation methods for information management",
          "Schedule both focused and exploratory learning time",
          "Share your insights to solidify understanding"
        ]
      },
      {
        trait: "Perceptiveness",
        score: 7.8,
        description: "You demonstrate keen observation skills and attention to subtle details in both social and intellectual contexts. This allows you to notice patterns, detect unspoken dynamics, and gather rich information that others might overlook.",
        strengths: ["Attention to detail", "Reading social cues", "Pattern recognition", "Environmental awareness", "Insightful observations"],
        challenges: ["Risk of information overload", "May overinterpret ambiguous situations", "Could struggle with selective attention"],
        growthSuggestions: [
          "Develop frameworks for organizing observations",
          "Practice distinguishing significant from interesting details",
          "Create reflection routines to process perceptions",
          "Balance observation with action",
          "Verify perceptions through thoughtful inquiry"
        ]
      }
    ],
    secondary: [
      {
        trait: "Adaptability",
        score: 7.4,
        description: "You demonstrate flexibility when facing changing circumstances and new information. This enables you to adjust approaches, incorporate feedback, and remain effective across various contexts and challenges.",
        strengths: ["Quick adjustment to change", "Learning from experience", "Comfort with ambiguity", "Resourcefulness", "Experimental mindset"],
        challenges: ["May sometimes resist structured environments", "Could appear inconsistent to others", "Occasionally lacks persistence with one approach"],
        growthSuggestions: [
          "Find balance between adaptability and stability",
          "Communicate your adaptations clearly to others",
          "Identify core principles that remain consistent amid change",
          "Reflect on patterns in your adaptations",
          "Distinguish between necessary flexibility and unnecessary change"
        ]
      },
      {
        trait: "Reflectiveness",
        score: 7.6,
        description: "You possess a natural inclination toward introspection and thoughtful consideration of experiences. This trait enables continuous learning, self-awareness, and increasingly wise decision-making based on accumulated insights.",
        strengths: ["Self-awareness", "Learning from experience", "Thoughtful decision-making", "Psychological insight", "Meaning-making"],
        challenges: ["Risk of overthinking", "May delay action for reflection", "Could become too self-focused"],
        growthSuggestions: [
          "Structure reflection time rather than continuous rumination",
          "Balance internal processing with external input",
          "Develop frameworks for efficient reflection",
          "Practice applying insights to future situations",
          "Share reflections with trusted others for perspective"
        ]
      },
      {
        trait: "Collaborative Spirit",
        score: 7.3,
        description: "You value working with others and can effectively contribute to collective efforts. This trait enables you to share leadership, incorporate diverse perspectives, and create outcomes better than what could be achieved individually.",
        strengths: ["Team orientation", "Perspective integration", "Shared credit", "Building on others' ideas", "Interpersonal diplomacy"],
        challenges: ["May sometimes defer too readily to group consensus", "Could struggle with solo decision-making", "Occasionally frustrated by inefficient group processes"],
        growthSuggestions: [
          "Practice both leading and following in collaborative settings",
          "Develop skills for contributing effectively to different team dynamics",
          "Balance collaboration with independent work",
          "Learn structured facilitation techniques",
          "Articulate your unique value in collaborative settings"
        ]
      }
    ]
  };
}

function generateEnhancedPersonalityArchetype() {
  return {
    name: "The Thoughtful Explorer",
    description: "You combine analytical depth with creative curiosity, approaching life's challenges with both systematic thinking and innovative exploration. Your balanced profile enables you to excel in both structured environments and open-ended creative contexts, making you adaptable across various life domains.",
    strengths: [
      "Integrating logic with imagination", 
      "Balancing big-picture vision with attention to detail", 
      "Adapting communication style to different audiences",
      "Finding meaning and patterns in complex information",
      "Bridging different perspectives and knowledge domains"
    ],
    challenges: [
      "May experience tension between creative exploration and structured completion",
      "Could struggle with prioritization given multiple interests",
      "Occasionally overwhelmed by possibilities in decision-making"
    ],
    growthPath: "Your developmental journey involves integrating your analytical strengths with intuitive insights, while building systematic approaches to channel your creative energy effectively. As you grow, you'll increasingly leverage your perceptiveness to anticipate needs and create innovative solutions within practical constraints."
  };
}

function generateEnhancedMotivators() {
  return [
    "Intellectual growth and continuous learning",
    "Creating meaningful connections with others",
    "Developing mastery in areas of interest",
    "Contributing value through your unique perspective",
    "Exploring new possibilities and experiences",
    "Achieving harmony between different life domains",
    "Making a positive difference in others' lives"
  ];
}

function generateEnhancedGrowthAreas() {
  return [
    "Developing decisive action in ambiguous situations",
    "Balancing analytical thoroughness with timely completion",
    "Setting clearer boundaries in personal and professional relationships",
    "Translating creative ideas into structured implementation",
    "Building consistent routines for long-term goals",
    "Embracing constructive conflict as necessary for growth",
    "Practicing selective focus amid multiple interests"
  ];
}

function generateEnhancedRelationshipPatterns() {
  return {
    strengths: [
      "Building authentic connections through empathetic listening",
      "Creating psychological safety in your relationships",
      "Thoughtful communication that considers others' perspectives",
      "Loyalty and commitment to important relationships",
      "Supporting others' growth and development"
    ],
    challenges: [
      "Setting and maintaining healthy boundaries",
      "Expressing needs directly rather than indirectly",
      "Managing relationship intensity for sustainable connections",
      "Navigating conflict productively rather than avoiding it",
      "Balancing independence with interdependence"
    ],
    compatibleTypes: [
      "Those who value authenticity and depth in relationships",
      "Partners who balance your reflectiveness with action orientation",
      "People who appreciate both intellectual and emotional connection",
      "Individuals with complementary communication styles",
      "Those who share core values while offering different perspectives"
    ]
  };
}

function generateEnhancedRoadmap() {
  return "Your growth journey begins with leveraging your natural analytical and creative strengths while developing more structured approaches to implementation. Focus on translating insights into action by establishing clear priorities and decision frameworks. Building regular reflection practices will help convert experiences into wisdom, while developing assertiveness skills will ensure your valuable perspectives are heard. For relationships, practice setting compassionate boundaries and engaging constructively with necessary conflict. Your professional development will benefit from finding contexts that value both your innovative thinking and your growing capability for focused execution. By balancing exploration with commitment, you'll create a life aligned with your values while making meaningful contributions in your chosen domains.";
}

function generateEnhancedOverview() {
  return "Your personality profile reveals a thoughtful, perceptive individual with a balanced blend of analytical and intuitive tendencies. You approach life with both careful consideration and creative exploration, allowing you to excel in situations requiring both systematic thinking and innovative problem-solving.\n\nYour intellectual curiosity drives continuous learning and development, while your empathetic nature enables meaningful connections with others. You demonstrate particular strengths in understanding complex systems, recognizing patterns, and generating creative solutions to multifaceted challenges.\n\nIn social contexts, you likely present as attentive and thoughtful, offering valuable insights while remaining open to others' perspectives. Your communication style tends toward depth rather than breadth, preferring meaningful exchanges over surface-level interaction.\n\nProfessionally, you thrive in environments that value both analytical rigor and creative thinking. You're likely to excel in roles that involve complex problem-solving, strategic planning, or translating between different domains of expertise.\n\nYour growth opportunities center around developing more structured approaches to implementation, setting clearer boundaries, and translating your rich inner world into consistent external action. By balancing your natural reflectiveness with decisive action, you'll more fully express your considerable potential.";
}

function generateEnhancedMockAnalysis() {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    overview: generateEnhancedOverview(),
    traits: generateEnhancedTraits(),
    intelligence: generateEnhancedIntelligence(),
    intelligenceScore: 75,
    emotionalIntelligenceScore: 72,
    cognitiveStyle: "Integrated Thinker",
    valueSystem: ["Growth", "Understanding", "Connection", "Integrity", "Creativity", "Balance", "Autonomy"],
    motivators: generateEnhancedMotivators(),
    inhibitors: ["Self-doubt", "Perfectionism", "Overthinking decisions", "Fear of missing out", "Avoidance of necessary conflict"],
    weaknesses: [
      "May overthink decisions at the expense of timely action", 
      "Could struggle with setting and maintaining clear boundaries", 
      "Occasional reluctance to take risks in ambiguous situations", 
      "Tendency to take on too many interests simultaneously",
      "Sometimes prioritizes possibility over practicality"
    ],
    growthAreas: generateEnhancedGrowthAreas(),
    relationshipPatterns: generateEnhancedRelationshipPatterns(),
    careerSuggestions: [
      "Strategic Consultant", 
      "Research Specialist", 
      "Content Strategist", 
      "User Experience Designer", 
      "Program Development", 
      "Learning Experience Designer",
      "Innovation Facilitator",
      "Complex Systems Analyst"
    ],
    learningPathways: [
      "Structured exploration with practical application", 
      "Collaborative learning with diverse perspectives", 
      "Self-directed research with expert guidance", 
      "Experiential learning through creative projects",
      "Cross-disciplinary study connecting multiple domains",
      "Reflective practice with mentorship support"
    ],
    roadmap: generateEnhancedRoadmap(),
    message: "This is an enhanced mock analysis. For a more accurate assessment, complete the comprehensive questionnaire.",
    shadowAspects: generateEnhancedShadowAspects(),
    detailedTraits: generateEnhancedDetailedTraits(),
    personalityArchetype: generateEnhancedPersonalityArchetype(),
    mindsetPatterns: {
      dominant: "Growth-oriented",
      description: "You approach challenges as opportunities for learning and development rather than as threats to your capabilities.",
      implications: [
        "You're likely to persist in the face of obstacles", 
        "You tend to embrace feedback as valuable information", 
        "You see effort as a path to mastery", 
        "You're inspired by the success of others rather than threatened by it"
      ]
    },
    emotionalProfile: {
      primaryEmotions: ["Curiosity", "Empathy", "Determination", "Occasional anxiety"],
      emotionalResponsiveness: 7.2,
      regulationStrategies: [
        "Cognitive reframing", 
        "Mindfulness practices", 
        "Creative expression", 
        "Social connection"
      ]
    },
    communicationStyle: {
      primary: "Thoughtful",
      secondary: "Collaborative",
      description: "You tend to process information thoroughly before responding and value input from multiple perspectives when making decisions.",
      effectiveChannels: [
        "One-on-one discussions", 
        "Small group collaboration", 
        "Written communication with time for reflection"
      ]
    }
  };
}
