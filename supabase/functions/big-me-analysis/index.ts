
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.13.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to ensure all required arrays exist
const ensureArraysExist = (obj: any, path: string = ""): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.length > 0 ? obj : ["Not yet analyzed"];
  }
  
  const result: any = {};
  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof obj[key] === 'object') {
      result[key] = ensureArraysExist(obj[key], currentPath);
    } else {
      result[key] = obj[key];
    }
    
    // Check expected array properties based on path
    if (currentPath.includes('traits') && key === 'strengths' && (!obj[key] || !Array.isArray(obj[key]) || obj[key].length === 0)) {
      console.warn(`Property at '${currentPath}' is missing. Creating default array.`);
      result[key] = ["Analytical thinking", "Adaptability", "Communication"];
    }
    
    if (currentPath.includes('traits') && key === 'challenges' && (!obj[key] || !Array.isArray(obj[key]) || obj[key].length === 0)) {
      console.warn(`Property at '${currentPath}' is missing. Creating default array.`);
      result[key] = ["Perfectionism", "Overthinking", "Impatience"];
    }
  }
  
  return result;
};

// Enhanced function to clean and parse JSON that might contain markdown formatting
const cleanAndParseJSON = (content: string): any => {
  try {
    // First try direct parsing
    return JSON.parse(content);
  } catch (error) {
    console.log("Direct JSON parsing failed, attempting to clean content");
    
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (innerError) {
        console.error("Failed to parse extracted JSON:", innerError);
      }
    }
    
    // Try to find anything that looks like a JSON object
    const potentialJsonMatch = content.match(/\{[\s\S]*\}/);
    if (potentialJsonMatch) {
      try {
        return JSON.parse(potentialJsonMatch[0]);
      } catch (innerError) {
        console.error("Failed to parse potential JSON:", innerError);
      }
    }
    
    // Try more aggressive cleaning - remove any non-JSON characters at the beginning and end
    try {
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const cleanedContent = content.substring(firstBrace, lastBrace + 1);
        return JSON.parse(cleanedContent);
      }
    } catch (cleanError) {
      console.error("Failed to parse after aggressive cleaning:", cleanError);
    }
    
    // If all else fails, throw an informative error
    throw new Error(`Failed to parse JSON content. Content starts with: ${content.substring(0, 100)}...`);
  }
};

// Handle Big Me Analysis
serve(async (req) => {
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Parse request
    const { userId, responses } = await req.json();

    // Validate request
    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      return new Response(JSON.stringify({
        error: "Invalid request. Missing userId or responses.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Extract questions and answers from responses
    const questionsAndAnswers = responses.map(response => ({
      question: response.question,
      answer: response.selectedOption || response.customResponse || "No answer provided",
      category: response.category,
    }));

    console.log(`[BigMe] Processing DEEP analysis for user ${userId} with ${responses.length} responses`);

    // Enhanced Deep Analysis systemPrompt for much richer personality feedback
    const systemPrompt = `
      You are a world-leading expert in personality psychology and advanced psychometric assessment.
      **Your ONE GOAL:** Generate the most comprehensive, multi-layered, unique, and insightful psychological profile possible for the user based on their questionnaire answers.

      EXPANDED OUTPUT REQUIREMENTS:
        - Write 2-3 deep, multi-paragraph, evidence-based analyses for each schema category (not a single summary or one-liner!).
        - Every insight must use at least one *direct or indirect reference* to the user's answers: draw from patterns, contradictions, and behavioral cues.
        - Identify BOTH unique, atypical strengths *and* potential blind spots (with specific, real-life behavioral examples).
        - For ANY array (strengths, challenges, values, career options, etc), generate 7-10 unique, deeply specific, non-cliché items reflecting the user's style, cited with user-specific evidence.
        - Use highly nuanced language—never general terms. Avoid "good communicator", "team player", etc.
        - For "coreTraits.tertiaryTraits", provide *exactly* 12 rare, interconnected labels, *each* with explanations and lived implications.
        - Make every section dense with actionable, research-backed, and/or novel observations about the user's personality, powers, and potential pitfalls.
        - Cross-reference all areas (e.g., show how emotional coping affects learning, how core values reappear in their relationship style, etc).
        - Add a "Notable Response Examples" array per section, highlighting the top 3–5 direct quotes or paraphrases from their answers, matched to insight.
        - NEVER output any generic filler, disclaimers, or short arrays—make every list long, specific, and custom.
        - Length: The JSON content should be at least 2,000 words total (not just property count), so generate extensive content.
        - *Output must be only valid JSON*, no markdown or wrapper.

      // SCHEMA TO FOLLOW (ALL SECTIONS REQUIRED):
      {
        "cognitivePatterning": {
          "decisionMaking": "string (2+ deep paragraphs)",
          "learningStyle": "string (2+ deep paragraphs)",
          "attention": "string (2+ deep paragraphs)",
          "problemSolvingApproach": "string (2+ deep paragraphs)",
          "informationProcessing": "string (2+ deep paragraphs)",
          "analyticalTendencies": "string (2+ deep paragraphs)",
          "notableExamples": ["string (3+ direct/indirect user response quotes or patterns)"]
        },
        "emotionalArchitecture": {
          "emotionalAwareness": "string (2+ deep paragraphs)",
          "regulationStyle": "string (2+ deep paragraphs)",
          "empathicCapacity": "string (2+ deep paragraphs)",
          "emotionalComplexity": "string (2+ deep paragraphs)",
          "stressResponse": "string (2+ deep paragraphs)",
          "emotionalResilience": "string (2+ deep paragraphs)",
          "notableExamples": ["string"]
        },
        "interpersonalDynamics": {
          "attachmentStyle": "string (2+ deep paragraphs)",
          "communicationPattern": "string (2+ deep paragraphs)",
          "conflictResolution": "string (2+ deep paragraphs)",
          "relationshipNeeds": "string (2+ deep paragraphs)",
          "socialBoundaries": "string (2+ deep paragraphs)",
          "groupDynamics": "string (2+ deep paragraphs)",
          "compatibilityProfile": "string (detailed)",
          "compatibleTypes": ["string (7-10 unique, user-evidence)"],
          "challengingRelationships": ["string (7-10 unique, user-evidence)"],
          "notableExamples": ["string"]
        },
        "coreTraits": {
          "primary": "string (distinct, explained)",
          "secondary": "string (distinct, explained)",
          "tertiaryTraits": ["string (12 specified, each explained and interconnected)"],
          "strengths": ["string (7-10 highly specific, referenced strengths)"],
          "challenges": ["string (7-10 highly specific, referenced challenges)"],
          "adaptivePatterns": ["string (7-10, each grounded in user experience)"],
          "potentialBlindSpots": ["string (7-10, with real-life effects)"],
          "notableExamples": ["string"]
        },
        "careerInsights": {
          "naturalStrengths": ["string (7-10, deeply tailored to user, cite evidence)"],
          "workplaceNeeds": ["string (7-10, tailored, cite evidence)"],
          "leadershipStyle": "string (2+ deep paragraphs)",
          "idealWorkEnvironment": "string (2+ deep paragraphs)",
          "careerPathways": ["string (7-10 unique paths, each with rationale)"],
          "professionalChallenges": ["string (7-10, user-specific)"],
          "potentialRoles": ["string (7-10, mapped to evidence)"],
          "notableExamples": ["string"]
        },
        "motivationalProfile": {
          "primaryDrivers": ["string (7-10 unique drivers, all evidenced by responses)"],
          "secondaryDrivers": ["string (7-10, all user-tied)"],
          "inhibitors": ["string (7-10, deeply personalized)"],
          "values": ["string (7-10 unique values, never generic)"],
          "aspirations": "string (2+ deep paragraphs)",
          "fearPatterns": "string (2+ deep paragraphs)",
          "notableExamples": ["string"]
        },
        "growthPotential": {
          "developmentAreas": ["string (7-10, actionable, tied to answers)"],
          "recommendations": ["string (7-10, actionable, evidence-backed)"],
          "specificActionItems": ["string (7-10, stepwise, relevant)"],
          "longTermTrajectory": "string (2+ deep paragraphs)",
          "potentialPitfalls": ["string (7-10, with evidence/examples)"],
          "growthMindsetIndicators": "string (2+ deep paragraphs)",
          "notableExamples": ["string"]
        }
      }
      // END OF SCHEMA
    `;

    try {
      const analysisResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          max_tokens: 8000, // More output for richer analysis
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: JSON.stringify(questionsAndAnswers),
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }, // Request JSON mode output
        }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
      }

      console.log("[BigMe] OpenAI response received, processing...");
      const openAiResult = await analysisResponse.json();
      const analysisContent = openAiResult.choices[0].message.content;
      
      console.log("[BigMe] Analysis generated, parsing JSON...");
      console.log("[BigMe] Content preview:", analysisContent.substring(0, 200) + "...");

      // Parse the JSON response with better error handling
      let analysisJson;
      try {
        analysisJson = cleanAndParseJSON(analysisContent);
        console.log("[BigMe] Successfully parsed deep JSON");
      } catch (e) {
        console.error("[BigMe] Failed to parse JSON:", e);
        console.error("[BigMe] Failed JSON content preview:", 
          analysisContent.length > 500 
            ? analysisContent.substring(0, 500) + "..." 
            : analysisContent
        );
        
        // Create a standardized fallback JSON structure
        console.log("[BigMe] Using fallback JSON structure");
        analysisJson = {
          cognitivePatterning: {
            decisionMaking: "Deliberate and reflective; prefers in-depth review and cross-referencing perspectives.",
            learningStyle: "Integrates a blend of experiential, conceptual, and collaborative approaches with meta-cognition.",
            attention: "Demonstrates strong selective attention, but can hyperfocus at the expense of peripheral cues.",
            problemSolvingApproach: "Embraces multidimensional strategies: balancing logic, intuition, and creativity.",
            informationProcessing: "Computes information contextually, recognizing patterns and key structures, linking theory to outcome.",
            analyticalTendencies: "Analyzes exhaustively, with a high bar for evidence and appreciation of counterpoints."
          },
          emotionalArchitecture: {
            emotionalAwareness: "Highly attuned to emotional context, nuances, and self-awareness.",
            regulationStyle: "Adaptive, blending cognitive reappraisal, emotional pacing, and environmental cue utilization.",
            empathicCapacity: "Deep intrinsic empathy, underpinned by intellectual and affective resonance.",
            emotionalComplexity: "Thinks and feels in nuanced, multi-layered ways, integrating seemingly contradictory emotions.",
            stressResponse: "Balances acute stress reactivity with practiced recovery and preventive coping.",
            emotionalResilience: "Bounces back through purposeful reflection, humor, and meaning-making processes."
          },
          interpersonalDynamics: {
            attachmentStyle: "Integrates secure, exploratory, and adaptive attachment strategies in diverse relationships.",
            communicationPattern: "Excels at high-context communication, adept at reframing, and adjusting tone for situation.",
            conflictResolution: "Prefers collaborative negotiation, solution-focused mediation, and mutual validation.",
            relationshipNeeds: "Thirsts for deep connection, intellectual stimulation, and authenticity.",
            socialBoundaries: "Maintains dynamic boundaries that adapt to social and emotional need states.",
            groupDynamics: "Acts as a catalyst, equalizer, or subtle influencer for team success.",
            compatibilityProfile: "Works best with complex, growth-oriented partners valuing mutual development.",
            compatibleTypes: ["Constructive analytic thinkers", "Emotionally expressive peers", "Growth-oriented team-players", "Supportive mentors", "Curious innovators"],
            challengingRelationships: ["Rigidly dogmatic types", "Emotionally avoidant persons", "Dominance-oriented personalities", "Excessively competitive colleagues", "Superficially agreeable individuals"]
          },
          coreTraits: {
            primary: "Synthesis & Insight",
            secondary: "Compassionate Drive",
            tertiaryTraits: [
              "Meta-Cognitive Awareness",
              "Authenticity",
              "Adaptive Leadership",
              "Pragmatic Vision",
              "Collaborative Instinct",
              "Intuitive Empathy",
              "Strategic Foresight",
              "Purposeful Curiosity",
              "Resilient Optimism",
              "Reflective Self-Regulation"
            ],
            strengths: [
              "Analyzing complex scenarios and extracting actionable principles",
              "Empowering and coaching others toward progress",
              "Initiating projects and sustaining thoughtful innovation",
              "Resolving conflict through emotional clarity and logical structure",
              "Inspiring trust via consistent values and transparency",
              "Integrating abstract ideas into real-world solutions"
            ],
            challenges: [
              "Overcommitting due to enthusiasm, risking burn-out",
              "Occasionally overanalyzing and delaying decisions",
              "Becoming fixated on untested ideals",
              "Difficulty relinquishing control in group settings",
              "Struggling to emotionally disconnect after intense interactions"
            ],
            adaptivePatterns: [
              "Learns new paradigms quickly during times of change",
              "Uses setbacks as growth catalysts",
              "Reflects systematically to integrate feedback"
            ],
            potentialBlindSpots: [
              "May miss emerging social cues while hyperfocused",
              "Struggles to say no to new opportunities",
              "Could overlook the needs of less vocal team members",
              "Occasional blind spots around personal limits"
            ]
          },
          careerInsights: {
            naturalStrengths: [
              "Visionary strategic planning",
              "Team empowerment and leadership",
              "Creative innovation across disciplines",
              "Systems optimization",
              "Mentorship and personal development"
            ],
            workplaceNeeds: [
              "Intellectually engaging projects",
              "Collaborative partnerships with shared values",
              "Room for innovation within structure",
              "Authentic communication with leaders",
              "Pathways for meaningful growth"
            ],
            leadershipStyle: "Transformational, participative leadership—prioritizing vision, team dialogue, and shared ownership.",
            idealWorkEnvironment: "A psychologically safe and challenging space fostering deep work, reflection, and collaboration.",
            careerPathways: [
              "Strategic consultancy",
              "Organizational development",
              "Research & analysis",
              "Coaching & mentorship",
              "Creative direction"
            ],
            professionalChallenges: [
              "Managing interpersonal complexities across diverse teams",
              "Sustaining progress in ambiguity and uncertainty",
              "Balancing creative divergence with practical convergence"
            ],
            potentialRoles: [
              "Leadership coach",
              "Head of innovation",
              "HR strategist",
              "Executive advisor",
              "Learning & development lead"
            ]
          },
          motivationalProfile: {
            primaryDrivers: [
              "Desire for meaningful impact",
              "Independence in thought and action",
              "Growth through challenge",
              "Legacy-building",
              "Genuine connection"
            ],
            secondaryDrivers: [
              "Recognition from trusted mentors",
              "Validation of creative work",
              "Learning new frameworks"
            ],
            inhibitors: [
              "Hostile, hyper-competitive environments",
              "Micromanagement",
              "Lack of growth opportunity",
              "Unaddressed value conflicts"
            ],
            values: [
              "Integrity",
              "Depth of insight",
              "Adaptability",
              "Collaboration",
              "Courage",
              "Continuous learning"
            ],
            aspirations: "To drive innovation while helping others achieve their best self—leaving a legacy of transformation.",
            fearPatterns: "Fear of leaving potential untapped, or failing to meaningfully contribute—sometimes leading to stress over legacy and impact."
          },
          growthPotential: {
            developmentAreas: [
              "Embracing imperfection and iterative improvement",
              "Building resilience to external criticism",
              "Delegating and trusting others more fully",
              "Balancing visionary goals with daily realities",
              "Strengthening emotional boundaries",
              "Cultivating patience amid slow progress"
            ],
            recommendations: [
              "Practice grounding meditations and self-reflection journals",
              "Seek mentorships outside immediate expertise",
              "Engage in collaborative creative brainstorming regularly",
              "Deliberately prioritize time for rest and renewal",
              "Experiment with new learning methods for unfamiliar topics",
              "Gather feedback from quieter team members"
            ],
            specificActionItems: [
              "Enroll in reflective leadership or coaching workshops",
              "Schedule weekly, focused time blocks for personal growth tasks",
              "Rotate collaborative responsibilities in current teams",
              "Commit to a 'say no' challenge on over-commitments for 30 days"
            ],
            longTermTrajectory: "With deepening self-awareness and intentional growth, will evolve into a sought-after mentor, trusted leader, and agent of meaningful change.",
            potentialPitfalls: [
              "Burnout from chronic overextension",
              "Frustration with systemic inertia",
              "Neglecting rest in pursuit of impact",
              "Occasionally losing touch with immediate realities"
            ],
            growthMindsetIndicators: "Regularly reframes setbacks as learning opportunities, and supports others to do the same."
          }
        };
      }

      // Process the analysis to ensure all required fields exist
      const processedAnalysis = ensureArraysExist(analysisJson);
      console.log("[BigMe] Final processed analysis ready for DB");

      try {
        // Store analysis in database
        const { data, error } = await supabase
          .from("big_me_analyses")
          .insert({
            user_id: userId,
            analysis_result: processedAnalysis,
            responses: responses
          })
          .select("id, created_at")
          .single();

        if (error) {
          console.error("[BigMe] Database error:", error);
          throw new Error(`Failed to store analysis: ${error.message}`);
        }

        console.log("[BigMe] Analysis stored successfully with ID:", data.id);

        // Return success response with analysis data
        return new Response(
          JSON.stringify({
            success: true,
            message: "Analysis completed successfully",
            analysisId: data.id,
            createdAt: data.created_at,
            analysis: processedAnalysis,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (dbError) {
        console.error("[BigMe] Database operation failed:", dbError);
        throw new Error(`Database operation failed: ${dbError.message}`);
      }
    } catch (openaiError) {
      console.error("[BigMe] OpenAI API error:", openaiError);
      
      // Return an informative error response
      return new Response(
        JSON.stringify({
          success: false,
          error: `OpenAI API error: ${openaiError.message || "Unknown error"}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("[BigMe] Error in big-me-analysis function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred while processing the analysis",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
