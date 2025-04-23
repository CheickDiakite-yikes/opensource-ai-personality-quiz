
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { processRequest } from "./requestHandler.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { callOpenAI } from "./openai.ts";
import { logDebug, logError, logInfo } from "./logging.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Extract and validate the request data
    const requestData = await processRequest(req);
    
    // Call OpenAI with proper error handling
    try {
      logInfo("Calling OpenAI API for deep insight analysis...");
      const openAIResponse = await callOpenAI(openAIApiKey, requestData);
      
      // Format and validate the response
      const formattedResponse = await formatAnalysisResponse(openAIResponse);
      
      logInfo("Analysis completed successfully");
      return new Response(JSON.stringify(formattedResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (aiError) {
      logError("OpenAI API error:", aiError);
      return createErrorResponse(aiError, 502, "Error generating analysis");
    }
  } catch (error) {
    logError("Unexpected error:", error);
    return createErrorResponse(error, 500, "An unexpected error occurred");
  }
});
