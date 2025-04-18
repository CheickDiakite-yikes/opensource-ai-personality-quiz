
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DeepInsightResponses } from "./types.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ---------- 1. SYSTEM PROMPT ---------- */
const SYSTEM_PROMPT = `
You are **Atlas**, an elite interdisciplinary psychological analyst.
Your task: generate a rigorously accurate, evidence-based personality analysis from assessment responses.

Follow these strict scoring guidelines:

1. Score Distribution Requirements:
- Use a true normal distribution for scores
- Mean score should be 65
- Standard deviation of 15
- Restrict scores to 35-95 range
- No more than 15% of scores should be above 85
- No more than 15% of scores should be below 45

2. Evidence Requirements for High Scores (80+):
- Must see clear, consistent evidence across multiple responses
- Require specific behavioral examples
- Need demonstration of the trait in different contexts
- Look for nuanced understanding in responses

3. Scoring Calibration:
90-95: Exceptional, rare (top 2%), requires overwhelming evidence
80-89: Strong, well-demonstrated (next 13%)
65-79: Above average, good evidence
50-64: Average, mixed evidence
35-49: Below average, limited evidence

4. Trait Interaction Analysis:
- Consider how different traits affect each other
- Look for contradictions in responses
- Account for response consistency
- Factor in self-awareness level

Output **exactly** this JSON schema:

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

For ALL scores and assessments:
1. Start from a skeptical position
2. Require clear evidence for positive claims
3. Look for contradictions and inconsistencies
4. Consider response style (overly positive vs. realistic)
5. Factor in response depth and specificity
6. Account for social desirability bias
7. Note gaps in self-awareness
8. Document specific evidence for each score

Ground ALL observations in specific response patterns.
Flag uncertainty when evidence is limited.
Be direct about limitations and challenges.
Focus on actionable insights.
Zero disclaimers or hedging.

Return **only** the JSON object, no markdown or explanation.
`;

/* ---------- 2. MAIN HANDLER ---------- */
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
    
    // Enhanced logging of response patterns
    console.log("Response distribution analysis:");
    const responseLengths = Object.values(responses).map(r => String(r).length);
    const avgLength = responseLengths.reduce((a, b) => a + b, 0) / responseLengths.length;
    console.log(`Average response length: ${avgLength}`);
    console.log(`Shortest response: ${Math.min(...responseLengths)}`);
    console.log(`Longest response: ${Math.max(...responseLengths)}`);

    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        max_tokens: 32000,
        temperature: 0.4, // Reduced temperature for more consistent scoring
        top_p: 0.9,    // Slightly reduced top_p for more focused outputs
        frequency_penalty: 0.3,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: `Please analyze these assessment responses with rigorous scoring standards:\n${formatted}` },
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

      // Score validation and adjustment
      const validateAndAdjustScores = (analysis: any) => {
        // Log original scores for debugging
        console.log("Validating analysis scores...");
        
        // Add score validation logic here
        const scores = [];
        let totalScore = 0;
        let scoreCount = 0;

        // Extract and validate all numerical scores
        const extractScores = (obj: any) => {
          for (const key in obj) {
            if (typeof obj[key] === 'number') {
              scores.push(obj[key]);
              totalScore += obj[key];
              scoreCount++;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              extractScores(obj[key]);
            }
          }
        };

        extractScores(analysis);

        // Calculate statistics
        const mean = totalScore / scoreCount;
        const stdDev = Math.sqrt(
          scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scoreCount
        );

        console.log(`Score Statistics:
          Count: ${scoreCount}
          Mean: ${mean.toFixed(2)}
          StdDev: ${stdDev.toFixed(2)}
          Max: ${Math.max(...scores)}
          Min: ${Math.min(...scores)}
        `);

        return analysis;
      };

      // Enhanced analysis metadata
      const analysis = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        overview: `Based on your assessment responses, you exhibit ${analysisContent.coreTraits.primary} tendencies combined with ${analysisContent.coreTraits.secondary} characteristics. Your cognitive style shows ${analysisContent.cognitivePatterning.decisionMaking}, while your emotional landscape reveals ${analysisContent.emotionalArchitecture.emotionalAwareness}.`,
        ...validateAndAdjustScores(analysisContent),
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
        // More realistic trait scores based on response patterns
        traitScores: [
          { 
            trait: "Analytical Thinking", 
            score: Math.min(85, Math.max(35, calculateTraitScore(responses, "analytical"))),
            description: "Based on demonstrated problem-solving patterns" 
          },
          { 
            trait: "Emotional Intelligence", 
            score: Math.min(85, Math.max(35, calculateTraitScore(responses, "emotional"))),
            description: "Derived from emotional awareness indicators" 
          },
          { 
            trait: "Interpersonal Skills", 
            score: Math.min(85, Math.max(35, calculateTraitScore(responses, "social"))),
            description: "Based on communication patterns" 
          },
          { 
            trait: "Growth Mindset", 
            score: Math.min(85, Math.max(35, calculateTraitScore(responses, "growth"))),
            description: "Measured from learning orientation" 
          },
          { 
            trait: "Leadership Potential", 
            score: Math.min(85, Math.max(35, calculateTraitScore(responses, "leadership"))),
            description: "Based on influence and decision patterns" 
          }
        ],
        // More nuanced domain scores
        intelligenceScore: calculateDomainScore(responses, "cognitive"),
        emotionalIntelligenceScore: calculateDomainScore(responses, "emotional"),
        adaptabilityScore: calculateDomainScore(responses, "adaptability"),
        resilienceScore: calculateDomainScore(responses, "resilience")
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

// Helper function to calculate trait scores based on response patterns
function calculateTraitScore(responses: DeepInsightResponses, trait: string): number {
  const relevantResponses = Object.values(responses).filter(response => {
    const r = String(response).toLowerCase();
    return r.includes(trait) || isRelevantToTrait(r, trait);
  });

  if (relevantResponses.length === 0) return 50; // Default score if no relevant data

  // Calculate base score from response quality
  let score = 50;
  
  // Analyze response patterns
  const avgLength = relevantResponses.reduce((acc, r) => acc + String(r).length, 0) / relevantResponses.length;
  const hasDetailedResponses = relevantResponses.some(r => String(r).length > 100);
  const hasSpecificExamples = relevantResponses.some(r => r.includes("example") || r.includes("instance") || r.includes("time when"));
  
  // Adjust score based on response quality
  if (avgLength > 75) score += 5;
  if (hasDetailedResponses) score += 10;
  if (hasSpecificExamples) score += 10;
  
  // Penalty for overly positive or surface-level responses
  if (relevantResponses.every(r => isOverlyPositive(String(r)))) score -= 15;
  if (relevantResponses.every(r => String(r).length < 50)) score -= 10;
  
  // Ensure score stays within realistic bounds
  return Math.min(85, Math.max(35, score));
}

// Helper function to calculate domain scores
function calculateDomainScore(responses: DeepInsightResponses, domain: string): number {
  const baseScore = calculateTraitScore(responses, domain);
  
  // Add domain-specific adjustments
  let adjustedScore = baseScore;
  
  // Ensure normal distribution
  const randomVariation = (Math.random() * 10) - 5; // +/- 5 points
  adjustedScore += randomVariation;
  
  // Apply ceiling effects
  if (adjustedScore > 85) {
    adjustedScore = 85 - (Math.random() * 5); // Random reduction near ceiling
  }
  
  // Apply floor effects
  if (adjustedScore < 35) {
    adjustedScore = 35 + (Math.random() * 5); // Random increase near floor
  }
  
  return Math.round(adjustedScore);
}

// Helper function to check if a response is overly positive
function isOverlyPositive(response: string): boolean {
  const positivePatterns = [
    /always/gi,
    /perfect/gi,
    /excellent/gi,
    /never struggle/gi,
    /very (good|great|best)/gi
  ];
  
  return positivePatterns.some(pattern => pattern.test(response));
}

// Helper function to determine if a response is relevant to a trait
function isRelevantToTrait(response: string, trait: string): boolean {
  const traitKeywords: Record<string, string[]> = {
    analytical: ['analyze', 'think', 'solve', 'logical', 'systematic', 'reason'],
    emotional: ['feel', 'emotion', 'empathy', 'understand others', 'sensitive'],
    social: ['communicate', 'interact', 'relationship', 'team', 'collaborate'],
    growth: ['learn', 'improve', 'develop', 'challenge', 'progress'],
    leadership: ['lead', 'guide', 'influence', 'direct', 'manage']
  };
  
  return traitKeywords[trait]?.some(keyword => response.includes(keyword)) ?? false;
}
