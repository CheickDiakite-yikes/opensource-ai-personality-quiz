
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
    const userId = requestData.user_id;
    const fetchAll = !!requestData.fetch_all;

    console.log(`Edge function: Request received with params - ID: ${analysisId}, User ID: ${userId}, Fetch All: ${fetchAll}`);

    // If fetch_all is true and userId is provided, return all analyses for that user
    if (fetchAll && userId) {
      console.log(`Edge function: Fetching all analyses for user: ${userId}`);
      const { data: allUserAnalyses, error: userError } = await supabaseClient
        .from('comprehensive_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (userError) {
        console.error(`Edge function: Error fetching user analyses: ${userError.message}`);
        return new Response(
          JSON.stringify({ error: 'Error fetching user analyses', details: userError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      if (allUserAnalyses && allUserAnalyses.length > 0) {
        console.log(`Edge function: Found ${allUserAnalyses.length} analyses for user ${userId}`);
        return new Response(
          JSON.stringify(allUserAnalyses),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } else {
        console.log(`Edge function: No analyses found for user ${userId}`);
        return new Response(
          JSON.stringify({ error: 'No analyses found for user', user_id: userId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
    }

    // If analysisId is not provided but userId is, return the latest analysis for that user
    if (!analysisId && userId) {
      console.log(`Edge function: Fetching latest analysis for user: ${userId}`);
      const { data: latestAnalysis, error: latestError } = await supabaseClient
        .from('comprehensive_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestError) {
        console.error(`Edge function: Error fetching latest analysis: ${latestError.message}`);
      } else if (latestAnalysis) {
        console.log(`Edge function: Found latest analysis for user: ${userId}`);
        return new Response(
          JSON.stringify(latestAnalysis),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }

    // If no analysis ID is provided and no user ID or the above methods failed, return an error
    if (!analysisId) {
      return new Response(
        JSON.stringify({ error: 'Missing analysis ID or user ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Edge function: Fetching comprehensive analysis with ID: ${analysisId}`);

    // First attempt: Check if it matches exactly with the analysis ID
    console.log(`Edge function: Attempting exact ID match for: ${analysisId}`);
    let { data: directData, error: directError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('*')
      .eq('id', analysisId)
      .maybeSingle();

    if (directData) {
      console.log(`Edge function: Found analysis directly with ID: ${analysisId}`);
      return new Response(
        JSON.stringify(directData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else if (directError) {
      console.error(`Edge function: Error in direct fetch: ${directError.message}`);
    }

    // Second attempt: Check if it matches an assessment ID
    console.log(`Edge function: Attempting to find by assessment ID: ${analysisId}`);
    const { data: assessmentData, error: assessmentError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('*')
      .eq('assessment_id', analysisId)
      .order('created_at', { ascending: false });

    if (!assessmentError && assessmentData && assessmentData.length > 0) {
      console.log(`Edge function: Found ${assessmentData.length} analyses by assessment ID`);
      return new Response(
        JSON.stringify(assessmentData[0]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else if (assessmentError) {
      console.error(`Edge function: Error in assessment ID fetch: ${assessmentError.message}`);
    }

    // Third attempt: Try using RPC function
    console.log(`Edge function: Attempting to use RPC function for ID: ${analysisId}`);
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
      } else if (rpcError) {
        console.error(`Edge function: Error in RPC call: ${rpcError.message}`);
      }
    } catch (rpcErr) {
      console.error(`Edge function: Exception in RPC call: ${rpcErr}`);
    }
    
    // Fourth attempt: Try a UUID format conversion (in case the ID is formatted differently)
    if (analysisId.length >= 32 && !analysisId.includes('-')) {
      try {
        // Format as UUID with dashes
        const formattedId = `${analysisId.slice(0, 8)}-${analysisId.slice(8, 12)}-${analysisId.slice(12, 16)}-${analysisId.slice(16, 20)}-${analysisId.slice(20)}`;
        console.log(`Edge function: Trying with UUID formatted ID: ${formattedId}`);
        
        const { data: formattedData, error: formattedError } = await supabaseClient
          .from('comprehensive_analyses')
          .select('*')
          .eq('id', formattedId)
          .maybeSingle();
          
        if (!formattedError && formattedData) {
          console.log(`Edge function: Found analysis with formatted UUID: ${formattedId}`);
          return new Response(
            JSON.stringify(formattedData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }
      } catch (formatErr) {
        console.error(`Edge function: UUID format error: ${formatErr}`);
      }
    }

    // Fifth attempt: Get recent analyses and check for partial matches
    console.log(`Edge function: Looking for recent analyses as fallback`);
    const { data: recentAnalyses, error: recentError } = await supabaseClient
      .from('comprehensive_analyses')
      .select('id, created_at, assessment_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!recentError && recentAnalyses && recentAnalyses.length > 0) {
      console.log(`Edge function: Found ${recentAnalyses.length} recent analyses to check`);
      
      // Try to find an exact match in recent analyses first
      const exactMatch = recentAnalyses.find(a => a.id === analysisId || a.assessment_id === analysisId);
      if (exactMatch) {
        console.log(`Edge function: Found exact match in recent analyses: ${exactMatch.id}`);
        
        const { data: matchData } = await supabaseClient
          .from('comprehensive_analyses')
          .select('*')
          .eq('id', exactMatch.id)
          .single();
          
        if (matchData) {
          return new Response(
            JSON.stringify(matchData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }
      }
      
      // Try to find analyses created in the last 15 minutes
      const recentMatch = recentAnalyses.find(a => {
        const createdAt = new Date(a.created_at);
        return (Date.now() - createdAt.getTime()) < 15 * 60 * 1000; // 15 minutes
      });
      
      if (recentMatch) {
        console.log(`Edge function: Using recent analysis ${recentMatch.id} as fallback`);
        const { data: matchData } = await supabaseClient
          .from('comprehensive_analyses')
          .select('*')
          .eq('id', recentMatch.id)
          .single();
          
        if (matchData) {
          return new Response(
            JSON.stringify(matchData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          );
        }
      }
    }

    // Final attempt: Check if we received a partial UUID and try a LIKE query
    if (analysisId.length >= 8) {
      const partialPattern = `%${analysisId.substr(-8)}%`; // Use last 8 chars for the match
      console.log(`Edge function: Trying partial match with pattern: ${partialPattern}`);
      
      const { data: partialData, error: partialError } = await supabaseClient
        .from('comprehensive_analyses')
        .select('*')
        .ilike('id', partialPattern)
        .limit(1);
        
      if (!partialError && partialData && partialData.length > 0) {
        console.log(`Edge function: Found analysis by partial ID match: ${partialData[0].id}`);
        return new Response(
          JSON.stringify(partialData[0]),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }

    // No analysis found after all attempts
    console.log(`Edge function: Failed to find analysis with ID: ${analysisId} after all attempts`);
    return new Response(
      JSON.stringify({ error: 'Analysis not found', id: analysisId }),
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
