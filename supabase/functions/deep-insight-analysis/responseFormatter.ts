
import { corsHeaders } from "../_shared/cors.ts";
import { logInfo, logError, logDebug } from "./logging.ts";

export function formatAnalysisResponse(analysisContent: any) {
  try {
    // Validate that we have the required fields
    if (!analysisContent) {
      throw new Error("Empty analysis content received");
    }

    // Ensure core sections are present with safe defaults
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
      
      // Add placeholder data for missing sections
      missingSections.forEach(section => {
        if (section === "overview") {
          analysisContent.overview = "Analysis overview is still being processed.";
        } else {
          analysisContent[section] = {};
        }
      });
    }
    
    // Ensure scores are valid numbers
    const intelligenceScore = typeof analysisContent.intelligence_score === 'number' ? 
      analysisContent.intelligence_score : 70;
    const emotionalIntelligenceScore = typeof analysisContent.emotional_intelligence_score === 'number' ? 
      analysisContent.emotional_intelligence_score : 70;
    
    // Log the analysis structure for debugging
    logDebug(`Formatting analysis response with sections: ${Object.keys(analysisContent).join(", ")}`);
    logDebug(`Overview length: ${(analysisContent.overview || "").length} characters`);
    
    // Create a complete_analysis field to track processing status
    const complete_analysis = {
      status: "completed",
      error_occurred: false,
      processing_time: new Date().toISOString(),
      model_used: "gpt-4o"
    };
    
    // Safely access nested objects with fallbacks
    const core_traits = analysisContent.core_traits || {
      primary: "Analysis in progress",
      secondary: "Analysis in progress",
      manifestations: "Analysis in progress"
    };
    
    const cognitive_patterning = analysisContent.cognitive_patterning || {
      decisionMaking: "Analysis in progress",
      learningStyle: "Analysis in progress",
      problemSolving: "Analysis in progress",
      informationProcessing: "Analysis in progress"
    };
    
    const emotional_architecture = analysisContent.emotional_architecture || {
      emotionalAwareness: "Analysis in progress",
      regulationStyle: "Analysis in progress",
      emotionalResponsiveness: "Analysis in progress",
      emotionalPatterns: "Analysis in progress"
    };
    
    const interpersonal_dynamics = analysisContent.interpersonal_dynamics || {
      attachmentStyle: "Analysis in progress",
      communicationPattern: "Analysis in progress",
      conflictResolution: "Analysis in progress",
      relationshipNeeds: "Analysis in progress"
    };
    
    const growth_potential = analysisContent.growth_potential || {
      developmentalPath: "Analysis in progress",
      blindSpots: "Analysis in progress",
      untappedStrengths: "Analysis in progress",
      growthExercises: "Analysis in progress"
    };
    
    // Format the final response
    const formattedData = {
      overview: analysisContent.overview || "Analysis overview is being generated.",
      core_traits: {
        primary: core_traits.primary || "Primary trait analysis is being processed.",
        secondary: core_traits.secondary || "Secondary trait analysis is being processed.",
        manifestations: core_traits.manifestations || "Trait manifestations are being analyzed."
      },
      cognitive_patterning: {
        decisionMaking: cognitive_patterning.decisionMaking || "Decision-making pattern analysis is being processed.",
        learningStyle: cognitive_patterning.learningStyle || "Learning style analysis is being processed.",
        problemSolving: cognitive_patterning.problemSolving || "Problem-solving approach is being analyzed.",
        informationProcessing: cognitive_patterning.informationProcessing || "Information processing style is being analyzed."
      },
      emotional_architecture: {
        emotionalAwareness: emotional_architecture.emotionalAwareness || "Emotional awareness analysis is being processed.",
        regulationStyle: emotional_architecture.regulationStyle || "Emotional regulation style is being analyzed.",
        emotionalResponsiveness: emotional_architecture.emotionalResponsiveness || "Emotional responsiveness pattern is being analyzed.",
        emotionalPatterns: emotional_architecture.emotionalPatterns || "Emotional pattern analysis is being processed."
      },
      interpersonal_dynamics: {
        attachmentStyle: interpersonal_dynamics.attachmentStyle || "Attachment style analysis is being processed.",
        communicationPattern: interpersonal_dynamics.communicationPattern || "Communication pattern analysis is being processed.",
        conflictResolution: interpersonal_dynamics.conflictResolution || "Conflict resolution style is being analyzed.",
        relationshipNeeds: interpersonal_dynamics.relationshipNeeds || "Relationship needs are being analyzed."
      },
      growth_potential: {
        developmentalPath: growth_potential.developmentalPath || "Developmental path is being mapped.",
        blindSpots: growth_potential.blindSpots || "Blind spots analysis is being processed.",
        untappedStrengths: growth_potential.untappedStrengths || "Untapped strengths are being identified.",
        growthExercises: growth_potential.growthExercises || "Growth exercises are being formulated."
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
      cognitive_patterning: {
        decisionMaking: "Analysis incomplete",
        learningStyle: "Analysis incomplete",
        problemSolving: "Analysis incomplete",
        informationProcessing: "Analysis incomplete"
      },
      emotional_architecture: {
        emotionalAwareness: "Analysis incomplete",
        regulationStyle: "Analysis incomplete",
        emotionalResponsiveness: "Analysis incomplete",
        emotionalPatterns: "Analysis incomplete"
      },
      interpersonal_dynamics: {
        attachmentStyle: "Analysis incomplete",
        communicationPattern: "Analysis incomplete",
        conflictResolution: "Analysis incomplete",
        relationshipNeeds: "Analysis incomplete"
      },
      growth_potential: {
        developmentalPath: "Analysis incomplete",
        blindSpots: "Analysis incomplete",
        untappedStrengths: "Analysis incomplete",
        growthExercises: "Analysis incomplete"
      },
      intelligence_score: 50,
      emotional_intelligence_score: 50,
      complete_analysis: {
        status: "error",
        error_occurred: true,
        error_message: error instanceof Error ? error.message : "Unknown error",
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
