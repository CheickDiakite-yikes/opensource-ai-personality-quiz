
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let id: string | null = null;
    
    console.log(`[get-comprehensive-analysis] New request received: ${req.url}`);
    
    // 1. Check URL parameters first
    try {
      const url = new URL(req.url);
      id = url.searchParams.get('id');
      if (id) {
        console.log(`[get-comprehensive-analysis] Found ID in URL params: ${id}`);
      }
    } catch (e) {
      console.error("[get-comprehensive-analysis] Error parsing URL:", e);
    }
    
    // 2. If not found in URL, try to get from request body
    if (!id && req.method === 'POST') {
      try {
        const body = await req.json().catch(() => ({}));
        id = body.id;
        if (id) {
          console.log(`[get-comprehensive-analysis] Extracted ID from request body: ${id}`);
        }
      } catch (e) {
        console.error("[get-comprehensive-analysis] Error parsing request body:", e);
      }
    }

    if (!id) {
      console.error("[get-comprehensive-analysis] No ID provided in request");
      return new Response(
        JSON.stringify({ error: 'Analysis ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[get-comprehensive-analysis] Getting comprehensive analysis with ID: ${id}`);
    
    // First try: direct ID match
    let analysisData;
    let analysisError;
    
    try {
      const result = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      analysisData = result.data;
      analysisError = result.error;
      
      if (analysisError) {
        console.error("[get-comprehensive-analysis] Error fetching analysis by ID:", analysisError);
      } else if (analysisData) {
        console.log(`[get-comprehensive-analysis] Found analysis with ID: ${id}`);
        return new Response(
          JSON.stringify(analysisData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (err) {
      console.error("[get-comprehensive-analysis] Exception in direct lookup:", err);
    }
    
    // Second try: assessment_id match
    try {
      console.log("[get-comprehensive-analysis] Checking if it's an assessment ID");
      const result = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('assessment_id', id)
        .maybeSingle();
        
      const assessmentAnalysisData = result.data;
      const assessmentAnalysisError = result.error;
      
      if (assessmentAnalysisError) {
        console.error("[get-comprehensive-analysis] Error fetching by assessment_id:", assessmentAnalysisError);
      } else if (assessmentAnalysisData) {
        console.log(`[get-comprehensive-analysis] Found analysis by assessment_id: ${id}`);
        return new Response(
          JSON.stringify(assessmentAnalysisData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (err) {
      console.error("[get-comprehensive-analysis] Exception in assessment_id lookup:", err);
    }
    
    // Third try: use database function if available
    try {
      console.log("[get-comprehensive-analysis] Trying database function");
      const { data: functionData, error: functionError } = await supabase.rpc(
        'get_comprehensive_analysis_by_id',
        { analysis_id: id }
      );
      
      if (functionError) {
        console.error("[get-comprehensive-analysis] Function error:", functionError);
      } else if (functionData && Object.keys(functionData).length > 0) {
        console.log(`[get-comprehensive-analysis] Got analysis from database function`);
        return new Response(
          JSON.stringify(functionData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (err) {
      console.error("[get-comprehensive-analysis] Exception in function call:", err);
    }
    
    // Fourth try: most recent analysis as fallback
    try {
      console.log("[get-comprehensive-analysis] Looking for most recent analysis");
      const result = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      const mostRecentData = result.data;
      const mostRecentError = result.error;
      
      if (mostRecentError) {
        console.error("[get-comprehensive-analysis] Recent query error:", mostRecentError);
      } else if (mostRecentData && mostRecentData.length > 0) {
        console.log(`[get-comprehensive-analysis] Returning most recent analysis as fallback`);
        return new Response(
          JSON.stringify({
            ...mostRecentData[0],
            message: "Requested analysis not found. Returning most recent analysis as fallback."
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (err) {
      console.error("[get-comprehensive-analysis] Exception in recent lookup:", err);
    }
    
    // Final attempt: Generate mock data for testing
    console.log("[get-comprehensive-analysis] No analysis found, generating mock data");
    
    const mockAnalysis = generateMockAnalysis(id);
    
    return new Response(
      JSON.stringify({
        ...mockAnalysis,
        id: id,
        message: "Generated mock analysis for testing purposes"
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[get-comprehensive-analysis] Uncaught error:', error);
    
    // Even if we hit an error, try to return some mock data
    const mockAnalysis = generateMockAnalysis("error-fallback");
    
    return new Response(
      JSON.stringify({
        ...mockAnalysis,
        message: "Error occurred, generated fallback data",
        error: error.message
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to generate mock analysis data
function generateMockAnalysis(id: string) {
  console.log(`[get-comprehensive-analysis] Generating mock analysis with ID: ${id}`);
  
  const traits = [
    {
      name: "Analytical Thinking",
      score: 7.5,
      description: "You have a natural inclination to analyze situations carefully and consider multiple perspectives."
    },
    {
      name: "Creativity",
      score: 8.2,
      description: "You enjoy thinking outside the box and finding innovative solutions to problems."
    },
    {
      name: "Conscientiousness",
      score: 6.8,
      description: "You are organized, reliable, and detail-oriented in your approach to tasks and responsibilities."
    },
    {
      name: "Resilience",
      score: 7.2,
      description: "You have the ability to bounce back from challenges and adapt to difficult situations."
    },
    {
      name: "Empathy",
      score: 8.0,
      description: "You have a strong ability to understand and share the feelings of others."
    }
  ];
  
  const intelligence = {
    analytical: 82,
    creative: 78,
    practical: 75,
    emotional: 80,
    social: 76
  };
  
  return {
    id: id || crypto.randomUUID(),
    created_at: new Date().toISOString(),
    user_id: "test-user",
    assessment_id: id,
    overview: "You are someone who values both analytical thinking and creative problem-solving. Your profile indicates a strong capacity for growth and learning, with particular strengths in analytical thinking and creativity.",
    traits: traits,
    intelligence: intelligence,
    intelligence_score: 80,
    emotional_intelligence_score: 78,
    value_system: ["Growth", "Connection", "Understanding", "Achievement", "Autonomy"],
    motivators: [
      "Learning new concepts and skills", 
      "Making meaningful connections with others", 
      "Solving complex problems"
    ],
    inhibitors: [
      "Self-doubt in unfamiliar situations", 
      "Tendency to overthink decisions"
    ],
    weaknesses: [
      "May overthink decisions, leading to analysis paralysis", 
      "Could struggle with setting clear boundaries"
    ],
    growth_areas: [
      "Developing more confidence in your decisions", 
      "Finding balance between analysis and action"
    ],
    relationship_patterns: {
      strengths: ["Building deep connections", "Active listening"],
      challenges: ["Setting boundaries", "Expressing needs directly"],
      compatibleTypes: ["Those who value authenticity", "Growth-minded individuals"]
    },
    career_suggestions: ["Researcher", "Data Analyst", "Project Manager", "Consultant"],
    learning_pathways: ["Self-directed learning", "Practical application", "Collaborative environments"],
    roadmap: "Focus on leveraging your analytical strengths while developing your interpersonal skills. In the medium-term, explore roles that combine your technical abilities with creative problem-solving."
  };
}
