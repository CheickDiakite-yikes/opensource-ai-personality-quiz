
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
      console.log("OpenAI response received with length:", rawContent.length);
      
      try {
        console.time("analysis-processing");
        
        // Extract JSON from the raw content
        console.log("Extracting and cleaning JSON from response...");
        let jsonString = rawContent;
        
        // First, check if response contains markdown JSON blocks and extract just the JSON
        if (jsonString.includes("```json")) {
          console.log("Removing markdown JSON code blocks...");
          const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1].trim();
          } else {
            // Try without the "json" language specifier
            const basicMatch = jsonString.match(/```\s*([\s\S]*?)\s*```/);
            if (basicMatch && basicMatch[1]) {
              jsonString = basicMatch[1].trim();
            }
          }
        }
        
        console.log("Starting JSON cleanup process...");
        console.log("JSON sample before cleanup (first 100 chars):", jsonString.substring(0, 100));
        
        // Very aggressive JSON cleaning that handles multiple issues
        // 1. Replace single-quoted property names with double quotes
        jsonString = jsonString.replace(/'([^']+?)'\s*:/g, '"$1":');
        
        // 2. Replace unquoted property names with double quotes (handles alphanumeric and underscores)
        jsonString = jsonString.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
        
        // 3. Replace single-quoted string values with double quotes (avoiding apostrophes in words)
        jsonString = jsonString.replace(/:\s*'([^']*)'/g, ': "$1"');
        
        // 4. Fix trailing commas before closing braces and brackets
        jsonString = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        
        // 5. Balance missing brackets if needed
        const openBraces = (jsonString.match(/{/g) || []).length;
        const closeBraces = (jsonString.match(/}/g) || []).length;
        if (openBraces > closeBraces) {
          jsonString += '}'.repeat(openBraces - closeBraces);
        }
        
        // 6. Fix NaN, undefined and other JavaScript values not valid in JSON
        jsonString = jsonString
          .replace(/:\s*undefined/g, ': null')
          .replace(/:\s*NaN/g, ': null')
          .replace(/:\s*Infinity/g, ': null');
        
        console.log("JSON sample after cleanup (first 100 chars):", jsonString.substring(0, 100));
        
        let analysisContent;
        try {
          analysisContent = JSON.parse(jsonString);
          console.log("Successfully parsed JSON without errors");
        } catch (jsonError) {
          console.error("Initial JSON parsing error:", jsonError);
          
          // Try an even more aggressive approach as a last resort
          console.log("Attempting final JSON recovery...");
          
          // Try to find a valid JSON object by looking for an object that starts with { and ends with }
          const possibleJsonMatch = rawContent.match(/{[\s\S]*}/);
          if (possibleJsonMatch) {
            let lastResortJson = possibleJsonMatch[0];
            
            // Apply the same cleanups as before
            lastResortJson = lastResortJson.replace(/'([^']+?)'\s*:/g, '"$1":');
            lastResortJson = lastResortJson.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
            lastResortJson = lastResortJson.replace(/:\s*'([^']*)'/g, ': "$1"');
            lastResortJson = lastResortJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
            
            try {
              analysisContent = JSON.parse(lastResortJson);
              console.log("JSON recovered using last resort approach");
            } catch (finalError) {
              console.error("All JSON parsing attempts failed:", finalError);
              
              // Create an emergency fallback object when all parsing attempts fail
              analysisContent = {
                cognitivePatterning: { 
                  decisionMaking: "Analysis unavailable due to technical issues",
                  learningStyle: "Please try again later"
                },
                emotionalArchitecture: { 
                  emotionalAwareness: "Analysis generation encountered errors" 
                },
                coreTraits: { 
                  primary: "Analysis results unavailable",
                  tertiaryTraits: ["Retry analysis recommended"]
                }
              };
            }
          } else {
            // Complete fallback if no JSON-like structure found
            analysisContent = {
              cognitivePatterning: { decisionMaking: "Analysis unavailable due to formatting issues" },
              emotionalArchitecture: { emotionalAwareness: "Analysis unavailable due to formatting issues" },
              coreTraits: { 
                primary: "Could not process analysis", 
                tertiaryTraits: ["Please try again later"] 
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
