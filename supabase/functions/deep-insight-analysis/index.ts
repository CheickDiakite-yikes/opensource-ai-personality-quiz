
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { processRequest } from "./requestHandler.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { callOpenAI } from "./openai.ts";
import { logDebug, logError } from "./logging.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    console.log("Deep Insight Analysis function started");
    console.time("total-processing-time");
    
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      return createErrorResponse(
        new Error("OpenAI API key not configured"),
        500,
        "The AI service is not properly configured"
      );
    }

    const formatted = await processRequest(req);
    if (formatted instanceof Response) return formatted;
    
    console.log("Calling OpenAI API with proper error handling...");
    
    try {
      const openAIData = await callOpenAI(openAIApiKey, formatted);
      
      if (!openAIData || !openAIData.parsedContent) {
        console.error("Invalid OpenAI response structure:", JSON.stringify(openAIData));
        return createErrorResponse(
          new Error("Invalid response from OpenAI API"),
          500,
          "The AI returned an unexpected response structure"
        );
      }
      
      console.log("OpenAI response received with valid content");
      
      try {
        console.time("analysis-processing");
        
        // We can use the already parsed content from the enhanced handleOpenAIResponse
        const analysisContent = openAIData.parsedContent;
        
        // Verify we have a complete analysis
        if (!analysisContent || typeof analysisContent !== 'object') {
          throw new Error("Invalid analysis content structure");
        }
        
        // Check for required fields to ensure we have a complete analysis
        if (!analysisContent.overview || !analysisContent.core_traits) {
          console.warn("Analysis content is incomplete:", JSON.stringify({
            hasOverview: !!analysisContent.overview,
            hasCoreTraits: !!analysisContent.core_traits
          }));
        }
        
        console.timeEnd("analysis-processing");
        console.timeEnd("total-processing-time");
        
        return formatAnalysisResponse(analysisContent);
      } catch (parseError) {
        logError(parseError, "Error processing analysis content");
        return createErrorResponse(parseError, 500, "Error processing analysis results");
      }
    } catch (openAIError) {
      console.error("Error calling OpenAI:", openAIError);
      return createErrorResponse(openAIError, 502, "OpenAI API error");
    }
  } catch (err) {
    console.error("Deep‑insight‑analysis error:", err);
    return createErrorResponse(err, 500, "An unexpected error occurred");
  }
});
