
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
    
    // Support multiple ways of getting the ID parameter
    
    // 1. Check URL parameters first
    const url = new URL(req.url);
    id = url.searchParams.get('id');
    
    // 2. If not found in URL, try to get from request body
    if (!id && req.method === 'POST' || req.method === 'GET' && !id) {
      try {
        const body = await req.json();
        id = body.id;
        console.log("Extracted ID from request body:", id);
      } catch (e) {
        // Ignore JSON parsing errors
        console.error("Error parsing request body:", e);
      }
    }
    
    // Log the ID that was found
    console.log(`Processing request for analysis ID: ${id || 'none'}`);

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
      console.log("Analysis not found by ID, trying assessment_id");
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
      
      // If still not found, try a more flexible search
      console.log("Analysis not found by assessment_id, trying partial match");
      let { data: flexData, error: flexError } = await supabase
        .from('analyses')
        .select('*')
        .filter('id', 'ilike', `%${id.slice(-8)}%`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (flexError) {
        console.error("Error in flexible search:", flexError);
      } else if (flexData && flexData.length > 0) {
        console.log("Found analysis via flexible search:", flexData[0].id);
        return new Response(
          JSON.stringify(flexData[0]),
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
