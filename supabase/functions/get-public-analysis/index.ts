
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

    // Try comprehensive_analyses table first
    try {
      console.log("[get-public-analysis] Checking comprehensive_analyses table first");
      const { data: comprehensiveData, error: comprehensiveError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (comprehensiveError) {
        console.error("[get-public-analysis] Error fetching from comprehensive_analyses:", comprehensiveError);
      } else if (comprehensiveData) {
        console.log(`[get-public-analysis] Found analysis in comprehensive_analyses: ${comprehensiveData.id}`);
        return new Response(
          JSON.stringify(comprehensiveData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("[get-public-analysis] Exception checking comprehensive_analyses:", e);
    }

    // Try direct table access for analyses table with improved error handling
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
      
      // Try comprehensive_analyses first
      const { data: compAssessmentData, error: compAssessmentError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('assessment_id', id)
        .maybeSingle();
        
      if (compAssessmentError) {
        console.error("[get-public-analysis] Error fetching comprehensive by assessment_id:", compAssessmentError);
      } else if (compAssessmentData) {
        console.log(`[get-public-analysis] Found comprehensive by assessment_id: ${compAssessmentData.id}`);
        return new Response(
          JSON.stringify(compAssessmentData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Then try analyses table
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
      
      // Try comprehensive_analyses first
      const { data: compFlexData, error: compFlexError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .filter('id', 'ilike', `%${id.slice(-8)}%`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (compFlexError) {
        console.error("[get-public-analysis] Error in comprehensive flexible search:", compFlexError);
      } else if (compFlexData && compFlexData.length > 0) {
        console.log(`[get-public-analysis] Found comprehensive via flexible search: ${compFlexData[0].id}`);
        return new Response(
          JSON.stringify(compFlexData[0]),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Then try analyses table
      const { data: flexData, error: flexError } = await supabase
        .from('analyses')
        .select('*')
        .filter('id', 'ilike', `%${id.slice(-8)}%`)
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

    // Try one last approach - get the most recent analysis from either table
    try {
      console.log("[get-public-analysis] No matching analysis found, getting most recent analysis");
      
      // Try comprehensive_analyses first
      const { data: recentCompData, error: recentCompError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (recentCompError) {
        console.error("[get-public-analysis] Error fetching recent comprehensive analysis:", recentCompError);
      } else if (recentCompData && recentCompData.length > 0) {
        console.log(`[get-public-analysis] Found most recent comprehensive analysis: ${recentCompData[0].id}`);
        return new Response(
          JSON.stringify({ 
            ...recentCompData[0],
            message: "Requested analysis not found, returning most recent comprehensive analysis instead" 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Then try analyses table
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
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
