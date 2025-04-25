
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
    
    // If no ID found at all, check for path parameter
    if (!id) {
      try {
        const urlParts = new URL(req.url).pathname.split('/');
        const potentialId = urlParts[urlParts.length - 1];
        
        // Validate that this looks like an ID
        if (potentialId && potentialId.length > 8) {
          id = potentialId;
          console.log(`[get-public-analysis] Extracted ID from path: ${id}`);
        }
      } catch (e) {
        console.error("[get-public-analysis] Error extracting path ID:", e);
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

    // Try direct table access first with improved error handling
    try {
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (analysisError) {
        console.error("[get-public-analysis] Error fetching analysis by ID:", analysisError);
        // Continue to next approach instead of returning error immediately
      } else if (analysisData) {
        console.log(`[get-public-analysis] Found analysis by direct ID lookup: ${analysisData.id}`);
        return new Response(
          JSON.stringify(analysisData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception in direct ID lookup:", e);
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
      // If id is very long, use the last 10 characters for the search
      const searchPattern = id.length > 12 ? id.slice(-10) : id;
      
      const { data: flexData, error: flexError } = await supabase
        .from('analyses')
        .select('*')
        .filter('id', 'ilike', `%${searchPattern}%`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (flexError) {
        console.error("[get-public-analysis] Error in flexible search:", flexError);
      } else if (flexData && flexData.length > 0) {
        console.log(`[get-public-analysis] Found analysis via flexible search: ${flexData[0].id}`);
        return new Response(
          JSON.stringify(flexData[0]),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception in flexible search:", e);
      // Continue to next approach
    }

    // Try one last approach - get the most recent analysis, if any
    try {
      console.log("[get-public-analysis] No matching analysis found, getting most recent analysis");
      const { data: recentData, error: recentError } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (recentError) {
        console.error("[get-public-analysis] Error fetching recent analysis:", recentError);
      } else if (recentData && recentData.length > 0) {
        console.log(`[get-public-analysis] Found most recent analysis as fallback: ${recentData[0].id}`);
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
        stack: Deno.env.get('DENO_ENV') === 'development' ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
