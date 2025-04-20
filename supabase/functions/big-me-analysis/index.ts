
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser compatibility
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
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

    // Prepare the analysis prompt with improved formatting
    const prompt = generatePrompt(responses);
    
    // Call OpenAI API with strict error handling
    console.log("Calling OpenAI API with GPT-4o model...");
    
    const analysisResult = await callOpenAI(prompt);
    console.log("OpenAI API call completed successfully");

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
  // Group responses by category with improved formatting
  const responsesByCategory = responses.reduce((acc, response) => {
    if (!acc[response.category]) {
      acc[response.category] = [];
    }
    acc[response.category].push(response);
    return acc;
  }, {} as Record<string, typeof responses>);
  
  // Format the responses for the prompt with more contextual information
  const formattedResponses = Object.entries(responsesByCategory).map(([category, responses]) => {
    const categoryResponses = responses.map(r => {
      const responseText = r.selectedOption || r.customResponse || "No response";
      return `Question ID: ${r.questionId}, Response: "${responseText}"`;
    }).join("\n");
    
    return `## Category: ${category} (${responses.length} responses)\n${categoryResponses}`;
  }).join("\n\n");
  
  return `
Analyze the following personality quiz responses and provide a comprehensive personality analysis.

# Quiz Responses:
${formattedResponses}

Create an extremely detailed, in-depth, and nuanced personality profile based on these responses, focusing on personality traits, strengths, weaknesses, growth areas, and career opportunities.

Provide the analysis in JSON format according to the following schema:

{
  "cognitivePatterning": {
    "decisionMaking": "Detailed analysis of decision-making approach that reflects the individual's unique patterns and preferences", 
    "learningStyle": "In-depth description of learning preferences and patterns with specific examples and contexts where this style is most effective",
    "attention": "Analysis of attention patterns and focus tendencies, including how they process information and prioritize",
    "problemSolvingApproach": "Comprehensive breakdown of problem-solving style with examples of how they typically tackle challenges",
    "informationProcessing": "Details about how information is processed and integrated, including their typical mental frameworks",
    "analyticalTendencies": "Analysis of analytical strengths and approaches, highlighting their distinctive reasoning patterns"
  },
  "emotionalArchitecture": {
    "emotionalAwareness": "Deep dive into emotional self-awareness, exploring how they recognize and name their emotions",
    "regulationStyle": "Analysis of emotional regulation patterns, including both strengths and challenges in managing feelings",
    "empathicCapacity": "Assessment of empathy and emotional understanding of others, including how they connect with others' experiences",
    "emotionalComplexity": "Exploration of emotional depth and nuance, including their capacity for mixed emotions and emotional intelligence",
    "stressResponse": "Detailed analysis of stress management patterns and how they typically respond to pressure situations",
    "emotionalResilience": "Evaluation of emotional resilience factors and recovery patterns after setbacks"
  },
  "interpersonalDynamics": {
    "attachmentStyle": "Analysis of relationship patterns and attachment style, including how they form and maintain connections",
    "communicationPattern": "Detailed breakdown of communication style with specific examples of their strengths and challenges",
    "conflictResolution": "Assessment of conflict handling approaches, including typical responses to disagreement and tension",
    "relationshipNeeds": "Deep dive into interpersonal needs and boundaries, including what they seek in relationships",
    "socialBoundaries": "Analysis of boundary-setting patterns and how they navigate personal space and limits",
    "groupDynamics": "Evaluation of behavior in group settings, including typical roles they adopt",
    "compatibilityProfile": "Analysis of relationship compatibility patterns, highlighting relationship dynamics",
    "compatibleTypes": ["List of at least 5 most compatible personality types with detailed explanations for each"],
    "challengingRelationships": ["Types of relationships that may present challenges, with at least 5 specific examples and reasoning"]
  },
  "coreTraits": {
    "primary": "Detailed description of primary personality orientation with specific behavioral examples",
    "secondary": "Analysis of secondary personality characteristics that complement or balance primary traits",
    "tertiaryTraits": ["Array of 10+ significant traits with detailed explanations for each"],
    "strengths": ["Detailed analysis of at least 8 key strengths with examples and contexts where they shine"],
    "challenges": ["Thoughtful analysis of at least 8 growth areas with nuanced description"],
    "adaptivePatterns": ["Analysis of adaptation and flexibility patterns in different contexts"],
    "potentialBlindSpots": ["Insight into at least 5 potential unconscious patterns that may affect decision-making"]
  },
  "careerInsights": {
    "naturalStrengths": ["Detailed analysis of professional strengths based on personality patterns"],
    "workplaceNeeds": ["In-depth exploration of ideal work environment factors"],
    "leadershipStyle": "Comprehensive analysis of leadership approach and management preferences",
    "idealWorkEnvironment": "Detailed description of optimal work setting that aligns with personality needs",
    "careerPathways": ["Well-reasoned career direction suggestions with at least 8 specific fields"],
    "professionalChallenges": ["Analysis of potential career growth areas and how to address them"],
    "potentialRoles": ["At least 10 specific job roles and positions that align with profile"]
  },
  "motivationalProfile": {
    "primaryDrivers": ["Deep analysis of core motivations with at least 5 specific drivers"],
    "secondaryDrivers": ["Additional motivation factors explored in detail"],
    "inhibitors": ["Analysis of potential blocking factors that might limit growth"],
    "values": ["Core values with detailed explanations of how they manifest"],
    "aspirations": "Comprehensive analysis of life goals and desires based on response patterns",
    "fearPatterns": "Thoughtful analysis of underlying concerns and how they might influence behavior"
  },
  "growthPotential": {
    "developmentAreas": ["Detailed growth opportunities with specific suggestions"],
    "recommendations": ["Specific, actionable development suggestions tailored to personality type"],
    "specificActionItems": ["At least 8 concrete steps for personal growth"],
    "longTermTrajectory": "Analysis of potential development path over time",
    "potentialPitfalls": ["Areas requiring attention and awareness to avoid common challenges"],
    "growthMindsetIndicators": "Analysis of learning and development orientation"
  }
}

BE EXHAUSTIVE in your analysis. Each string field should contain at least 150 words of rich, detailed insight. All array fields must contain AT LEAST the minimum number of items specified in the comments (or 5 if not specified). Ensure that your analysis is thorough, psychologically sound, and provides genuine value through specific, personalized insights rather than generic statements.
`;
}

async function callOpenAI(prompt: string) {
  console.log("Making API call to OpenAI with GPT-4o...");
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using GPT-4o as explicitly requested
        messages: [
          {
            role: "system",
            content: "Analyze personality quiz results by interpreting the scores and identifying personality traits based on given criteria. Provide comprehensive, evidence-based analysis with exceptional detail and depth."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 16000, // Reduced from previous settings to ensure it fits within GPT-4o limits
        top_p: 1.0,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenAI response received successfully");
    
    try {
      // Parse and validate the response content
      const content = JSON.parse(data.choices[0].message.content);
      validateAnalysisContent(content);
      return content;
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error(`Failed to parse the AI analysis response: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    throw new Error(`OpenAI API call failed: ${error.message}`);
  }
}

function validateAnalysisContent(content: any) {
  // Check that all major sections exist
  const requiredSections = [
    "cognitivePatterning", 
    "emotionalArchitecture", 
    "interpersonalDynamics", 
    "coreTraits", 
    "careerInsights", 
    "motivationalProfile", 
    "growthPotential"
  ];
  
  for (const section of requiredSections) {
    if (!content[section] || typeof content[section] !== 'object') {
      throw new Error(`Missing or invalid section: ${section}`);
    }
  }
  
  // Ensure arrays have minimum content
  if (!Array.isArray(content.coreTraits.strengths) || content.coreTraits.strengths.length < 3) {
    throw new Error("Strengths array missing or insufficient");
  }
  
  if (!Array.isArray(content.coreTraits.challenges) || content.coreTraits.challenges.length < 3) {
    throw new Error("Challenges array missing or insufficient");
  }
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
    throw new Error(`Failed to store analysis results: ${error.message}`);
  }
}
