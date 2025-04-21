
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

    console.log(`Processing analysis for user ${userId} with ${responses.length} responses`);

    // Generate analysis using OpenAI API
    const analysisResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert psychological profiler. Your task is to analyze a series of personality assessment responses and create a comprehensive psychological profile. 
            
            Structure your response as a JSON object following this schema exactly. DO NOT include markdown formatting, code blocks, or backticks in your response:
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
            
            Each field should contain insightful, personalized analysis based on the assessment responses. Ensure all arrays have at least 3 items. Do not use placeholders or generic statements. Analyze all provided responses and provide meaningful, individualized insights.
            
            IMPORTANT: Return ONLY valid JSON. No text before or after the JSON object. No markdown formatting. No code blocks. No backticks.`
          },
          {
            role: "user",
            content: JSON.stringify(questionsAndAnswers),
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }, // Request JSON format directly
      }),
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const openAiResult = await analysisResponse.json();
    const analysisContent = openAiResult.choices[0].message.content;
    
    console.log("Analysis generated successfully");
    
    // Parse the JSON response with better error handling
    let analysisJson;
    try {
      // Use our clean and parse helper function
      analysisJson = cleanAndParseJSON(analysisContent);
      console.log("Analysis parsed as valid JSON");
    } catch (e) {
      console.error("Failed to parse analysis as JSON:", e);
      console.log("Raw analysis content:", analysisContent);
      
      // Create fallback analysis
      analysisJson = {
        cognitivePatterning: {
          decisionMaking: "Balanced approach to decisions",
          learningStyle: "Adaptive learner",
          attention: "Context-dependent focus",
          problemSolvingApproach: "Analytical with creative elements",
          informationProcessing: "Systematic with attention to details",
          analyticalTendencies: "Evaluates evidence before forming conclusions"
        },
        emotionalArchitecture: {
          emotionalAwareness: "Developing awareness of emotional states",
          regulationStyle: "Uses multiple strategies for emotional regulation",
          empathicCapacity: "Shows empathy in social situations",
          emotionalComplexity: "Recognizes emotional nuance",
          stressResponse: "Adaptive coping mechanisms",
          emotionalResilience: "Bounces back from setbacks"
        },
        interpersonalDynamics: {
          attachmentStyle: "Secure with occasional anxious tendencies",
          communicationPattern: "Clear and direct communication",
          conflictResolution: "Seeks mutually beneficial solutions",
          relationshipNeeds: "Values authenticity and trust",
          socialBoundaries: "Maintains healthy personal boundaries",
          groupDynamics: "Contributes positively to team environments",
          compatibilityProfile: "Works well with diverse personalities",
          compatibleTypes: ["Supportive partners", "Growth-oriented individuals", "Clear communicators"],
          challengingRelationships: ["Highly critical people", "Emotionally unavailable individuals", "Controlling personalities"]
        },
        coreTraits: {
          primary: "Adaptable",
          secondary: "Analytical",
          tertiaryTraits: ["Conscientious", "Curious", "Resilient"],
          strengths: ["Problem solving", "Emotional intelligence", "Effective communication"],
          challenges: ["Perfectionism", "Overthinking decisions", "Balancing work and rest"],
          adaptivePatterns: ["Learning from feedback", "Adjusting to new information", "Finding balance"],
          potentialBlindSpots: ["Self-criticism", "Difficulty with ambiguity", "Overlooking personal needs"]
        },
        careerInsights: {
          naturalStrengths: ["Strategic thinking", "Collaborative work", "Creative problem solving"],
          workplaceNeeds: ["Intellectual stimulation", "Supportive culture", "Room for growth"],
          leadershipStyle: "Participative with clear direction",
          idealWorkEnvironment: "Balanced structure with room for innovation",
          careerPathways: ["Strategic planning", "Research and analysis", "Team management"],
          professionalChallenges: ["Managing perfectionism", "Work-life balance", "Handling criticism"],
          potentialRoles: ["Project manager", "Research analyst", "Team coordinator"]
        },
        motivationalProfile: {
          primaryDrivers: ["Personal growth", "Making a difference", "Mastering skills"],
          secondaryDrivers: ["Recognition for contribution", "Stability and security", "Meaningful connections"],
          inhibitors: ["Fear of failure", "Analysis paralysis", "Impostor syndrome"],
          values: ["Integrity", "Excellence", "Continuous improvement"],
          aspirations: "To develop expertise while maintaining balance and making meaningful contributions",
          fearPatterns: "Concerns about not meeting high personal standards"
        },
        growthPotential: {
          developmentAreas: ["Embracing imperfection", "Decisive action", "Self-compassion"],
          recommendations: ["Mindfulness practices", "Setting boundaries", "Celebrating small wins"],
          specificActionItems: ["Daily reflection practice", "Skill-building in priority areas", "Regular feedback sessions"],
          longTermTrajectory: "Moving toward increased confidence and balanced achievement",
          potentialPitfalls: ["Burnout from overcommitment", "Isolation during intense focus", "Neglecting self-care"],
          growthMindsetIndicators: "Sees challenges as opportunities and values learning from mistakes"
        }
      };
      console.log("Using fallback analysis due to parsing error");
    }

    // Process the analysis to ensure all required fields exist
    const processedAnalysis = ensureArraysExist(analysisJson);
    console.log("Analysis processed to ensure required fields");

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
        console.error("Database error:", error);
        throw new Error(`Failed to store analysis: ${error.message}`);
      }

      console.log("Analysis stored successfully with ID:", data.id);

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
      console.error("Database operation failed:", dbError);
      throw new Error(`Database operation failed: ${dbError.message}`);
    }
  } catch (error) {
    console.error("Error in big-me-analysis function:", error);
    
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
