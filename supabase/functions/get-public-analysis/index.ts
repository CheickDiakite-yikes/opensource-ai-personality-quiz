
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
    console.log(`[get-public-analysis] Processing request, method: ${req.method}, url: ${req.url}`);
    
    // Support multiple ways of getting the ID parameter - with better error handling
    
    // 1. Check URL parameters first
    try {
      const url = new URL(req.url);
      id = url.searchParams.get('id');
      if (id) {
        console.log(`[get-public-analysis] Found ID in URL params: ${id}`);
      }
    } catch (e) {
      console.error("[get-public-analysis] Error parsing URL:", e);
    }
    
    // 2. If not found in URL, try to get from request body
    if (!id && (req.method === 'POST' || req.method === 'GET')) {
      try {
        const body = await req.json().catch(() => ({}));
        id = body.id;
        if (id) {
          console.log(`[get-public-analysis] Extracted ID from request body: ${id}`);
        }
      } catch (e) {
        console.error("[get-public-analysis] Error parsing request body:", e);
      }
    }
    
    // Log the ID that was found
    console.log(`[get-public-analysis] Processing request for analysis ID: ${id || 'none'}`);

    if (!id) {
      console.error("[get-public-analysis] No ID provided in request");
      return new Response(
        JSON.stringify({ error: 'Analysis ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[get-public-analysis] Getting public analysis with ID: ${id}`);

    // Try direct table access first with improved error handling - check our new table first
    try {
      const { data: deepInsightData, error: deepInsightError } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (deepInsightError) {
        console.error("[get-public-analysis] Error fetching from deep_insight_analyses:", deepInsightError);
        // Continue to next approach
      } else if (deepInsightData) {
        console.log(`[get-public-analysis] Found analysis in deep_insight_analyses table: ${deepInsightData.id}`);
        return new Response(
          JSON.stringify(deepInsightData.complete_analysis),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception in deep_insight_analyses lookup:", e);
      // Continue to next approach
    }
    
    // If not found in deep_insight_analyses, try the old analyses table
    try {
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (analysisError) {
        console.error("[get-public-analysis] Error fetching analysis by ID:", analysisError);
        // Continue to next approach
      } else if (analysisData) {
        console.log(`[get-public-analysis] Found analysis in analyses table: ${analysisData.id}`);
        return new Response(
          JSON.stringify(analysisData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception in analyses lookup:", e);
      // Continue to next approach
    }
    
    // If not found by id, try looking by assessment_id
    try {
      console.log("[get-public-analysis] Analysis not found by ID, trying assessment_id");
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('analyses')
        .select('*')
        .eq('assessment_id', id)
        .maybeSingle();
        
      if (assessmentError) {
        console.error("[get-public-analysis] Error fetching by assessment_id:", assessmentError);
        // Continue to next approach
      } else if (assessmentData) {
        console.log(`[get-public-analysis] Found analysis by assessment_id: ${assessmentData.id}`);
        return new Response(
          JSON.stringify(assessmentData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception in assessment_id lookup:", e);
      // Continue to next approach
    }
      
    // If still not found, try a more flexible search
    try {
      console.log("[get-public-analysis] Analysis not found by assessment_id, trying partial match");
      // Try both tables with flexible search
      const { data: flexDeepInsightData, error: flexDeepInsightError } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .filter('id', 'ilike', `%${id.slice(-8)}%`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (flexDeepInsightError) {
        console.error("[get-public-analysis] Error in flexible search on deep_insight_analyses:", flexDeepInsightError);
      } else if (flexDeepInsightData && flexDeepInsightData.length > 0) {
        console.log(`[get-public-analysis] Found analysis via flexible search in deep_insight_analyses: ${flexDeepInsightData[0].id}`);
        return new Response(
          JSON.stringify(flexDeepInsightData[0].complete_analysis),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Try flexible search on old table
      const { data: flexData, error: flexError } = await supabase
        .from('analyses')
        .select('*')
        .filter('id', 'ilike', `%${id.slice(-8)}%`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (flexError) {
        console.error("[get-public-analysis] Error in flexible search on analyses:", flexError);
      } else if (flexData && flexData.length > 0) {
        console.log(`[get-public-analysis] Found analysis via flexible search in analyses: ${flexData[0].id}`);
        return new Response(
          JSON.stringify(flexData[0]),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception in flexible search:", e);
      // Continue to next approach
    }

    // Try one last approach - get the most recent analysis from either table
    try {
      console.log("[get-public-analysis] No matching analysis found, getting most recent analysis");
      // Try deep_insight_analyses first
      const { data: recentDeepInsightData, error: recentDeepInsightError } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (recentDeepInsightError) {
        console.error("[get-public-analysis] Error fetching recent deep insight analysis:", recentDeepInsightError);
      } else if (recentDeepInsightData && recentDeepInsightData.length > 0) {
        console.log(`[get-public-analysis] Found most recent analysis from deep_insight_analyses as fallback: ${recentDeepInsightData[0].id}`);
        return new Response(
          JSON.stringify({ 
            ...recentDeepInsightData[0].complete_analysis,
            message: "Requested analysis not found, returning most recent analysis instead" 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Try old analyses table if deep_insight_analyses had no results
      const { data: recentData, error: recentError } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (recentError) {
        console.error("[get-public-analysis] Error fetching recent analysis from analyses:", recentError);
      } else if (recentData && recentData.length > 0) {
        console.log(`[get-public-analysis] Found most recent analysis from analyses as fallback: ${recentData[0].id}`);
        return new Response(
          JSON.stringify({ 
            ...recentData[0],
            message: "Requested analysis not found, returning most recent analysis instead" 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception in recent analysis lookup:", e);
    }
    
    // If all approaches failed, return a 404
    console.error(`[get-public-analysis] Analysis not found after all lookup attempts for ID: ${id}`);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis not found',
        message: 'The requested analysis could not be found after multiple lookup attempts'
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("[get-public-analysis] Uncaught error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to get analysis',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
