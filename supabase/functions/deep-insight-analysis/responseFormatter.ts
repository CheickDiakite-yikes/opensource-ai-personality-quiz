
import { corsHeaders } from "../_shared/cors.ts";
import { logInfo, logError } from "./logging.ts";

export function formatAnalysisResponse(analysisContent: any) {
  try {
    logInfo("Formatting analysis response");
    
    // Validate that we have the required data
    if (!analysisContent || typeof analysisContent !== 'object') {
      throw new Error("Invalid analysis content structure");
    }
    
    // Transform any non-standard property names to snake_case if needed
    const transformedAnalysis = {
      ...analysisContent,
      intelligence_score: analysisContent.intelligence_score || analysisContent.intelligenceScore || 0,
      emotional_intelligence_score: analysisContent.emotional_intelligence_score || 
                                   analysisContent.emotionalIntelligenceScore || 0,
      response_patterns: analysisContent.response_patterns || analysisContent.responsePatterns || {}
    };
    
    // Create the final response with the analysis data
    return new Response(
      JSON.stringify({
        success: true,
        status: 200,
        analysis: transformedAnalysis
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    logError("Error formatting analysis response", error);
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        message: `Error formatting analysis: ${error.message}`
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
