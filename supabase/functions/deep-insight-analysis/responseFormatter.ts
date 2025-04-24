
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
      response_patterns: analysisContent.response_patterns || analysisContent.responsePatterns || {},
      // Ensure these properties exist
      error_occurred: analysisContent.error_occurred !== undefined ? analysisContent.error_occurred : false,
      error_message: analysisContent.error_message || null,
      
      // If any core objects don't exist, mark as error rather than providing placeholders
      core_traits: analysisContent.core_traits || null,
      cognitive_patterning: analysisContent.cognitive_patterning || null,
      emotional_architecture: analysisContent.emotional_architecture || null,
      interpersonal_dynamics: analysisContent.interpersonal_dynamics || null,
      growth_potential: analysisContent.growth_potential || null
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
        message: `Error formatting analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
        analysis: {
          error_occurred: true,
          error_message: error instanceof Error ? error.message : "Unknown error formatting analysis"
        }
      }),
      {
        status: 200, // Still return 200 to allow results to be shown
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
