
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DeepInsightResponses } from "./types.ts";
import { generateDefaultScore, calculateSafeDomainScore } from "./scoring.ts";
import { getStringSafely, getArraySafely, generateOverview } from "./utils.ts";
import { callOpenAI, corsHeaders } from "./openai.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  console.log("Deep insight analysis function started");
  console.time("total-execution-time");
  
  try {
    const requestData = await req.json().catch(err => {
      console.error("Error parsing request JSON:", err);
      throw new Error("Invalid request format: " + err.message);
    });
    
    const { responses } = requestData;

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

    const formatted = Object.entries(responses)
      .map(([id, answer]) => `Q${id}: ${answer}`)
      .join("\n");

    console.log(`Processing ${Object.keys(responses).length} responses`);
    
    // Enhanced logging of response patterns
    console.log("Response distribution analysis:");
    const responseLengths = Object.values(responses).map(r => String(r).length);
    const avgLength = responseLengths.reduce((a, b) => a + b, 0) / responseLengths.length;
    console.log(`Average response length: ${avgLength}`);
    console.log(`Shortest response: ${Math.min(...responseLengths)}`);
    console.log(`Longest response: ${Math.max(...responseLengths)}`);
    
    // Log response length distribution
    const lengthDistribution = responseLengths.reduce((acc: Record<string, number>, len) => {
      const bracket = Math.floor(len / 50) * 50;
      acc[`${bracket}-${bracket + 50}`] = (acc[`${bracket}-${bracket + 50}`] || 0) + 1;
      return acc;
    }, {});
    console.log("Response length distribution:", lengthDistribution);

    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY environment variable not set");
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key not configured", 
          success: false 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Calling OpenAI API...");
    console.time("openai-call");
    
    try {
      // Let the edge function know we're starting a potentially long operation
      const openAIData = await callOpenAI(openAIApiKey, formatted);
      console.timeEnd("openai-call");
      
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
      console.log("OpenAI response received, length:", rawContent.length);
      
      try {
        console.time("analysis-processing");
        
        // Attempt to parse the JSON response
        let analysisContent;
        try {
          analysisContent = JSON.parse(rawContent);
        } catch (parseError) {
          console.error("Error parsing OpenAI JSON response:", parseError);
          console.error("Raw content sample (first 500 chars):", rawContent.substring(0, 500));
          
          // Try to extract valid JSON if possible (in case there's additional text)
          const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              console.log("Attempting to extract valid JSON from response");
              analysisContent = JSON.parse(jsonMatch[0]);
              console.log("Successfully extracted valid JSON");
            } catch (extractError) {
              console.error("Failed to extract valid JSON:", extractError);
              throw parseError; // Use original error if extraction fails
            }
          } else {
            throw parseError; // Re-throw if no JSON-like content found
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
        console.log("Analysis generated successfully with ID:", analysis.id);
        console.log("Analysis overview length:", analysis.overview?.length || 0);
        console.log("Career paths identified:", analysis.careerSummary.recommendedPaths.length);
        console.log("Core values identified:", analysis.motivationSummary.coreValues.length);
        console.log("Trait scores generated:", analysis.traitScores.length);
        
        console.timeEnd("total-execution-time");

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
      console.error("OpenAI API call failed:", openAIError);
      
      // More detailed error information for OpenAI-specific errors
      if (openAIError.message.includes("429")) {
        console.error("OpenAI rate limit exceeded or quota reached");
      } else if (openAIError.message.includes("401")) {
        console.error("OpenAI authentication error - check API key");
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Error calling OpenAI API", 
          message: openAIError.message,
          success: false 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (err) {
    console.error("Deep‑insight‑analysis critical error:", err);
    console.error("Error stack:", err.stack);
    
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
        fallback: true
      }), 
      { 
        status: 200,  // Return 200 so client doesn't error
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
