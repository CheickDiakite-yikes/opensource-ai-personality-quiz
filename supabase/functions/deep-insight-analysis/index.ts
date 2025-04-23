
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { processRequest } from "./requestHandler.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { callOpenAI } from "./openai.ts";
import { logDebug, logError, logInfo, createPerformanceTracker } from "./logging.ts";
import { validateResponseStructure } from "./utils.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const requestId = crypto.randomUUID();
    logInfo(`Deep Insight Analysis request started`, { requestId });
    const totalTimer = createPerformanceTracker("Total request processing time");
    
    // Validate OpenAI API key configuration
    if (!openAIApiKey) {
      logError(new Error("OpenAI API key not configured"), "Configuration");
      return createErrorResponse(
        new Error("OpenAI API key not configured"),
        500,
        "The AI service is not properly configured"
      );
    }

    // Process and validate the incoming request
    const requestTimer = createPerformanceTracker("Request processing");
    const formatted = await processRequest(req);
    requestTimer.end();
    
    if (formatted instanceof Response) return formatted;
    
    // Call OpenAI with proper error handling
    try {
      const aiTimer = createPerformanceTracker("AI processing");
      logInfo("Calling OpenAI API...");
      
      const openAIData = await callOpenAI(openAIApiKey, formatted);
      aiTimer.end();
      
      if (!openAIData || !openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
        logError(new Error("Invalid OpenAI response structure"), "Response validation");
        return createErrorResponse(
          new Error("Invalid response from OpenAI API"),
          500,
          "The AI returned an unexpected response structure"
        );
      }
      
      const rawContent = openAIData.choices[0].message.content || "";
      logInfo("OpenAI response received", { 
        contentLength: rawContent.length,
        model: openAIData.model,
        finishReason: openAIData.choices[0].finish_reason,
        fallback: openAIData._meta?.fallback || false
      });
      
      // Parse and validate the content
      try {
        const validationTimer = createPerformanceTracker("Analysis validation");
        
        // With JSON mode enabled, we can directly parse the content
        const analysisContent = JSON.parse(rawContent);
        
        // Validate that the content has the expected structure
        if (!validateResponseStructure(analysisContent)) {
          logError(new Error("Invalid analysis structure"), "Structure validation");
          throw new Error("OpenAI response does not match expected analysis structure");
        }
        
        validationTimer.end();
        totalTimer.end();
        
        logInfo("Analysis completed successfully", { 
          requestId,
          contentSize: rawContent.length,
          processingTime: totalTimer.end() 
        });
        
        // Format the final response
        return formatAnalysisResponse(analysisContent);
      } catch (parseError) {
        logError(parseError, "Error parsing OpenAI response");
        return createErrorResponse(parseError, 500, "Error processing analysis results");
      }
    } catch (openAIError) {
      logError(openAIError, "Error calling OpenAI");
      return createErrorResponse(openAIError, 502, "OpenAI API error");
    }
  } catch (err) {
    logError(err, "Unexpected error");
    return createErrorResponse(err, 500, "An unexpected error occurred");
  }
});
