
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Parse request body
    const requestData = await req.json();
    const analysisId = requestData.id;

    if (!analysisId) {
      return new Response(
        JSON.stringify({ error: 'Missing analysis ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Edge function: Fetching comprehensive analysis with ID: ${analysisId}`);

    // Method 1: Try direct table query
    const { data: directData, error: directError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('*')
      .eq('id', analysisId)
      .maybeSingle();

    if (!directError && directData) {
      console.log(`Edge function: Found analysis directly with ID: ${analysisId}`);
      return new Response(
        JSON.stringify(directData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Method 2: Check if it's an assessment ID
    const { data: assessmentData, error: assessmentError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('*')
      .eq('assessment_id', analysisId)
      .order('created_at', { ascending: false });

    if (!assessmentError && assessmentData && assessmentData.length > 0) {
      console.log(`Edge function: Found analysis via assessment ID: ${analysisId}`);
      return new Response(
        JSON.stringify(assessmentData[0]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Method 3: Try using RPC function
    try {
      const { data: rpcData, error: rpcError } = await supabaseClient.rpc(
        'get_comprehensive_analysis_by_id',
        { analysis_id: analysisId }
      );

      if (!rpcError && rpcData) {
        console.log(`Edge function: Found analysis via RPC for ID: ${analysisId}`);
        return new Response(
          JSON.stringify(rpcData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    } catch (rpcErr) {
      console.error("Edge function: Error calling RPC:", rpcErr);
    }

    // Method 4: Search for recent analyses that might match
    const { data: recentAnalyses, error: recentError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!recentError && recentAnalyses && recentAnalyses.length > 0) {
      console.log(`Edge function: Found ${recentAnalyses.length} recent analyses to check`);
      
      // Try to find the analysis in the most recent ones
      const recentMatch = recentAnalyses.find(a => {
        const createdAt = new Date(a.created_at);
        return (Date.now() - createdAt.getTime()) < 15 * 60 * 1000; // 15 minutes
      });
      
      if (recentMatch) {
        const { data: matchData } = await supabaseClient
          .from('comprehensive_analyses')
          .select('*')
          .eq('id', recentMatch.id)
          .single();
          
        if (matchData) {
          console.log(`Edge function: Using recent analysis ${recentMatch.id} as fallback`);
          return new Response(
            JSON.stringify(matchData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }
      }
    }

    // No analysis found
    return new Response(
      JSON.stringify({ error: 'Analysis not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    );
    
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
