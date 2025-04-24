
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
      
      // Ensure these objects exist to prevent NULL values in database
      core_traits: analysisContent.core_traits || {
        primary: "Analytical Thinker",
        secondary: "Balanced Communicator",
        strengths: ["Logical reasoning", "Detail orientation"],
        challenges: ["May overthink", "Perfectionist tendencies"]
      },
      cognitive_patterning: analysisContent.cognitive_patterning || {
        decisionMaking: "You take a thoughtful approach to decisions, considering multiple factors.",
        learningStyle: "You learn best through structured, logical information."
      },
      emotional_architecture: analysisContent.emotional_architecture || {
        emotionalAwareness: "You have a balanced awareness of your emotions.",
        regulationStyle: "You tend to process emotions through logical analysis."
      },
      interpersonal_dynamics: analysisContent.interpersonal_dynamics || {
        attachmentStyle: "You value independence while maintaining meaningful connections.",
        communicationPattern: "Your communication style is clear and precise."
      },
      growth_potential: analysisContent.growth_potential || {
        developmentAreas: ["Balance between analysis and action"],
        recommendations: ["Practice mindfulness to reduce overthinking"]
      }
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
    
    // Even in case of error, return a structured response with default values
    const fallbackAnalysis = {
      overview: "We encountered an issue processing your analysis. Some results may be preliminary.",
      core_traits: {
        primary: "Analytical Thinker",
        secondary: "Balanced Communicator",
        strengths: ["Logical reasoning", "Detail orientation"],
        challenges: ["May overthink", "Perfectionist tendencies"]
      },
      cognitive_patterning: {
        decisionMaking: "You take a thoughtful approach to decisions.",
        learningStyle: "You learn best through structured information."
      },
      emotional_architecture: {
        emotionalAwareness: "You have a balanced awareness of your emotions.",
        regulationStyle: "You tend to process emotions analytically."
      },
      interpersonal_dynamics: {
        attachmentStyle: "You value independence while maintaining connections.",
        communicationPattern: "Your communication is clear and precise."
      },
      growth_potential: {
        developmentAreas: ["Balance between analysis and action"],
        recommendations: ["Practice mindfulness techniques"]
      },
      intelligence_score: 70,
      emotional_intelligence_score: 70,
      error_occurred: true,
      error_message: error instanceof Error ? error.message : "Unknown error formatting analysis"
    };
    
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        message: `Error formatting analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
        analysis: fallbackAnalysis
      }),
      {
        status: 200, // Still return 200 to allow partial results to be shown
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
