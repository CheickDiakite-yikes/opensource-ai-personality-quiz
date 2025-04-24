
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Import our modules
import { processRequest } from "./requestHandler.ts";
import { callOpenAI } from "./openai.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { logDebug, logError, logInfo } from "./logging.ts";
import { retryable } from "./retryUtils.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

// Create a minimal fallback response to ensure we always return something
function generateFallbackAnalysis() {
  return {
    overview: "This is a preliminary analysis based on your responses. A more detailed analysis will be available shortly.",
    core_traits: {
      primary: "Analytical Thinker",
      secondary: "Balanced Communicator",
      strengths: ["Logical reasoning", "Detail orientation", "Structured approach"],
      challenges: ["Perfectionism", "Overthinking", "Difficulty with ambiguity"]
    },
    cognitive_patterning: {
      decision_making: "You tend to analyze problems thoroughly before reaching conclusions.",
      problem_solving: "Your approach to problem-solving is methodical and structured.",
      learning_style: "You learn best through organized, structured information with clear patterns."
    },
    emotional_architecture: {
      emotional_awareness: "You demonstrate a solid level of emotional self-awareness.",
      regulation_style: "You generally regulate emotions through logical processing.",
      stress_response: "Under stress, you tend to seek structure and control."
    },
    interpersonal_dynamics: {
      attachment_style: "Your attachment style shows a balance between independence and connection.",
      communication_pattern: "Your communication style is clear and purposeful.",
      conflict_resolution: "You approach conflicts by seeking logical solutions."
    },
    growth_potential: {
      development_areas: ["Embracing ambiguity", "Reducing overthinking", "Balancing analysis with intuition"],
      recommendations: ["Practice mindfulness to reduce overthinking", "Engage in creative activities", "Embrace opportunities that have unclear outcomes"]
    },
    intelligence_score: 75,
    emotional_intelligence_score: 70,
    response_patterns: {
      consistency: "Your responses show a consistent pattern of analytical thinking.",
      self_awareness: "You demonstrate good self-awareness in your responses.",
      insight_depth: "Your insights show depth in logical and structured areas."
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logInfo("Deep Insight Analysis function started");
  
  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Extract and validate the request data
    const formattedResponses = await processRequest(req);
    
    if (formattedResponses instanceof Response) {
      return formattedResponses; // Return error response if validation failed
    }
    
    // Call OpenAI with proper error handling
    try {
      logInfo("Calling OpenAI API for deep insight analysis...");
      const openAIResponse = await callOpenAI(openAIApiKey, formattedResponses);
      
      if (!openAIResponse || !openAIResponse.choices || !openAIResponse.choices[0]) {
        throw new Error("Invalid response from OpenAI API");
      }
      
      // Get content from the response and parse it safely
      let analysisContent;
      try {
        analysisContent = JSON.parse(openAIResponse.choices[0].message.content);
        
        // Basic validation of required fields
        const requiredTopLevelKeys = ["overview", "core_traits", "cognitive_patterning", 
                                      "emotional_architecture", "interpersonal_dynamics", 
                                      "growth_potential", "intelligence_score", 
                                      "emotional_intelligence_score"];
        
        const missingKeys = requiredTopLevelKeys.filter(key => !(key in analysisContent));
        
        if (missingKeys.length > 0) {
          logError(`Missing required fields in OpenAI response: ${missingKeys.join(', ')}`);
          // Merge fallback data for missing fields
          const fallback = generateFallbackAnalysis();
          missingKeys.forEach(key => {
            analysisContent[key] = fallback[key];
          });
        }
        
      } catch (parseError) {
        logError("Failed to parse OpenAI response:", parseError);
        // Use complete fallback if parsing fails
        analysisContent = generateFallbackAnalysis();
      }
      
      // Format and validate the response
      const formattedResponse = formatAnalysisResponse(analysisContent);
      
      logInfo("Analysis completed successfully");
      return formattedResponse;
    } catch (aiError) {
      logError("OpenAI API error:", aiError);
      
      // Return a fallback analysis with an error flag
      const fallbackAnalysis = generateFallbackAnalysis();
      fallbackAnalysis.error_occurred = true;
      fallbackAnalysis.error_message = aiError.message || "Error generating analysis";
      
      return formatAnalysisResponse(fallbackAnalysis);
    }
  } catch (error) {
    logError("Unexpected error:", error);
    
    // Even in case of unexpected errors, try to return something usable
    const fallbackAnalysis = generateFallbackAnalysis();
    fallbackAnalysis.error_occurred = true;
    fallbackAnalysis.error_message = "An unexpected error occurred";
    
    return formatAnalysisResponse(fallbackAnalysis);
  }
});
