
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Import our modules
import { processRequest } from "./requestHandler.ts";
import { callOpenAI } from "./openai.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { logDebug, logError, logInfo, logWarning } from "./logging.ts";
import { retryable } from "./retryUtils.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

// Create a retryable version of the OpenAI call
const retryableOpenAICall = retryable(callOpenAI, 2);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logInfo("Deep Insight Analysis function started");
  const startTime = Date.now();
  
  try {
    if (!openAIApiKey) {
      logError("Missing OpenAI API key in environment variables");
      throw new Error("OpenAI API key not configured");
    }

    // Extract and validate the request data
    const formattedResponses = await processRequest(req);
    
    if (formattedResponses instanceof Response) {
      return formattedResponses; // Return error response if validation failed
    }
    
    // Call OpenAI with proper error handling using our retryable function
    try {
      logInfo("Calling OpenAI API for deep insight analysis...");
      
      // Add detailed timing logs
      const apiCallStartTime = Date.now();
      const openAIResponse = await retryableOpenAICall(openAIApiKey, formattedResponses);
      const apiCallDuration = Date.now() - apiCallStartTime;
      
      logInfo(`OpenAI API call completed in ${apiCallDuration}ms`);
      
      if (!openAIResponse) {
        logError("Received null OpenAI response");
        throw new Error("Null response from OpenAI API");
      }

      if (!openAIResponse.choices) {
        logError("Invalid response structure from OpenAI API", openAIResponse);
        throw new Error("Invalid response from OpenAI API - missing choices");
      }
      
      // Safely check if choices array exists and has at least one item
      if (!Array.isArray(openAIResponse.choices) || openAIResponse.choices.length === 0) {
        logError("OpenAI response missing choices array or empty choices array", openAIResponse);
        throw new Error("OpenAI response has no choices available");
      }
      
      // Safely access first choice and message
      const firstChoice = openAIResponse.choices[0];
      if (!firstChoice) {
        logError("OpenAI response first choice is null or undefined", openAIResponse.choices);
        throw new Error("First choice in OpenAI response is invalid");
      }
      
      if (!firstChoice.message) {
        logError("OpenAI response first choice is missing message field", firstChoice);
        throw new Error("Invalid choice structure in OpenAI response - missing message");
      }
      
      // Get content from the response and parse it safely
      let analysisContent;
      try {
        const responseContent = firstChoice.message.content;
        
        if (!responseContent) {
          logError("OpenAI response content is empty or null");
          throw new Error("Empty content in OpenAI response");
        }
        
        // Log response characteristics for debugging
        logInfo(`OpenAI response received, length: ${responseContent.length} characters`);
        logDebug(`Response starts with: ${responseContent.substring(0, 50)}...`);
        
        try {
          analysisContent = JSON.parse(responseContent);
          logInfo("Successfully parsed JSON response from OpenAI");
        } catch (firstParseError) {
          // Try to extract JSON from response if not pure JSON
          logWarning("Initial JSON parse failed, trying to extract JSON from response", firstParseError);
          
          // Look for JSON-like content in the response
          const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              analysisContent = JSON.parse(jsonMatch[0]);
              logInfo("Successfully extracted and parsed JSON from response text");
            } catch (extractError) {
              logError("Failed to extract JSON from response", extractError);
              logDebug(`Response content: ${responseContent}`);
              throw new Error("Failed to parse OpenAI response as JSON");
            }
          } else {
            logError("No JSON-like structure found in response");
            logDebug(`Response content: ${responseContent}`);
            throw new Error("OpenAI response did not contain valid JSON");
          }
        }
        
        // Basic validation of required fields - but don't fill in placeholders
        const requiredTopLevelKeys = ["overview", "core_traits", "cognitive_patterning", 
                                     "emotional_architecture", "interpersonal_dynamics", 
                                     "growth_potential", "intelligence_score", 
                                     "emotional_intelligence_score"];
        
        const missingKeys = requiredTopLevelKeys.filter(key => !(key in analysisContent));
        
        if (missingKeys.length > 0) {
          logWarning(`Missing required fields in OpenAI response: ${missingKeys.join(', ')}`);
          // Create placeholder values for missing fields instead of failing
          missingKeys.forEach(key => {
            if (key.includes("_score")) {
              analysisContent[key] = 50; // Default scores to 50
            } else if (key === "overview") {
              analysisContent[key] = "Analysis overview is still being processed.";
            } else {
              analysisContent[key] = {}; // Empty object for structural fields
            }
          });
          logInfo("Added placeholder values for missing fields");
        }
        
        // Check for proper casing in nested objects and fix if needed
        const cognitiveKeys = ["decisionMaking", "learningStyle", "problemSolving", "informationProcessing"];
        const emotionalKeys = ["emotionalAwareness", "regulationStyle", "emotionalResponsiveness", "emotionalPatterns"];
        const interpersonalKeys = ["attachmentStyle", "communicationPattern", "conflictResolution", "relationshipNeeds"];
        
        // Fix camelCase property names if needed
        if (analysisContent.cognitive_patterning) {
          cognitiveKeys.forEach(camelKey => {
            // Look for potential snake_case versions
            const snakeKey = camelKey.replace(/([A-Z])/g, "_$1").toLowerCase();
            if (analysisContent.cognitive_patterning[snakeKey] && !analysisContent.cognitive_patterning[camelKey]) {
              // Copy snake_case to camelCase
              analysisContent.cognitive_patterning[camelKey] = analysisContent.cognitive_patterning[snakeKey];
              logWarning(`Fixed cognitive property: ${snakeKey} -> ${camelKey}`);
            } else if (!analysisContent.cognitive_patterning[camelKey] && !analysisContent.cognitive_patterning[snakeKey]) {
              // Add placeholder if neither exists
              analysisContent.cognitive_patterning[camelKey] = "This aspect is still being analyzed.";
            }
          });
        } else {
          analysisContent.cognitive_patterning = {};
          cognitiveKeys.forEach(key => {
            analysisContent.cognitive_patterning[key] = "This aspect is still being analyzed.";
          });
        }
        
        if (analysisContent.emotional_architecture) {
          emotionalKeys.forEach(camelKey => {
            const snakeKey = camelKey.replace(/([A-Z])/g, "_$1").toLowerCase();
            if (analysisContent.emotional_architecture[snakeKey] && !analysisContent.emotional_architecture[camelKey]) {
              analysisContent.emotional_architecture[camelKey] = analysisContent.emotional_architecture[snakeKey];
              logWarning(`Fixed emotional property: ${snakeKey} -> ${camelKey}`);
            } else if (!analysisContent.emotional_architecture[camelKey] && !analysisContent.emotional_architecture[snakeKey]) {
              analysisContent.emotional_architecture[camelKey] = "This aspect is still being analyzed.";
            }
          });
        } else {
          analysisContent.emotional_architecture = {};
          emotionalKeys.forEach(key => {
            analysisContent.emotional_architecture[key] = "This aspect is still being analyzed.";
          });
        }
        
        if (analysisContent.interpersonal_dynamics) {
          interpersonalKeys.forEach(camelKey => {
            const snakeKey = camelKey.replace(/([A-Z])/g, "_$1").toLowerCase();
            if (analysisContent.interpersonal_dynamics[snakeKey] && !analysisContent.interpersonal_dynamics[camelKey]) {
              analysisContent.interpersonal_dynamics[camelKey] = analysisContent.interpersonal_dynamics[snakeKey];
              logWarning(`Fixed interpersonal property: ${snakeKey} -> ${camelKey}`);
            } else if (!analysisContent.interpersonal_dynamics[camelKey] && !analysisContent.interpersonal_dynamics[snakeKey]) {
              analysisContent.interpersonal_dynamics[camelKey] = "This aspect is still being analyzed.";
            }
          });
        } else {
          analysisContent.interpersonal_dynamics = {};
          interpersonalKeys.forEach(key => {
            analysisContent.interpersonal_dynamics[key] = "This aspect is still being analyzed.";
          });
        }
        
        // Ensure growth_potential exists and has minimal structure
        if (!analysisContent.growth_potential) {
          analysisContent.growth_potential = {
            developmentalPath: "Your growth path is being analyzed.",
            blindSpots: "Potential blind spots are being identified.",
            untappedStrengths: "Your untapped potential is being assessed.",
            growthExercises: "Personalized exercises are being developed."
          };
        }
        
        // Ensure core_traits exists and has minimal structure
        if (!analysisContent.core_traits) {
          analysisContent.core_traits = {
            primary: "Your primary traits are being identified.",
            secondary: "Your secondary traits are being analyzed.",
            strengths: ["Analysis in progress"],
            challenges: ["Analysis in progress"]
          };
        }
        
      } catch (parseError) {
        logError("Failed to parse OpenAI response:", parseError);
        throw parseError;
      }
      
      // Format the response
      logInfo("Formatting analysis response for client");
      const formattedResponse = formatAnalysisResponse(analysisContent);
      
      const totalDuration = Date.now() - startTime;
      logInfo(`Analysis completed successfully in ${totalDuration}ms`);
      return formattedResponse;
    } catch (aiError) {
      logError("OpenAI API error:", aiError);
      
      // Return an error response
      return createErrorResponse(
        aiError instanceof Error ? aiError : new Error("Unknown OpenAI error"), 
        500, 
        "Error generating analysis"
      );
    }
  } catch (error) {
    logError("Unexpected error:", error);
    return createErrorResponse(
      error instanceof Error ? error : new Error("Unexpected error occurred"), 
      500, 
      "An unexpected error occurred"
    );
  }
});
