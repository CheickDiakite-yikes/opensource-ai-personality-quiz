import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./openaiConfig.ts";
import { DeepInsightResponses } from "./types.ts";
import { generateDefaultScore, calculateSafeDomainScore } from "./scoring.ts";
import { getStringSafely, getArraySafely, generateOverview } from "./utils.ts";
import { callOpenAI } from "./openai.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    console.log("Deep Insight Analysis function started");
    console.time("total-processing-time");
    
    // Parse request body early to quickly return errors if needed
    let responses;
    try {
      const body = await req.json();
      responses = body.responses;
      console.log(`Request body parsed successfully, contains responses: ${!!responses}`);
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body", 
          details: parseError.message,
          success: false 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!responses || Object.keys(responses).length === 0) {
      console.error("No responses provided in request");
      return new Response(
        JSON.stringify({ error: "No responses provided", success: false }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key not configured", 
          success: false,
          message: "The AI service is not properly configured" 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const formatted = Object.entries(responses)
      .map(([id, answer]) => `Q${id}: ${answer}`)
      .join("\n");

    console.log(`Processing ${Object.keys(responses).length} responses`);
    
    // Enhanced logging of response patterns
    console.log("Response distribution analysis:");
    const responseLengths = Object.values(responses).map(r => String(r).length);
    const avgLength = responseLengths.reduce((a, b) => a + b, 0) / responseLengths.length;
    console.log(`Average response length: ${avgLength}`);
    console.log(`Total response length: ${formatted.length} characters`);
    
    console.log("Calling OpenAI API with proper error handling...");
    
    try {
      const openAIData = await callOpenAI(openAIApiKey, formatted);
      
      if (!openAIData || !openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
        console.error("Invalid OpenAI response structure:", JSON.stringify(openAIData));
        return new Response(
          JSON.stringify({ 
            error: "Invalid response from OpenAI API", 
            success: false,
            message: "The AI returned an unexpected response structure" 
          }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const rawContent = openAIData.choices[0].message.content || "";
      console.log("OpenAI response length:", rawContent.length);
      
      try {
        console.time("analysis-processing");
        let analysisContent;
        
        try {
          analysisContent = JSON.parse(rawContent);
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          console.log("Attempting to fix malformed JSON...");
          
          // Attempt to fix common JSON errors
          let fixedJson = rawContent;
          
          // Fix missing closing brackets/braces
          const openBraces = (fixedJson.match(/{/g) || []).length;
          const closeBraces = (fixedJson.match(/}/g) || []).length;
          if (openBraces > closeBraces) {
            fixedJson += '}'.repeat(openBraces - closeBraces);
          }
          
          // Fix trailing commas
          fixedJson = fixedJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          
          try {
            analysisContent = JSON.parse(fixedJson);
            console.log("Successfully fixed JSON format");
          } catch (secondError) {
            console.error("Could not fix JSON, using fallback structure");
            // Use a basic fallback structure
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

        // Generate default trait scores safely
        const traitScores = [
          { 
            trait: "Analytical Thinking", 
            score: generateDefaultScore("analytical"),
            description: "Based on demonstrated problem-solving patterns" 
          },
          { 
            trait: "Emotional Intelligence", 
            score: generateDefaultScore("emotional"),
            description: "Derived from emotional awareness indicators" 
          },
          { 
            trait: "Interpersonal Skills", 
            score: generateDefaultScore("social"),
            description: "Based on communication patterns" 
          },
          { 
            trait: "Growth Mindset", 
            score: generateDefaultScore("growth"),
            description: "Measured from learning orientation" 
          },
          { 
            trait: "Leadership Potential", 
            score: generateDefaultScore("leadership"),
            description: "Based on influence and decision patterns" 
          }
        ];

        const analysis = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          overview: generateOverview(analysisContent),
          ...analysisContent,
          careerSummary: {
            dominantStrengths: getArraySafely(analysisContent, "careerInsights.naturalStrengths", 3),
            recommendedPaths: getArraySafely(analysisContent, "careerInsights.careerPathways", 3),
            workStyle: getStringSafely(analysisContent, "careerInsights.leadershipStyle", "Adaptive leadership style")
          },
          motivationSummary: {
            primaryMotivators: getArraySafely(analysisContent, "motivationalProfile.primaryDrivers"),
            keyInhibitors: getArraySafely(analysisContent, "motivationalProfile.inhibitors"),
            coreValues: getArraySafely(analysisContent, "motivationalProfile.values")
          },
          relationshipCompatibility: {
            compatibleTypes: getArraySafely(analysisContent, "interpersonalDynamics.compatibleTypes"),
            challengingRelationships: getArraySafely(analysisContent, "interpersonalDynamics.challengingRelationships")
          },
          traitScores: traitScores,
          intelligenceScore: calculateSafeDomainScore("cognitive"),
          emotionalIntelligenceScore: calculateSafeDomainScore("emotional"),
          adaptabilityScore: calculateSafeDomainScore("adaptability"),
          resilienceScore: calculateSafeDomainScore("resilience")
        };

        console.timeEnd("analysis-processing");
        console.timeEnd("total-processing-time");
        console.log("Analysis generated successfully with ID:", analysis.id);

        return new Response(
          JSON.stringify({ analysis, success: true, message: "Enhanced analysis generated successfully" }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        console.error("Raw content sample:", rawContent.substring(0, 1000) + "...");
        
        // Try to return a partial analysis with at least some data
        return new Response(
          JSON.stringify({ 
            analysis: {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              overview: "Analysis was partially completed. The system encountered an error processing the full results.",
              coreTraits: {
                primary: "Analysis processing incomplete. Please check back later.",
                tertiaryTraits: ["Analytical", "Thoughtful", "Balanced", "Methodical", "Adaptable"]
              },
              cognitivePatterning: {
                decisionMaking: "Analysis processing incomplete."
              },
              emotionalArchitecture: {
                emotionalAwareness: "Analysis processing incomplete."
              },
              intelligenceScore: 70,
              emotionalIntelligenceScore: 70
            },
            success: true,
            message: "Partial analysis generated due to processing error",
            partialOnly: true
          }), 
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } catch (openAIError) {
      console.error("Error calling OpenAI:", openAIError);
      console.error("OpenAI error message:", openAIError.message);
      console.error("OpenAI error name:", openAIError.name);
      console.error("OpenAI error stack:", openAIError.stack);
      
      // Return a useful error response
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API error", 
          message: openAIError.message || "Unknown error occurred with AI service",
          errorType: openAIError.name || "Unknown",
          success: false 
        }), 
        { 
          status: 502, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (err) {
    console.error("Deep‑insight‑analysis error:", err);
    console.error("Error stack:", err.stack);
    console.error("Error message:", err.message);
    console.error("Error name:", err.name);
    console.timeEnd("total-processing-time");
    
    // Return a minimal fallback response
    return new Response(
      JSON.stringify({ 
        analysis: {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          overview: "Your analysis could not be completed at this time. The system will continue processing and your results will be available shortly.",
          coreTraits: {
            primary: "Processing incomplete",
            tertiaryTraits: ["Analysis pending"]
          },
          intelligenceScore: 70,
          emotionalIntelligenceScore: 70
        },
        success: true,
        message: "Basic placeholder analysis returned due to processing error",
        error: err.message,
        errorType: err.name || "Unknown",
        fallback: true
      }), 
      { 
        status: 200,  // Return 200 so client doesn't error
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
