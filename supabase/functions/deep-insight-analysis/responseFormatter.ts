
import { corsHeaders } from "../_shared/cors.ts";
import { logInfo, logError, logDebug } from "./logging.ts";

export function formatAnalysisResponse(analysisContent: any) {
  try {
    logInfo("Formatting analysis response");
    
    // Validate that we have the required data
    if (!analysisContent || typeof analysisContent !== 'object') {
      throw new Error("Invalid analysis content structure");
    }
    
    // Log what fields we actually received for debugging
    const receivedFields = Object.keys(analysisContent);
    logDebug(`Received fields in analysis: ${receivedFields.join(', ')}`);
    
    // Check if we have enough data for a meaningful response
    const hasMinimalData = analysisContent.overview || 
                           analysisContent.core_traits || 
                           analysisContent.intelligence_score || 
                           analysisContent.emotional_intelligence_score;
                           
    if (!hasMinimalData) {
      logError("Analysis is missing essential data", analysisContent);
    }
    
    // Add processing status if data seems incomplete
    const processingStatus = !hasMinimalData || !analysisContent.overview;
    
    // Transform any non-standard property names to snake_case if needed
    const transformedAnalysis = {
      ...analysisContent,
      intelligence_score: analysisContent.intelligence_score || analysisContent.intelligenceScore || 0,
      emotional_intelligence_score: analysisContent.emotional_intelligence_score || 
                                    analysisContent.emotionalIntelligenceScore || 0,
      response_patterns: analysisContent.response_patterns || analysisContent.responsePatterns || {},
      status: processingStatus ? "processing" : "complete"
    };
    
    // Create the final response with the analysis data
    return new Response(
      JSON.stringify({
        success: true,
        status: 200,
        analysis: transformedAnalysis,
        message: processingStatus ? "Analysis is being processed" : "Analysis is complete"
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
        message: `Error formatting analysis: ${error.message}`,
        analysis: {
          overview: "Analysis processing encountered a technical issue. Please try again.",
          status: "error"
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
