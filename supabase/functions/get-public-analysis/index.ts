
import { corsHeaders } from '../_shared/cors.ts';
import { isLegacyId, extractSearchTerm, formatResponse } from './utils.ts';
import { getAnalysisById, getLegacyAnalysisById, searchAnalysisByTerm, getMostRecentAnalysis } from './queries.ts';
import type { ErrorResponse } from '../_shared/types.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let id: string | null = null;
    
    // Extract ID from request
    try {
      const url = new URL(req.url);
      id = url.searchParams.get('id');
      if (!id) {
        const body = await req.json().catch(() => ({}));
        id = body.id;
      }
    } catch (e) {
      console.error("[get-public-analysis] Error parsing request:", e);
    }

    if (!id) {
      console.error("[get-public-analysis] No ID provided in request");
      const error: ErrorResponse = { error: 'Analysis ID is required' };
      return new Response(JSON.stringify(error), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[get-public-analysis] Processing request for analysis ID: ${id}`);

    // Try direct lookup first
    let analysis = isLegacyId(id) 
      ? await getLegacyAnalysisById(id)
      : await getAnalysisById(id);
      
    if (analysis) {
      return new Response(JSON.stringify(formatResponse(analysis)), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Try flexible search if direct lookup fails
    const searchTerm = extractSearchTerm(id);
    analysis = await searchAnalysisByTerm(searchTerm);
    
    if (analysis) {
      return new Response(JSON.stringify(formatResponse(analysis, 'flexible search')), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Return most recent analysis as last resort
    analysis = await getMostRecentAnalysis();
    
    if (analysis) {
      return new Response(JSON.stringify(formatResponse(analysis, 'most recent')), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // If all approaches failed, return 404
    console.error(`[get-public-analysis] Analysis not found after all lookup attempts for ID: ${id}`);
    const error: ErrorResponse = {
      error: 'Analysis not found',
      message: 'The requested analysis could not be found after multiple lookup attempts'
    };
    
    return new Response(JSON.stringify(error), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("[get-public-analysis] Uncaught error:", error);
    const errorResponse: ErrorResponse = {
      error: error.message || 'Failed to get analysis',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
