
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DeepInsightResponses } from "./types.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ---------- 1.  SYSTEM PROMPT  ---------- */
const SYSTEM_PROMPT = `
You are **Atlas**, an elite interdisciplinary psychological analyst.
Your task: turn a user's raw assessment answers into an *exceptionally detailed, brutally honest, yet respectful* report.

Output **exactly** this JSON schema, no more, no less, no re‑ordering:

{
  "cognitivePatterning": { "decisionMaking":"", "learningStyle":"", "attention":"" },
  "emotionalArchitecture": { "emotionalAwareness":"", "regulationStyle":"", "empathicCapacity":"" },
  "interpersonalDynamics": { "attachmentStyle":"", "communicationPattern":"", "conflictResolution":"" },
  "coreTraits": { "primary":"", "secondary":"", "strengths":[], "challenges":[] },
  "growthPotential": { "developmentAreas":[], "recommendations":[] }
}

**Analytic standards**
• Evidence‑based inference (hedge if weak).  
• Depth over fluff: ~8–10 sentences per string field, concrete daily‑life examples.  
• Second‑person voice ("You …").  
• Minimal sugar‑coating; clear on weaknesses while pushing the user to be better.  
• Leverage Big‑Five, CBT, attachment theory silently.  
• Cultural/gender sensitivity.  
• Exactly 3 items in each array.  
• No disclaimers/references.

**Generation budget**
You may use **up to 30000 tokens, nothing less than 14000** for the completion; aim for rich, nuanced detail throughout.

Return **only** the JSON object, no markdown.
`;

/* ---------- 2.  MAIN HANDLER  ---------- */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Validate API key presence
    if (!openAIApiKey || openAIApiKey.trim() === "") {
      console.error("OpenAI API key is missing or invalid");
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key is not configured", 
          success: false,
          message: "Server configuration error (API key missing)" 
        }), 
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    const reqBody = await req.json();
    const { responses } = reqBody;

    if (!responses || Object.keys(responses).length === 0) {
      return new Response(
        JSON.stringify({ error: "No responses provided", success: false }), 
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    const formatted = Object.entries(responses)
      .map(([id, answer]) => `Q${id}: ${answer}`)
      .join("\n");

    console.log(`Calling OpenAI API with ${Object.keys(responses).length} responses`);
    
    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        max_tokens: 16000,
        temperature: 0.55,
        top_p: 1.0,
        frequency_penalty: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: `Please analyse these assessment responses:\n${formatted}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();
      console.error("OpenAI error →", errorText);
      
      // Specific error handling for different types of API errors
      if (errorText.includes("invalid_api_key") || errorText.includes("Incorrect API key")) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid OpenAI API key", 
            success: false,
            message: "The OpenAI API key is invalid or has expired. Please update it in the Supabase dashboard." 
          }), 
          { 
            status: 401, 
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json" 
            } 
          }
        );
      }
      
      // Generic error handling for other API errors
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API Error", 
          success: false,
          message: `API request failed: ${errorText}` 
        }), 
        { 
          status: openAIRes.status, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    const { choices } = await openAIRes.json();
    const rawContent = choices?.[0]?.message?.content ?? "";
    const cleanJSON = rawContent.replace(/```json|```/g, "").trim();
    
    try {
      const analysisContent = JSON.parse(cleanJSON);

      // Enhanced analysis with additional metadata
      const analysis = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        overview:
          `Based on your responses, you appear to be a ${analysisContent.coreTraits.primary} ` +
          `individual who ${analysisContent.cognitivePatterning.decisionMaking}. ` +
          `You combine ${analysisContent.coreTraits.secondary} with ` +
          `${analysisContent.emotionalArchitecture.empathicCapacity}.`,
        ...analysisContent,
        traits: [
          { trait: "Analytical Thinking",   score: 75, description: "Breaks down complex problems logically." },
          { trait: "Emotional Intelligence",score: 70, description: "Understands and regulates emotions well." },
          { trait: "Adaptability",          score: 80, description: "Adjusts swiftly to new situations." },
        ],
        intelligenceScore: 75,
        emotionalIntelligenceScore: 70,
      };

      return new Response(
        JSON.stringify({ analysis, success: true, message: "Analysis generated successfully" }), 
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Raw content:", rawContent);
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse AI response", 
          success: false,
          message: "The AI generated an invalid response format. Please try again."
        }), 
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }
  } catch (err) {
    console.error("Deep‑insight‑analysis error:", err);
    return new Response(
      JSON.stringify({ 
        error: err.message, 
        success: false, 
        message: "Failed to generate analysis. Please check Supabase logs for details."
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
