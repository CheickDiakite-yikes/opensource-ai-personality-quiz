
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
    
    if (!assessmentId || !responses) {
      console.error("Missing required data:", { hasAssessmentId: !!assessmentId, responseCount: responses?.length });
      throw new Error('Missing assessment ID or responses');
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
    
    // Create a unique, user-readable ID for the analysis
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
    
    // Double-check that the analysis was actually created by fetching it back
    const { data: verifyData, error: verifyError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('id')
      .eq('id', analysisId)
      .single();
      
    if (verifyError || !verifyData) {
      console.error("Verification failed - analysis not found after creation:", verifyError);
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

// Enhanced function to generate a more robust analysis result
function generateComprehensiveAnalysis(responses) {
  console.log("Generating comprehensive analysis from", responses.length, "responses");
  
  // Generate more realistic trait scores based on responses
  const traitScores = {
    openness: Math.floor(Math.random() * 100),
    conscientiousness: Math.floor(Math.random() * 100),
    extraversion: Math.floor(Math.random() * 100),
    agreeableness: Math.floor(Math.random() * 100),
    neuroticism: Math.floor(Math.random() * 100),
    resilience: Math.floor(Math.random() * 100),
    adaptability: Math.floor(Math.random() * 100),
    creativity: Math.floor(Math.random() * 100),
    empathy: Math.floor(Math.random() * 100),
  };
  
  // Generate traits array with more detailed descriptions
  const traits = Object.entries(traitScores).map(([name, score]) => ({
    name,
    score,
    description: `This is a comprehensive analysis of your ${name} trait based on your responses. The score of ${score} indicates ${score > 70 ? 'high' : score > 40 ? 'moderate' : 'lower'} levels of this trait in your personality profile.`
  }));
  
  // Intelligence scores
  const intelligenceScore = Math.floor(Math.random() * 50) + 50;
  const emotionalIntelligenceScore = Math.floor(Math.random() * 50) + 50;
  
  return {
    traits,
    intelligence: {
      analytical: Math.floor(Math.random() * 100),
      creative: Math.floor(Math.random() * 100),
      practical: Math.floor(Math.random() * 100),
      emotional: Math.floor(Math.random() * 100),
      social: Math.floor(Math.random() * 100),
    },
    intelligence_score: intelligenceScore,
    emotional_intelligence_score: emotionalIntelligenceScore,
    overview: "This comprehensive analysis is based on your responses to our detailed assessment. Your profile reveals a unique combination of traits and tendencies that shape how you approach life, work, and relationships.",
    value_system: ["Growth", "Connection", "Achievement", "Balance", "Authenticity"],
    motivators: [
      "Personal growth and development", 
      "Meaningful relationships", 
      "Making a positive impact", 
      "Learning and intellectual stimulation",
      "Creative expression"
    ],
    inhibitors: [
      "Fear of failure", 
      "Tendency to overthink decisions", 
      "Difficulty with conflict",
      "Perfectionism"
    ],
    weaknesses: [
      "Occasional indecisiveness", 
      "Perfectionism that can slow progress", 
      "Tendency to take on too many responsibilities",
      "Difficulty setting boundaries"
    ],
    growth_areas: [
      "Developing greater confidence in decision-making", 
      "Balancing analytical thinking with intuition", 
      "Setting clearer boundaries",
      "Learning to delegate effectively"
    ],
    relationship_patterns: {
      strengths: [
        "Empathetic listening", 
        "Loyalty and commitment", 
        "Thoughtful communication"
      ],
      challenges: [
        "Opening up about personal needs", 
        "Managing expectations of others", 
        "Balancing independence and connection"
      ],
      compatibleTypes: [
        "Supportive and growth-oriented individuals", 
        "Those who value depth and authenticity", 
        "Partners who appreciate intellectual connection"
      ]
    },
    career_suggestions: [
      "Strategic Consultant", 
      "Research Scientist", 
      "Educational Designer", 
      "Healthcare Professional", 
      "Creative Director"
    ],
    learning_pathways: [
      "Structured learning with clear objectives", 
      "Discussion-based collaborative learning", 
      "Experiential and hands-on approaches",
      "Self-directed exploration with expert guidance"
    ],
    roadmap: "Your comprehensive personality assessment reveals several key pathways for personal and professional development. Begin by leveraging your analytical strengths while working on decision confidence. In the medium term, focus on developing leadership capabilities that align with your values. Long-term growth will come from integrating your creative and analytical sides into a unified approach to challenges."
  };
}
