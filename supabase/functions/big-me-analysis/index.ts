
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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert psychological profiler. Your task is to analyze a series of personality assessment responses and create a comprehensive psychological profile. 
            
            Structure your response as a JSON object following this schema exactly:
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
            
            Each field should contain insightful, personalized analysis based on the assessment responses. Ensure all arrays have at least 3 items. Do not use placeholders or generic statements. Analyze all provided responses and provide meaningful, individualized insights.`
          },
          {
            role: "user",
            content: JSON.stringify(questionsAndAnswers),
          },
        ],
        temperature: 0.7,
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
    
    // Parse the JSON response
    let analysisJson;
    try {
      analysisJson = JSON.parse(analysisContent);
      console.log("Analysis parsed as valid JSON");
    } catch (e) {
      console.error("Failed to parse analysis as JSON:", e);
      console.log("Raw analysis content:", analysisContent);
      throw new Error("Failed to parse analysis result as JSON");
    }

    // Process the analysis to ensure all required fields exist
    const processedAnalysis = ensureArraysExist(analysisJson);
    console.log("Analysis processed to ensure required fields");

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
