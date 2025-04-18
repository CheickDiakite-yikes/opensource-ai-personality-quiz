
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve }    from "https://deno.land/std@0.168.0/http/server.ts";
import { DeepInsightResponses } from "./types.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
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
      return json({ 
        error: "OpenAI API key is not configured or invalid", 
        success: false,
        message: "Server configuration error (API key missing)" 
      }, 500);
    }

    const { responses } = await req.json();
    if (!responses || Object.keys(responses).length === 0) {
      return json({ error: "No responses provided", success: false }, 400);
    }

    const formatted = Object.entries(responses)
      .map(([id, answer]) => `Q${id}: ${answer}`)
      .join("\n");

    /* ---------- 2a.  CALL OPENAI  ---------- */
    console.log(`Calling OpenAI API with ${Object.keys(responses).length} responses`);
    
    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using gpt-4o which is widely available
        max_tokens: 32000,
        temperature: 0.55,
        top_p: 1.0,
        frequency_penalty: 0.2,
        // stream: true,               // ← flip on when you want streaming
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
      
      // Specific error for API key issues
      if (errorText.includes("invalid_api_key") || errorText.includes("Incorrect API key")) {
        return json({ 
          error: "Invalid OpenAI API key", 
          success: false,
          message: "The OpenAI API key is invalid or has expired. Please update it in the Supabase dashboard." 
        }, 401);
      }
      
      throw new Error(`OpenAI API ${openAIRes.status}: ${errorText}`);
    }

    const { choices } = await openAIRes.json();
    const rawContent = choices?.[0]?.message?.content ?? "";
    const cleanJSON  = rawContent.replace(/```json|```/g, "").trim();
    
    try {
      const analysisContent = JSON.parse(cleanJSON);

      /* ---------- 3.  AUGMENT + RETURN  ---------- */
      const analysis = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        overview:
          `Based on your responses, you appear to be a ${analysisContent.coreTraits.primary} ` +
          `individual who ${analysisContent.cognitivePatterning.decisionMaking}. ` +
          `You combine ${analysisContent.coreTraits.secondary} with ` +
          `${analysisContent.emotionalArchitecture.empathicCapacity}.`,
        ...analysisContent,
        responsePatterns: analyzeResponsePatterns(responses),
        traits: [
          { trait: "Analytical Thinking",   score: 75, description: "Breaks down complex problems logically." },
          { trait: "Emotional Intelligence",score: 70, description: "Understands and regulates emotions well." },
          { trait: "Adaptability",          score: 80, description: "Adjusts swiftly to new situations." },
        ],
        intelligenceScore: 75,
        emotionalIntelligenceScore: 70,
      };

      return json({ analysis, success: true, message: "Analysis generated successfully" });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Raw content:", rawContent);
      return json({ 
        error: "Failed to parse AI response", 
        success: false,
        message: "The AI generated an invalid response format. Please try again."
      }, 500);
    }
  } catch (err) {
    console.error("Deep‑insight‑analysis error:", err);
    return json({ 
      error: err.message, 
      success: false, 
      message: "Failed to generate analysis. Please check Supabase logs for details."
    }, 500);
  }
});

/* ---------- 4.  HELPERS  ---------- */

/** Quick CORS‑aware JSON shortcut */
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Derives answer‑pattern stats for UI visualisations.
 */
function analyzeResponsePatterns(responses: DeepInsightResponses) {
  const counts = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 } as Record<string, number>;
  for (const ans of Object.values(responses)) {
    const key = ans.slice(-1);
    if (counts[key] !== undefined) counts[key]++;
  }
  const total = Object.values(responses).length;
  const pct = Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, Math.round((v / total) * 100)])
  ) as Record<string, number>;

  const ranked = Object.entries(pct).sort(([, a], [, b]) => b - a).map(([k]) => k);
  return {
    percentages: pct,
    primaryChoice: ranked[0],
    secondaryChoice: ranked[1],
    responseSignature: ranked.map((k) => pct[k]).join("-"),
  };
}

/* Optional: naïve token estimator if you later want to enforce budgets
import { encoding_for_model } from "https://deno.land/x/gpt_tokenizer/mod.ts";
function estimateTokens(str: string, model = "gpt-4o-128k") {
  return encoding_for_model(model).encode(str).length;
}
*/
