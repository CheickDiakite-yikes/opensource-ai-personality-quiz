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

// Function to clean and parse JSON that might contain markdown formatting
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

    // Generate analysis using OpenAI with MAX DETAIL
    const systemPrompt = `
      You are a world-class expert in psychometrics and personalized psychological profiling.
      Your mission: create the deepest, most comprehensive, insightful profile *possible* based on the given responses.

      CRITICALLY IMPORTANT REQUIREMENTS:
      - Use maximum rich detail for each and every field. NEVER use short/generic phrases.
      - Every section (cognitivePatterning, emotionalArchitecture, etc) must contain FULL paragraph-length, nuanced, evidence-based analysis with specific behavioral examples and interconnections.
      - Identify both unique strengths and potential blind spots, always using specific examples from the user's answers.
      - For arrays (strengths, challenges, values, career suggestions, etc): provide *at least 5-7 deeply specific items*, NEVER generic (“good communication skills”)—each item should reflect a unique aspect of the user's personality and style.
      - "coreTraits.tertiaryTraits" must contain at least 10 significant, distinct, and interconnected trait labels, and elaborate on their real-life implications.
      - Interlink insights between all areas (for example, show how emotional complexity influences problem solving, etc).
      - Avoid ALL “Barnum statements.” Every description must be so individualized that it could NOT apply to everyone. Cite and reference answer patterns.
      - In “growthPotential”, provide at least 5–7 actionable recommendations and specific action items, grounded in the user's pattern, with behavioral evidence and relevant context.
      - “careerInsights” must offer concrete, realistic career directions WITH custom explanation for why each fits their answers.
      - DO NOT skip any required property in the JSON schema—fill EVERYTHING with fully formed analysis (strings or arrays), no placeholders, no "[insert here]" tags.
      - FINAL CHECK: Your JSON must contain at least 1000 words of actual content (it’s ok if most is in analysis fields/arrays), and EVERY array must be fully populated as described.
      - OUTPUT ONLY raw, valid JSON using strict double quotes. DO NOT include any code blocks, markdown, or explanation text before or after. It must be directly parseable.

      // SCHEMA TO FOLLOW EXACTLY:
      {
        "cognitivePatterning": {
          "decisionMaking": "string",
          "learningStyle": "string",
          "attention": "string", 
          "problemSolvingApproach": "string",
          "informationProcessing": "string",
          "analyticalTendencies": "string"
        },
        "emotionalArchitecture": {
          "emotionalAwareness": "string",
          "regulationStyle": "string",
          "empathicCapacity": "string",
          "emotionalComplexity": "string",
          "stressResponse": "string", 
          "emotionalResilience": "string"
        },
        "interpersonalDynamics": {
          "attachmentStyle": "string",
          "communicationPattern": "string",
          "conflictResolution": "string",
          "relationshipNeeds": "string",
          "socialBoundaries": "string",
          "groupDynamics": "string",
          "compatibilityProfile": "string",
          "compatibleTypes": ["string"],
          "challengingRelationships": ["string"]
        },
        "coreTraits": {
          "primary": "string",
          "secondary": "string",
          "tertiaryTraits": ["string"],
          "strengths": ["string"],
          "challenges": ["string"],
          "adaptivePatterns": ["string"],
          "potentialBlindSpots": ["string"]
        },
        "careerInsights": {
          "naturalStrengths": ["string"],
          "workplaceNeeds": ["string"],
          "leadershipStyle": "string",
          "idealWorkEnvironment": "string",
          "careerPathways": ["string"],
          "professionalChallenges": ["string"],
          "potentialRoles": ["string"]
        },
        "motivationalProfile": {
          "primaryDrivers": ["string"],
          "secondaryDrivers": ["string"],
          "inhibitors": ["string"],
          "values": ["string"],
          "aspirations": "string",
          "fearPatterns": "string"
        },
        "growthPotential": {
          "developmentAreas": ["string"],
          "recommendations": ["string"],
          "specificActionItems": ["string"],
          "longTermTrajectory": "string",
          "potentialPitfalls": ["string"],
          "growthMindsetIndicators": "string"
        }
      }
      // END OF SCHEMA
    `;

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

    const openAiResult = await analysisResponse.json();
    const analysisContent = openAiResult.choices[0].message.content;
    
    console.log("[BigMe] Analysis generated, parsing JSON...");

    // Parse the JSON response with better error handling
    let analysisJson;
    try {
      analysisJson = cleanAndParseJSON(analysisContent);
      console.log("[BigMe] Successfully parsed deep JSON");
    } catch (e) {
      console.error("[BigMe] Failed to parse JSON, using fallback. Content:", analysisContent);
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
