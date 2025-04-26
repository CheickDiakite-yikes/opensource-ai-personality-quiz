
import { corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient, handleError, handleSuccess } from '../_shared/db-helpers.ts';

// This is an edge function that can bypass RLS policies to delete analyses
// when the regular client-side delete functions fail

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the request auth
    const supabase = createSupabaseClient(req);
    
    // Get request data
    const { analysisId } = await req.json();
    
    if (!analysisId) {
      return new Response(
        JSON.stringify({ error: 'Analysis ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Perform the deletion directly using the service role
    const { error } = await supabase
      .from('concise_analyses')
      .delete()
      .eq('id', analysisId);
      
    if (error) {
      console.error('Error deleting analysis:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return handleSuccess({ success: true });
  } catch (error) {
    return handleError(error);
  }
});
