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
    const { id } = await req.json();
    
    console.log(`[get-comprehensive-analysis] Fetching analysis with ID: ${id}`);

    if (!id) {
      throw new Error('Analysis ID is required');
    }

    let analysisData;
    
    // First try to get analysis with the direct ID
    try {
      const { data: directResult, error: directError } = await supabaseClient
        .rpc('get_comprehensive_analysis_by_id', { analysis_id: id });
        
      if (directError) {
        console.error("[get-comprehensive-analysis] Error fetching with RPC:", directError);
        throw new Error(`Database function error: ${directError.message}`);
      }
      
      if (directResult && Object.keys(directResult).length > 0) {
        console.log("[get-comprehensive-analysis] Successfully retrieved analysis via RPC");
        analysisData = directResult;
      } else {
        console.log("[get-comprehensive-analysis] No analysis found with RPC, trying direct query");
        throw new Error("Analysis not found via RPC");
      }
    } catch (rpcError) {
      console.warn("[get-comprehensive-analysis] RPC approach failed:", rpcError.message);
      
      // Fall back to direct query
      try {
        const { data: queryResult, error: queryError } = await supabaseClient
          .from('comprehensive_analyses')
          .select('*')
          .eq('id', id)
          .single();
          
        if (queryError) {
          console.error("[get-comprehensive-analysis] Error in direct query:", queryError);
          throw new Error(`Query error: ${queryError.message}`);
        }
        
        if (queryResult) {
          console.log("[get-comprehensive-analysis] Successfully retrieved analysis via direct query");
          analysisData = queryResult;
        } else {
          throw new Error("Analysis not found in database");
        }
      } catch (queryError) {
        console.error("[get-comprehensive-analysis] Direct query failed:", queryError);
        throw queryError;
      }
    }
    
    // If we still don't have analysis data, try to get the most recent one
    if (!analysisData) {
      console.log("[get-comprehensive-analysis] Falling back to most recent analysis");
      
      const { data: recentAnalysis, error: recentError } = await supabaseClient
        .from('comprehensive_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (recentError) {
        console.error("[get-comprehensive-analysis] Error fetching recent analysis:", recentError);
        throw new Error("No analysis found and couldn't fetch recent analysis");
      }
      
      if (recentAnalysis) {
        console.log(`[get-comprehensive-analysis] Found most recent analysis with ID: ${recentAnalysis.id}`);
        analysisData = recentAnalysis;
      } else {
        throw new Error("No analyses found in database");
      }
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
        overview: analysisData.overview || "Your personality analysis reveals a balanced profile with analytical and empathetic qualities.",
        traits: analysisData.traits || generateMockTraits(),
        intelligence: analysisData.intelligence || generateMockIntelligence(),
        intelligenceScore: analysisData.intelligence_score || 75,
        emotionalIntelligenceScore: analysisData.emotional_intelligence_score || 70,
        valueSystem: analysisData.value_system || ["Growth", "Connection", "Achievement"],
        motivators: analysisData.motivators || ["Learning", "Making connections", "Solving problems"],
        inhibitors: analysisData.inhibitors || ["Self-doubt", "Perfectionism"],
        weaknesses: analysisData.weaknesses || ["May overthink decisions", "Could struggle with boundaries"],
        growthAreas: analysisData.growth_areas || ["Developing confidence", "Balancing analysis with action"],
        relationshipPatterns: analysisData.relationship_patterns || {
          strengths: ["Building deep connections", "Active listening"],
          challenges: ["Setting boundaries", "Expressing needs directly"],
          compatibleTypes: ["Those who value authenticity", "Growth-minded individuals"]
        },
        careerSuggestions: analysisData.career_suggestions || ["Researcher", "Consultant", "Creative Director"],
        learningPathways: analysisData.learning_pathways || ["Self-directed learning", "Practical application"],
        roadmap: analysisData.roadmap || "Focus on leveraging your analytical strengths while developing your interpersonal skills.",
        message: id !== analysisData.id ? 
          `Requested analysis not found. Showing analysis from ${new Date(analysisData.created_at).toLocaleDateString()}` : 
          undefined,
        shadowAspects: analysisData.shadow_aspects || generateMockShadowAspects(),
        detailedTraits: analysisData.detailed_traits || {
          primary: [],
          secondary: []
        },
        personalityArchetype: analysisData.personality_archetype || {
          name: "Analytical Explorer",
          description: "You combine thoughtful analysis with curiosity about new ideas and experiences.",
          strengths: ["In-depth thinking", "Pattern recognition", "Openness to new perspectives"],
          challenges: ["May get caught in analysis paralysis"],
          growthPath: "Integrating systematic thinking with intuitive insights"
        }
      };
      
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
    
    // Return a mock analysis as a fallback
    console.log("[get-comprehensive-analysis] Generating mock analysis as fallback");
    
    return new Response(
      JSON.stringify(generateMockAnalysis()),
      { 
        status: 200,  // Use 200 even for errors to ensure client gets usable data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateMockTraits() {
  return [
    {
      trait: "Analytical Thinking",
      score: 7.8,
      description: "You have a natural inclination to analyze situations carefully and consider multiple perspectives.",
      strengths: ["Problem-solving abilities", "Critical thinking", "Attention to detail"],
      challenges: ["May overthink simple situations", "Could get caught in analysis paralysis"],
      growthSuggestions: ["Practice combining analysis with intuition", "Set time limits for decisions"]
    },
    {
      trait: "Creativity",
      score: 7.2,
      description: "You possess a strong creative drive that enables you to think outside conventional boundaries.",
      strengths: ["Innovative problem-solving", "Original thinking", "Connecting disparate ideas"],
      challenges: ["May struggle with highly structured environments"],
      growthSuggestions: ["Develop frameworks to channel creative energy productively"]
    },
    {
      trait: "Empathy",
      score: 8.1,
      description: "You possess a natural ability to understand and share the feelings of others.",
      strengths: ["Deep understanding of others' perspectives", "Strong active listening skills"],
      challenges: ["Risk of taking on others' emotional burdens"],
      growthSuggestions: ["Establish healthy emotional boundaries"]
    }
  ];
}

function generateMockIntelligence() {
  return {
    type: "Balanced Cognitive Profile",
    score: 7.5,
    description: "You demonstrate a well-balanced cognitive profile with particular strengths in analytical and creative thinking.",
    domains: [
      {
        name: "Analytical Intelligence",
        score: 7.8,
        description: "Your ability to evaluate information critically and apply logical reasoning."
      },
      {
        name: "Creative Intelligence",
        score: 7.3,
        description: "Your capacity for innovative thinking and generating original ideas."
      },
      {
        name: "Emotional Intelligence",
        score: 7.9,
        description: "Your ability to recognize and manage emotions in yourself and others."
      }
    ]
  };
}

function generateMockShadowAspects() {
  return [
    {
      trait: "Perfectionism",
      description: "Your drive for excellence can sometimes manifest as excessive perfectionism, leading to self-criticism and delayed action.",
      impactAreas: ["Decision making", "Self-acceptance", "Productivity"],
      integrationSuggestions: ["Practice 'good enough' thinking", "Set realistic standards"]
    },
    {
      trait: "Avoidance Patterns",
      description: "A tendency to postpone challenging tasks or difficult conversations as a protective mechanism.",
      impactAreas: ["Project completion", "Relationship development", "Personal growth"],
      integrationSuggestions: ["Start with small steps", "Practice purposeful discomfort"]
    }
  ];
}

function generateMockAnalysis() {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    overview: "This is a mock analysis generated as a fallback. Your personality profile suggests a balanced combination of analytical thinking and empathetic understanding. You likely approach situations with both logical reasoning and consideration for emotional factors, which helps you navigate complex scenarios effectively.\n\nYou demonstrate curiosity about concepts and ideas, along with an appreciation for practical applications. This blend of theoretical interest and pragmatic focus allows you to bridge abstract thinking with real-world solutions in ways that many find valuable.",
    traits: generateMockTraits(),
    intelligence: generateMockIntelligence(),
    intelligenceScore: 75,
    emotionalIntelligenceScore: 72,
    cognitiveStyle: "Balanced Thinker",
    valueSystem: ["Growth", "Understanding", "Connection", "Integrity"],
    motivators: ["Learning new concepts", "Solving interesting problems", "Helping others", "Personal development"],
    inhibitors: ["Self-doubt", "Perfectionism", "Overthinking decisions"],
    weaknesses: ["May overthink decisions", "Could struggle with setting boundaries", "Occasional reluctance to take risks"],
    growthAreas: ["Developing confidence in decisions", "Balancing analysis with action", "Setting clearer boundaries"],
    relationshipPatterns: {
      strengths: ["Supportive and understanding", "Values deep connections", "Good listener"],
      challenges: ["May avoid necessary conflict", "Could struggle with asserting needs"],
      compatibleTypes: ["Direct communicators", "Those who appreciate depth", "People who balance your tendencies"]
    },
    careerSuggestions: ["Research roles", "Strategic advisory positions", "Content development", "Problem-solving specialties"],
    learningPathways: ["Structured learning with practical applications", "Collaborative learning environments", "Self-directed exploration with feedback"],
    roadmap: "Focus on developing confidence in your decisions while maintaining your analytical strengths. Your natural empathy makes you well-suited for roles where understanding others is important.",
    message: "This is a mock analysis generated because your requested analysis could not be found. Please try creating a new analysis for more accurate results.",
    shadowAspects: generateMockShadowAspects(),
    detailedTraits: {
      primary: [
        {
          trait: "Strategic Thinking",
          score: 7.9,
          description: "You naturally consider long-term implications and connect immediate actions to broader goals.",
          strengths: ["Future planning", "Systems thinking", "Anticipating obstacles"],
          challenges: ["May overcomplicate simple matters"],
          growthSuggestions: ["Balance strategic vision with practical steps"]
        }
      ],
      secondary: [
        {
          trait: "Adaptability",
          score: 7.4,
          description: "You demonstrate flexibility when facing changing circumstances and new information.",
          strengths: ["Quick adjustment to change", "Learning from experience"],
          challenges: ["May sometimes resist structured environments"],
          growthSuggestions: ["Find balance between adaptability and stability"]
        }
      ]
    },
    personalityArchetype: {
      name: "Thoughtful Explorer",
      description: "You combine analytical thinking with curiosity about diverse ideas and experiences.",
      strengths: ["Balanced perspective", "Thoughtful responses", "Intellectual versatility"],
      challenges: ["Finding focus among many interesting options"],
      growthPath: "Developing expertise in areas where your analytical and exploratory qualities create unique value."
    }
  };
}
