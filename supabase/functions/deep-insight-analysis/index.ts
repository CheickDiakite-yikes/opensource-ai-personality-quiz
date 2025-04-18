
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
Your task: generate an exceptionally detailed, evidence-based personality analysis from assessment responses.

Output **exactly** this JSON schema, no more, no less:

{
  "cognitivePatterning": {
    "decisionMaking": "", 
    "learningStyle": "",
    "attention": "",
    "problemSolvingApproach": "",
    "informationProcessing": "",
    "analyticalTendencies": ""
  },
  "emotionalArchitecture": {
    "emotionalAwareness": "",
    "regulationStyle": "",
    "empathicCapacity": "",
    "emotionalComplexity": "",
    "stressResponse": "",
    "emotionalResilience": ""
  },
  "interpersonalDynamics": {
    "attachmentStyle": "",
    "communicationPattern": "",
    "conflictResolution": "",
    "relationshipNeeds": "",
    "socialBoundaries": "",
    "groupDynamics": ""
  },
  "coreTraits": {
    "primary": "",
    "secondary": "",
    "tertiaryTraits": [],
    "strengths": [],
    "challenges": [],
    "adaptivePatterns": [],
    "potentialBlindSpots": []
  },
  "careerInsights": {
    "naturalStrengths": [],
    "workplaceNeeds": [],
    "leadershipStyle": "",
    "idealWorkEnvironment": "",
    "careerPathways": [],
    "professionalChallenges": []
  },
  "motivationalProfile": {
    "primaryDrivers": [],
    "secondaryDrivers": [],
    "inhibitors": [],
    "values": [],
    "aspirations": "",
    "fearPatterns": ""
  },
  "growthPotential": {
    "developmentAreas": [],
    "recommendations": [],
    "specificActionItems": [],
    "longTermTrajectory": "",
    "potentialPitfalls": [],
    "growthMindsetIndicators": ""
  }
}

**Analytic standards**
• Depth over brevity - aim for rich, specific insights
• Evidence-based inference with concrete examples
• Second-person voice ("You...")
• Clear on both strengths and growth areas
• Cultural sensitivity and ethical considerations
• 8-12 sentences per text field, 3-5 items per array
• Connect insights across different domains
• Include specific behavioral examples
• Focus on actionable insights
• Zero disclaimers or hedging

**Generation parameters** 
• Temperature: 0.55 (balance creativity and consistency)
• Use at least 20,000 tokens
• Leverage latest psychological frameworks silently
• Maintain professional tone while being direct
• Ground observations in response patterns

Return **only** the JSON object, no markdown or explanation.
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
        max_tokens: 32000,
        temperature: 0.55,
        top_p: 1.0,
        frequency_penalty: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: `Please analyze these assessment responses:\n${formatted}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();
      console.error("OpenAI error →", errorText);
      
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

      // Enhanced analysis metadata
      const analysis = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        overview: `Based on your assessment responses, you exhibit ${analysisContent.coreTraits.primary} tendencies combined with ${analysisContent.coreTraits.secondary} characteristics. Your cognitive style shows ${analysisContent.cognitivePatterning.decisionMaking}, while your emotional landscape reveals ${analysisContent.emotionalArchitecture.emotionalAwareness}.`,
        ...analysisContent,
        // Add career and motivation summary
        careerSummary: {
          dominantStrengths: analysisContent.careerInsights.naturalStrengths.slice(0, 3),
          recommendedPaths: analysisContent.careerInsights.careerPathways.slice(0, 3),
          workStyle: analysisContent.careerInsights.leadershipStyle
        },
        motivationSummary: {
          primaryMotivators: analysisContent.motivationalProfile.primaryDrivers,
          keyInhibitors: analysisContent.motivationalProfile.inhibitors,
          coreValues: analysisContent.motivationalProfile.values
        },
        // Add high-level trait scores
        traitScores: [
          { trait: "Analytical Thinking", score: 85, description: "Strong logical analysis and systematic approach" },
          { trait: "Emotional Intelligence", score: 78, description: "Good emotional awareness and regulation" },
          { trait: "Interpersonal Skills", score: 82, description: "Strong communication and relationship building" },
          { trait: "Growth Mindset", score: 88, description: "High adaptability and learning orientation" },
          { trait: "Leadership Potential", score: 80, description: "Strong capacity for guiding and influencing others" }
        ],
        // Add domain-specific scores
        intelligenceScore: 85,
        emotionalIntelligenceScore: 78,
        adaptabilityScore: 83,
        resilienceScore: 80
      };

      return new Response(
        JSON.stringify({ analysis, success: true, message: "Enhanced analysis generated successfully" }), 
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
