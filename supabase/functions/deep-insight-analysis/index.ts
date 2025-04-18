
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { processRequest } from "./requestHandler.ts";
import { formatAnalysisResponse } from "./responseFormatter.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { callOpenAI } from "./openai.ts";

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
        return createErrorResponse(
          new Error("Invalid response from OpenAI API"),
          500,
          "The AI returned an unexpected response structure"
        );
      }
      
      const rawContent = openAIData.choices[0].message.content || "";
      console.log("OpenAI response length:", rawContent.length);
      
      try {
        console.time("analysis-processing");
        let analysisContent;
        
        try {
          // First, clean any markdown formatting from the raw content
          let cleanedJson = rawContent;
          
          console.log("Beginning JSON cleaning process");
          
          // Check if the response is wrapped in markdown code blocks
          if (cleanedJson.includes("```json") || cleanedJson.includes("```")) {
            console.log("Detected markdown in JSON response, cleaning...");
            
            // Remove markdown code block indicators
            cleanedJson = cleanedJson.replace(/```json\s*/g, "");
            cleanedJson = cleanedJson.replace(/```\s*/g, "");
          }
          
          // Trim any whitespace
          cleanedJson = cleanedJson.trim();
          
          // Fix property names that aren't double-quoted (single quotes or no quotes)
          // This regex finds property names that either:
          // 1. Start with a letter/underscore followed by word chars and a colon
          // 2. Have single quotes around property names
          cleanedJson = cleanedJson.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
          cleanedJson = cleanedJson.replace(/'([^']+)'\s*:/g, '"$1":');
          
          console.log("Cleaned JSON. First 200 chars:", cleanedJson.substring(0, 200));
          
          // Now try to parse the cleaned JSON
          analysisContent = JSON.parse(cleanedJson);
          console.log("Successfully parsed JSON without errors");
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          console.log("Attempting to fix malformed JSON...");
          
          // Log the raw content to help with debugging
          console.log("Raw content snippet (first 200 chars):", rawContent.substring(0, 200));
          
          // More aggressive attempt to fix common JSON errors
          let fixedJson = rawContent;
          
          // Remove markdown code block indicators
          fixedJson = fixedJson.replace(/```json\s*/g, "");
          fixedJson = fixedJson.replace(/```\s*/g, "");
          
          // Convert single quotes to double quotes for strings, but be careful with apostrophes
          // This is a complex operation and might not catch all cases
          fixedJson = fixedJson.replace(/'([^']*)'(\s*:)/g, '"$1"$2');
          
          // Fix unquoted property names 
          fixedJson = fixedJson.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
          
          // Fix single quoted property values
          fixedJson = fixedJson.replace(/:\s*'([^']*)'/g, ': "$1"');
          
          // Fix missing closing brackets/braces
          const openBraces = (fixedJson.match(/{/g) || []).length;
          const closeBraces = (fixedJson.match(/}/g) || []).length;
          if (openBraces > closeBraces) {
            fixedJson += '}'.repeat(openBraces - closeBraces);
          }
          
          // Fix trailing commas
          fixedJson = fixedJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          
          console.log("Attempted to fix JSON. First 200 chars:", fixedJson.substring(0, 200));
          
          try {
            analysisContent = JSON.parse(fixedJson);
            console.log("Successfully fixed JSON format");
          } catch (secondError) {
            console.error("Could not fix JSON, using fallback structure");
            analysisContent = {
              cognitivePatterning: { decisionMaking: "Analysis unavailable due to formatting issues" },
              emotionalArchitecture: { emotionalAwareness: "Analysis unavailable due to formatting issues" },
              coreTraits: { 
                primary: "Could not fully process analysis", 
                tertiaryTraits: ["Analytical", "Thoughtful", "Detail-oriented"] 
              }
            };
          }
        }

        console.timeEnd("analysis-processing");
        console.timeEnd("total-processing-time");
        
        return formatAnalysisResponse(analysisContent);

      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
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
