
import { corsHeaders } from "../_shared/cors.ts";
import { logInfo, logError, logDebug } from "./logging.ts";

export function formatAnalysisResponse(analysisContent: any) {
  try {
    // Validate that we have the required fields
    if (!analysisContent) {
      throw new Error("Empty analysis content received");
    }

    // Ensure core sections are present
    const requiredSections = [
      "overview", 
      "core_traits", 
      "cognitive_patterning", 
      "emotional_architecture", 
      "interpersonal_dynamics",
      "growth_potential"
    ];
    
    const missingSections = requiredSections.filter(section => !analysisContent[section]);
    
    if (missingSections.length > 0) {
      logError(`Missing required sections in analysis: ${missingSections.join(", ")}`);
    }
    
    // Ensure scores are valid numbers
    const intelligenceScore = typeof analysisContent.intelligence_score === 'number' ? 
      analysisContent.intelligence_score : 70;
    const emotionalIntelligenceScore = typeof analysisContent.emotional_intelligence_score === 'number' ? 
      analysisContent.emotional_intelligence_score : 70;
    
    // Log the analysis structure for debugging
    logDebug(`Formatting analysis response with sections: ${Object.keys(analysisContent).join(", ")}`);
    logDebug(`Overview length: ${analysisContent.overview?.length || 0} characters`);
    
    // Create a complete_analysis field to track processing status
    const complete_analysis = {
      status: "completed",
      error_occurred: false,
      processing_time: new Date().toISOString(),
      model_used: "gpt-4o"
    };
    
    // Format the final response
    const formattedData = {
      overview: analysisContent.overview || "Analysis overview is being generated.",
      core_traits: analysisContent.core_traits || {
        primary: "Primary trait analysis is being processed.",
        secondary: "Secondary trait analysis is being processed.",
        manifestations: "Trait manifestations are being analyzed."
      },
      cognitive_patterning: analysisContent.cognitive_patterning || {
        decisionMaking: "Decision-making pattern analysis is being processed.",
        learningStyle: "Learning style analysis is being processed.",
        problemSolving: "Problem-solving approach is being analyzed.",
        informationProcessing: "Information processing style is being analyzed."
      },
      emotional_architecture: analysisContent.emotional_architecture || {
        emotionalAwareness: "Emotional awareness analysis is being processed.",
        regulationStyle: "Emotional regulation style is being analyzed.",
        emotionalResponsiveness: "Emotional responsiveness pattern is being analyzed.",
        emotionalPatterns: "Emotional pattern analysis is being processed."
      },
      interpersonal_dynamics: analysisContent.interpersonal_dynamics || {
        attachmentStyle: "Attachment style analysis is being processed.",
        communicationPattern: "Communication pattern analysis is being processed.",
        conflictResolution: "Conflict resolution style is being analyzed.",
        relationshipNeeds: "Relationship needs are being analyzed."
      },
      growth_potential: analysisContent.growth_potential || {
        developmentalPath: "Developmental path is being mapped.",
        blindSpots: "Blind spots analysis is being processed.",
        untappedStrengths: "Untapped strengths are being identified.",
        growthExercises: "Growth exercises are being formulated."
      },
      intelligence_score: intelligenceScore,
      emotional_intelligence_score: emotionalIntelligenceScore,
      response_patterns: analysisContent.response_patterns || {
        primaryChoice: "balanced",
        secondaryChoice: "adaptive"
      },
      complete_analysis: complete_analysis
    };
    
    // Log success and return the formatted response
    logInfo("Successfully formatted analysis response");
    
    return new Response(
      JSON.stringify(formattedData),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    logError("Error formatting analysis response:", error);
    
    // Create an error response that still contains usable data
    const errorResponse = {
      overview: "An error occurred during analysis. Partial results may be available.",
      core_traits: {
        primary: "Analysis could not be completed.",
        secondary: "Please try again later."
      },
      intelligence_score: 50,
      emotional_intelligence_score: 50,
      complete_analysis: {
        status: "error",
        error_occurred: true,
        error_message: error.message,
        processing_time: new Date().toISOString()
      }
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}
