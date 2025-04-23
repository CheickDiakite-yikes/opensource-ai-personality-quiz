
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Import our modules
import { processRequest } from "./requestHandler.ts";
import { callOpenAI } from "./openai.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { logDebug, logError, logInfo } from "./logging.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

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
      
      // Get content from the response
      const analysisContent = JSON.parse(openAIResponse.choices[0].message.content);
      
      // Format and validate the response
      const formattedResponse = formatAnalysisResponse(analysisContent);
      
      logInfo("Analysis completed successfully");
      return formattedResponse;
    } catch (aiError) {
      logError("OpenAI API error:", aiError);
      return createErrorResponse(aiError, 502, "Error generating analysis");
    }
  } catch (error) {
    logError("Unexpected error:", error);
    return createErrorResponse(error, 500, "An unexpected error occurred");
  }
});
