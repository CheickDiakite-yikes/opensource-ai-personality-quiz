
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
    
    // Enhanced error logging
    console.log(`[get-public-deep-analysis] Processing request, method: ${req.method}, url: ${req.url}`);
    
    // Check URL parameters
    try {
      const url = new URL(req.url);
      id = url.searchParams.get('id');
      if (id) {
        console.log(`[get-public-deep-analysis] Found ID in URL params: ${id}`);
      }
    } catch (e) {
      console.error("[get-public-deep-analysis] Error parsing URL:", e);
    }
    
    // If not found in URL, try to get from request body
    if (!id && (req.method === 'POST' || req.method === 'GET')) {
      try {
        const body = await req.json().catch(() => ({}));
        id = body.id;
        if (id) {
          console.log(`[get-public-deep-analysis] Extracted ID from request body: ${id}`);
        }
      } catch (e) {
        console.error("[get-public-deep-analysis] Error parsing request body:", e);
      }
    }
    
    if (!id) {
      console.error("[get-public-deep-analysis] No ID provided in request");
      return new Response(
        JSON.stringify({ error: 'Analysis ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[get-public-deep-analysis] Getting deep insight analysis with ID: ${id}`);

    // Get analysis from deep_insight_analyses table
    const { data: analysisData, error: analysisError } = await supabase
      .from('deep_insight_analyses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (analysisError) {
      console.error("[get-public-deep-analysis] Error fetching analysis:", analysisError);
      return new Response(
        JSON.stringify({ error: analysisError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!analysisData) {
      console.error(`[get-public-deep-analysis] Analysis not found for ID: ${id}`);
      return new Response(
        JSON.stringify({ error: 'Analysis not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`[get-public-deep-analysis] Successfully found analysis: ${analysisData.id}`);
    return new Response(
      JSON.stringify(analysisData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("[get-public-deep-analysis] Uncaught error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to get deep insight analysis' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
