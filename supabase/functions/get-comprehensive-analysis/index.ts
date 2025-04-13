
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
    
    // Enhanced logging for debugging
    console.log(`[get-comprehensive-analysis] New request received: ${req.url}`);
    
    // Support multiple ways of getting the ID parameter
    
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
    
    // First, try to get analysis directly using the provided ID
    const { data: analysisData, error: analysisError } = await supabase
      .from('comprehensive_analyses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (analysisError) {
      console.error("[get-comprehensive-analysis] Error fetching analysis by ID:", analysisError);
    } else if (analysisData) {
      console.log(`[get-comprehensive-analysis] Successfully found analysis with ID: ${id}`);
      return new Response(
        JSON.stringify(analysisData),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("[get-comprehensive-analysis] Analysis not found by direct ID, checking if it's an assessment ID");
    
    // If not found directly, try to find by assessment_id
    const { data: assessmentAnalysisData, error: assessmentAnalysisError } = await supabase
      .from('comprehensive_analyses')
      .select('*')
      .eq('assessment_id', id)
      .maybeSingle();
      
    if (assessmentAnalysisError) {
      console.error("[get-comprehensive-analysis] Error fetching by assessment_id:", assessmentAnalysisError);
    } else if (assessmentAnalysisData) {
      console.log(`[get-comprehensive-analysis] Found analysis by assessment_id: ${id}`);
      return new Response(
        JSON.stringify(assessmentAnalysisData),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If still not found, check if there are any analyses available as fallback
    console.log("[get-comprehensive-analysis] No analysis found by ID or assessment_id, looking for most recent one");
    
    // Try to get the most recent analysis
    const { data: mostRecentData, error: mostRecentError } = await supabase
      .from('comprehensive_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (mostRecentError) {
      console.error("[get-comprehensive-analysis] Error fetching most recent analysis:", mostRecentError);
    } else if (mostRecentData && mostRecentData.length > 0) {
      console.log(`[get-comprehensive-analysis] Returning most recent analysis as fallback: ${mostRecentData[0].id}`);
      return new Response(
        JSON.stringify({
          ...mostRecentData[0],
          message: "Requested analysis not found. Returning most recent analysis as fallback."
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if there are any analyses in the database
    const { count, error: countError } = await supabase
      .from('comprehensive_analyses')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("[get-comprehensive-analysis] Error counting analyses:", countError);
    } else {
      console.log(`[get-comprehensive-analysis] Total analyses in database: ${count || 0}`);
    }
    
    // At this point, we've tried everything and found nothing
    console.error("[get-comprehensive-analysis] Analysis not found and no fallbacks available");
    return new Response(
      JSON.stringify({ error: 'Analysis not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[get-comprehensive-analysis] Uncaught error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to get analysis' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
