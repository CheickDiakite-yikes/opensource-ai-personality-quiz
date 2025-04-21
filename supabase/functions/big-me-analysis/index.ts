
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

// Enhanced function to clean and parse JSON that might contain markdown formatting
const cleanAndParseJSON = (content: string): any => {
  try {
    // First try direct parsing
    return JSON.parse(content);
  } catch (error) {
    console.log("Direct JSON parsing failed, attempting to clean content");
    
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try to find anything that looks like a JSON object
      const potentialJsonMatch = content.match(/\{[\s\S]*\}/);
      if (potentialJsonMatch) {
        return JSON.parse(potentialJsonMatch[0]);
      }
      
      // Try more aggressive cleaning - remove any non-JSON characters at the beginning and end
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const cleanedContent = content.substring(firstBrace, lastBrace + 1);
        return JSON.parse(cleanedContent);
      }
    } catch (cleanError) {
      console.error("Failed to parse after cleaning:", cleanError);
    }
    
    // If all else fails, throw an informative error
    throw new Error(`Failed to parse JSON content. Content starts with: ${content.substring(0, 100)}...`);
  }
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

// Create a simpler default analysis when the AI fails
const createDefaultAnalysis = () => {
  return {
    cognitivePatterning: {
      decisionMaking: "Balanced approach combining logical analysis and intuition.",
      learningStyle: "Versatile learner who adapts to different educational contexts.",
      attention: "Focused with ability to sustain concentration on important tasks.",
      problemSolvingApproach: "Methodical problem-solver who breaks down complex issues.",
      informationProcessing: "Processes information thoroughly before making decisions.",
      analyticalTendencies: "Strong critical thinking skills and attention to detail.",
      notableExamples: ["Shows careful consideration in responses", "Demonstrates analytical depth"]
    },
    emotionalArchitecture: {
      emotionalAwareness: "Good understanding of personal emotional states and triggers.",
      regulationStyle: "Balanced emotional regulation with healthy coping mechanisms.",
      empathicCapacity: "Strong ability to understand others' perspectives and feelings.",
      emotionalComplexity: "Recognizes and navigates the nuances of different emotions.",
      stressResponse: "Handles stress through problem-solving and seeking support.",
      emotionalResilience: "Recovers well from setbacks and learns from challenges.",
      notableExamples: ["Shows empathetic understanding", "Demonstrates emotional awareness"]
    },
    interpersonalDynamics: {
      attachmentStyle: "Secure attachment style with healthy relationship expectations.",
      communicationPattern: "Clear communicator who values honesty and transparency.",
      conflictResolution: "Seeks collaborative solutions that address all parties' concerns.",
      relationshipNeeds: "Values authentic connections and mutual growth in relationships.",
      socialBoundaries: "Maintains healthy boundaries while remaining approachable.",
      groupDynamics: "Contributes positively to group settings with collaborative approach.",
      compatibilityProfile: "Most compatible with authentic, growth-oriented individuals.",
      compatibleTypes: ["Growth-oriented individuals", "Authentic communicators", "Supportive partners"],
      challengingRelationships: ["Overly critical individuals", "Emotionally unavailable partners"],
      notableExamples: ["Values authentic connections", "Seeks mutual understanding"]
    },
    coreTraits: {
      primary: "Analytical Thinker",
      secondary: "Empathetic Communicator",
      tertiaryTraits: ["Adaptable", "Resilient", "Curious", "Thoughtful", "Responsible", "Creative", "Diligent", "Authentic", "Conscientious", "Insightful", "Self-aware", "Growth-oriented"],
      strengths: ["Critical thinking", "Emotional intelligence", "Adaptability", "Problem-solving", "Attentive listening", "Analytical skills", "Empathy"],
      challenges: ["Perfectionism", "Overthinking", "Balancing logic and emotion", "Setting boundaries", "Managing stress during uncertainty"],
      adaptivePatterns: ["Learning from feedback", "Adjusting approaches based on context", "Finding balance between different needs"],
      potentialBlindSpots: ["May overlook intuition when focused on analysis", "Could neglect self-care when helping others", "Might delay decisions seeking perfect solutions"],
      notableExamples: ["Demonstrates balanced thinking", "Shows both analytical and emotional intelligence"]
    },
    careerInsights: {
      naturalStrengths: ["Critical analysis", "Problem-solving", "Communication", "Adaptability", "Team collaboration", "Learning agility", "Project management"],
      workplaceNeeds: ["Intellectual stimulation", "Meaningful work", "Supportive culture", "Growth opportunities", "Work-life balance", "Recognition for contributions", "Collaborative environment"],
      leadershipStyle: "Balanced leadership combining analytical thinking with emotional intelligence and interpersonal awareness.",
      idealWorkEnvironment: "Collaborative setting that values both individual contribution and teamwork, with opportunities for growth and learning.",
      careerPathways: ["Strategic analysis", "Research", "Education", "Consulting", "Psychology", "Project management", "Communications"],
      professionalChallenges: ["Maintaining work-life balance", "Managing perfectionism", "Prioritizing competing demands", "Setting professional boundaries"],
      potentialRoles: ["Analyst", "Researcher", "Consultant", "Educator", "Project Manager", "Content Developer", "Therapist"],
      notableExamples: ["Strong analytical capabilities", "Balanced interpersonal skills"]
    },
    motivationalProfile: {
      primaryDrivers: ["Personal growth", "Understanding complex subjects", "Helping others", "Creating value", "Learning and development", "Solving problems", "Making meaningful contributions"],
      secondaryDrivers: ["Recognition for expertise", "Intellectual stimulation", "Professional advancement", "Financial security", "Positive social impact"],
      inhibitors: ["Excessive self-criticism", "Uncertainty", "Lack of meaning", "Restrictive environments", "Lack of growth opportunities"],
      values: ["Integrity", "Growth", "Compassion", "Excellence", "Balance", "Authenticity", "Wisdom"],
      aspirations: "Seeking to develop expertise while making positive contributions to others' lives and continuing personal growth journey.",
      fearPatterns: "Concerns about not meeting high personal standards or failing to achieve meaningful impact in chosen areas.",
      notableExamples: ["Values growth and development", "Motivated by meaningful contribution"]
    },
    growthPotential: {
      developmentAreas: ["Balancing analysis with intuition", "Managing perfectionism", "Setting healthy boundaries", "Embracing uncertainty", "Practicing self-compassion", "Delegating effectively", "Prioritizing self-care"],
      recommendations: ["Regular reflection practices", "Mindfulness techniques", "Structured goal-setting", "Seeking diverse perspectives", "Cultivating support network", "Skill development in areas of interest", "Exploring creative outlets"],
      specificActionItems: ["Daily reflection journal", "Weekly learning goals", "Regular skills practice", "Seeking mentorship", "Boundary-setting exercises", "Self-care routine"],
      longTermTrajectory: "Continued integration of analytical strengths with emotional intelligence, leading to increased wisdom and potential for significant positive impact.",
      potentialPitfalls: ["Overthinking important decisions", "Taking on too much responsibility", "Neglecting personal needs", "Avoiding necessary conflicts", "Perfectionism limiting progress"],
      growthMindsetIndicators: "Demonstrates openness to feedback and willingness to learn from challenges and setbacks.",
      notableExamples: ["Shows growth orientation", "Open to development and feedback"]
    }
  };
};

serve(async (req) => {
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    console.log("[BigMe] Starting analysis process");
    // Start timer for performance tracking
    const startTime = Date.now();
    
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

    console.log(`[BigMe] Processing analysis for user ${userId} with ${responses.length} responses`);

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
    `;

    try {
      // Set reasonable timeout (no more than 25 seconds to allow for response processing)
      const analysisTimeout = setTimeout(() => {
        console.error("[BigMe] Analysis timed out after 25 seconds");
        throw new Error("Analysis timed out");
      }, 25000);

      console.log("[BigMe] Calling OpenAI API");
      
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

      // Clear timeout as we got a response
      clearTimeout(analysisTimeout);

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        console.error("[BigMe] OpenAI API error:", errorData);
        
        // Create a default analysis instead of failing
        console.log("[BigMe] Using default analysis due to OpenAI error");
        const defaultAnalysis = createDefaultAnalysis();
        
        // Store default analysis in database
        const { data: storageData, error: storageError } = await supabase
          .from("big_me_analyses")
          .insert({
            user_id: userId,
            analysis_result: defaultAnalysis,
            responses: responses
          })
          .select("id, created_at")
          .single();
          
        if (storageError) {
          throw new Error(`Failed to store default analysis: ${storageError.message}`);
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            message: "Analysis completed with default results due to OpenAI error",
            analysisId: storageData.id,
            createdAt: storageData.created_at,
            analysis: defaultAnalysis,
            isDefault: true
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      console.log("[BigMe] OpenAI response received, processing...");
      const openAiResult = await analysisResponse.json();
      const analysisContent = openAiResult.choices[0].message.content;
      
      console.log("[BigMe] Analysis generated, parsing JSON...");

      // Parse the JSON response with better error handling
      let analysisJson;
      try {
        analysisJson = cleanAndParseJSON(analysisContent);
        console.log("[BigMe] Successfully parsed deep JSON");
      } catch (e) {
        console.error("[BigMe] Failed to parse JSON:", e);
        
        // Create a standardized fallback JSON structure
        console.log("[BigMe] Using fallback JSON structure");
        analysisJson = createDefaultAnalysis();
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
        console.log(`[BigMe] Total processing time: ${Date.now() - startTime}ms`);

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
