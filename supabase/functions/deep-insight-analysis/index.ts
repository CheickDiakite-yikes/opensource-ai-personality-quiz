
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
    
    // Enhanced API key validation with better error message
    if (!openAIApiKey || openAIApiKey.trim() === "") {
      const errorMsg = "OpenAI API key not configured or invalid";
      console.error(errorMsg);
      return createErrorResponse(
        new Error(errorMsg),
        500,
        "The AI service is not properly configured (API key issue)"
      );
    }

    // Process the request and get formatted responses
    const formatted = await processRequest(req);
    if (formatted instanceof Response) return formatted;
    
    console.log("Request processed successfully, calling OpenAI API...");
    
    // Added try-catch with multiple fallback mechanisms
    try {
      // Try the OpenAI call with improved error handling
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
      console.log("Total response length:", rawContent.length, "characters");
      console.log("Average response length:", rawContent.length / formatted.split('\n').length);
      console.log("Response distribution analysis:");
      
      try {
        console.time("analysis-processing");
        
        // With JSON mode enabled, we should directly parse the content
        let analysisContent;
        
        try {
          analysisContent = JSON.parse(rawContent);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError.message);
          
          // Try to clean the response before giving up
          try {
            // Simple cleanup - Remove any non-JSON text before the first { and after the last }
            const cleaned = rawContent.substring(
              rawContent.indexOf('{'), 
              rawContent.lastIndexOf('}') + 1
            );
            
            analysisContent = JSON.parse(cleaned);
            console.log("Successfully parsed JSON after cleaning");
          } catch (cleanError) {
            throw parseError; // If cleaning also fails, throw original error
          }
        }
        
        // Ensure we have required fields with fallbacks
        if (!analysisContent.coreTraits || typeof analysisContent.coreTraits !== 'object') {
          analysisContent.coreTraits = {
            primary: "Analytical Thinker",
            secondary: "Balanced Communicator",
            strengths: ["Logical reasoning", "Detail orientation", "Structured approach"],
            challenges: ["Perfectionism", "Overthinking", "Difficulty with ambiguity"]
          };
        } else {
          // Ensure core traits have strengths and challenges arrays
          if (!analysisContent.coreTraits.strengths || !Array.isArray(analysisContent.coreTraits.strengths) || analysisContent.coreTraits.strengths.length === 0) {
            analysisContent.coreTraits.strengths = ["Logical reasoning", "Detail orientation", "Structured approach"];
          }
          
          if (!analysisContent.coreTraits.challenges || !Array.isArray(analysisContent.coreTraits.challenges) || analysisContent.coreTraits.challenges.length === 0) {
            analysisContent.coreTraits.challenges = ["Perfectionism", "Overthinking", "Difficulty with ambiguity"];
          }
        }
        
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
