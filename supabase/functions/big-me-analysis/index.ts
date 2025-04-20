
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser compatibility
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface AnalysisRequest {
  responses: Array<{
    questionId: string;
    selectedOption?: string;
    customResponse?: string;
    category: string;
  }>;
  userId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required");
    }

    const { responses, userId } = await req.json() as AnalysisRequest;
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      throw new Error("Valid responses are required for analysis");
    }
    
    console.log(`Received ${responses.length} responses for analysis`);

    // Prepare the analysis prompt
    const prompt = generatePrompt(responses);
    
    // Call OpenAI API
    console.log("Calling OpenAI API...");
    const analysisResult = await callOpenAI(prompt);
    console.log("OpenAI API call completed");

    // If we have a userId, store the results in Supabase
    if (userId) {
      await storeAnalysisResults(userId, analysisResult, responses);
    }
    
    // Return the analysis result
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in big-me-analysis function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred during analysis",
        status: "error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function generatePrompt(responses: AnalysisRequest["responses"]) {
  // Group responses by category
  const responsesByCategory = responses.reduce((acc, response) => {
    if (!acc[response.category]) {
      acc[response.category] = [];
    }
    acc[response.category].push(response);
    return acc;
  }, {} as Record<string, typeof responses>);
  
  // Format the responses for the prompt
  const formattedResponses = Object.entries(responsesByCategory).map(([category, responses]) => {
    const categoryResponses = responses.map(r => {
      const responseText = r.selectedOption || r.customResponse || "No response";
      return `Question ID: ${r.questionId}, Response: "${responseText}"`;
    }).join("\n");
    
    return `## Category: ${category}\n${categoryResponses}`;
  }).join("\n\n");
  
  return `
Analyze the following personality quiz responses and provide a comprehensive personality analysis.

# Quiz Responses:
${formattedResponses}

Create a detailed personality profile based on these responses, focusing on personality traits, strengths, weaknesses, growth areas, and career opportunities.
Provide the analysis in JSON format according to the following schema:

{
  "cognitivePatterning": {
    "decisionMaking": "Detailed analysis of decision-making approach", 
    "learningStyle": "In-depth description of learning preferences and patterns",
    "attention": "Analysis of attention patterns and focus tendencies",
    "problemSolvingApproach": "Comprehensive breakdown of problem-solving style",
    "informationProcessing": "Details about how information is processed and integrated",
    "analyticalTendencies": "Analysis of analytical strengths and approaches"
  },
  "emotionalArchitecture": {
    "emotionalAwareness": "Deep dive into emotional self-awareness",
    "regulationStyle": "Analysis of emotional regulation patterns",
    "empathicCapacity": "Assessment of empathy and emotional understanding",
    "emotionalComplexity": "Exploration of emotional depth and nuance",
    "stressResponse": "Detailed analysis of stress management patterns",
    "emotionalResilience": "Evaluation of emotional resilience factors"
  },
  "interpersonalDynamics": {
    "attachmentStyle": "Analysis of relationship patterns and attachment",
    "communicationPattern": "Detailed breakdown of communication style",
    "conflictResolution": "Assessment of conflict handling approaches",
    "relationshipNeeds": "Deep dive into interpersonal needs and boundaries",
    "socialBoundaries": "Analysis of boundary-setting patterns",
    "groupDynamics": "Evaluation of behavior in group settings",
    "compatibilityProfile": "Analysis of relationship compatibility patterns",
    "compatibleTypes": ["List of most compatible personality types with explanations"],
    "challengingRelationships": ["Types of relationships that may present challenges"]
  },
  "coreTraits": {
    "primary": "Detailed description of primary personality orientation",
    "secondary": "Analysis of secondary personality characteristics",
    "tertiaryTraits": ["Array of top 10 significant traits with explanations"],
    "strengths": ["Detailed analysis of key strengths with examples"],
    "challenges": ["Thoughtful analysis of growth areas"],
    "adaptivePatterns": ["Analysis of adaptation and flexibility patterns"],
    "potentialBlindSpots": ["Insight into potential unconscious patterns"]
  },
  "careerInsights": {
    "naturalStrengths": ["Detailed analysis of professional strengths"],
    "workplaceNeeds": ["In-depth exploration of ideal work environment"],
    "leadershipStyle": "Comprehensive analysis of leadership approach",
    "idealWorkEnvironment": "Detailed description of optimal work setting",
    "careerPathways": ["Well-reasoned career direction suggestions"],
    "professionalChallenges": ["Analysis of potential career growth areas"],
    "potentialRoles": ["Specific job roles and positions that align with profile"]
  },
  "motivationalProfile": {
    "primaryDrivers": ["Deep analysis of core motivations"],
    "secondaryDrivers": ["Additional motivation factors explored"],
    "inhibitors": ["Analysis of potential blocking factors"],
    "values": ["Core values with detailed explanations"],
    "aspirations": "Comprehensive analysis of life goals and desires",
    "fearPatterns": "Thoughtful analysis of underlying concerns"
  },
  "growthPotential": {
    "developmentAreas": ["Detailed growth opportunities"],
    "recommendations": ["Specific, actionable development suggestions"],
    "specificActionItems": ["Concrete steps for personal growth"],
    "longTermTrajectory": "Analysis of potential development path",
    "potentialPitfalls": ["Areas requiring attention and awareness"],
    "growthMindsetIndicators": "Analysis of learning and development orientation"
  }
}

Be thorough and provide rich, detailed insights in each section. Ensure that all array fields contain at least 3 items.
`;
}

async function callOpenAI(prompt: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o", // Using GPT-4o as the closest available model
      messages: [
        {
          role: "system",
          content: "Analyze personality quiz results by interpreting the scores and identifying personality traits based on given criteria. Provide comprehensive, evidence-based analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 32768,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenAI API Error:", error);
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function storeAnalysisResults(userId: string, analysis: any, responses: any[]) {
  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase
      .from("big_me_analyses")
      .insert({
        user_id: userId,
        analysis_result: analysis,
        responses: responses,
        created_at: new Date().toISOString()
      })
      .select("id");

    if (error) {
      console.error("Error storing analysis results:", error);
      throw new Error(`Failed to store analysis: ${error.message}`);
    }

    console.log("Analysis stored successfully with ID:", data?.[0]?.id);
    return data?.[0]?.id;
  } catch (error) {
    console.error("Error in storeAnalysisResults:", error);
    // We don't throw here as this is a non-critical operation
    // The analysis can still be returned to the user
  }
}
