
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
    // Extract ID from URL parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Analysis ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Getting public analysis with ID: ${id}`);

    // Try direct table access first
    let { data: analysisData, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (analysisError) {
      console.error("Error fetching analysis by ID:", analysisError);
      return new Response(
        JSON.stringify({ error: analysisError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If not found by id, try looking by assessment_id
    if (!analysisData) {
      let { data: assessmentData, error: assessmentError } = await supabase
        .from('analyses')
        .select('*')
        .eq('assessment_id', id)
        .maybeSingle();
        
      if (assessmentError) {
        console.error("Error fetching by assessment_id:", assessmentError);
        return new Response(
          JSON.stringify({ error: assessmentError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (assessmentData) {
        console.log("Found analysis by assessment_id:", assessmentData.id);
        return new Response(
          JSON.stringify(assessmentData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Analysis not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Found analysis by ID:", analysisData.id);
    return new Response(
      JSON.stringify(analysisData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in get-public-analysis:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to get analysis' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
