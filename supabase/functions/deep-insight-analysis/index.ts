
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { processRequest } from "./requestHandler.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { callOpenAI } from "./openai.ts";
import { logDebug, logError } from "./logging.ts";
import { generateDefaultAnalysis } from "./defaultAnalysis.ts";

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
      
      if (!openAIData || !openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
        console.error("Invalid OpenAI response structure:", JSON.stringify(openAIData));
        
        // Use default analysis instead of failing
        console.log("Using default analysis due to invalid OpenAI response");
        const defaultAnalysis = generateDefaultAnalysis(formatted);
        return formatAnalysisResponse(defaultAnalysis);
      }
      
      const rawContent = openAIData.choices[0].message.content || "";
      console.log("OpenAI response received with length:", rawContent.length);
      
      try {
        console.time("analysis-processing");
        
        // With JSON mode enabled, we can directly parse the content
        const analysisContent = JSON.parse(rawContent);
        
        console.timeEnd("analysis-processing");
        console.timeEnd("total-processing-time");
        
        return formatAnalysisResponse(analysisContent);
      } catch (parseError) {
        logError(parseError, "Error parsing OpenAI response");
        
        // Use default analysis instead of failing
        console.log("Using default analysis due to JSON parsing error");
        const defaultAnalysis = generateDefaultAnalysis(formatted);
        return formatAnalysisResponse(defaultAnalysis);
      }
    } catch (openAIError) {
      console.error("Error calling OpenAI:", openAIError);
      
      // Use default analysis instead of failing
      console.log("Using default analysis due to OpenAI API error");
      const defaultAnalysis = generateDefaultAnalysis(formatted);
      return formatAnalysisResponse(defaultAnalysis);
    }
  } catch (err) {
    console.error("Deep‑insight‑analysis error:", err);
    
    // Always return something usable, never fail completely
    try {
      console.log("Creating emergency fallback analysis");
      const emergencyAnalysis = generateDefaultAnalysis("emergency fallback");
      return formatAnalysisResponse(emergencyAnalysis);
    } catch (finalError) {
      return createErrorResponse(finalError, 500, "An unexpected error occurred");
    }
  }
});
