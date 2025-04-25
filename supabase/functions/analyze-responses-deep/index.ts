import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'; // Import Supabase client
import { AssessmentResponse, PersonalityAnalysis, QuestionCategory } from "./types.ts";

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to create Supabase client with user's auth context
function createSupabaseClientForUser(req: Request): SupabaseClient {
  const authHeader = req.headers.get('Authorization')!;
  // Use environment variables for Supabase URL and Anon Key
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false } // Important for edge functions
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let assessmentId: string | null = null; // Keep assessmentId accessible in catch block
  let supabaseClient: SupabaseClient | null = null; // Keep client accessible

  try {
    console.log("Received request to analyze-responses-deep");
    supabaseClient = createSupabaseClientForUser(req); // Create client early
    const requestData = await req.json();
    const { responses, assessmentId: currentAssessmentId, retryCount = 0 } = requestData;
    assessmentId = currentAssessmentId; // Assign to outer variable
    
    // CRITICAL FIX: Check for retry information and log it
    if (retryCount > 0) {
      console.log(`⚠️ [${assessmentId}] This is retry attempt #${retryCount}`);
    }
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      const errorMsg = "Invalid or missing responses data";
      console.error(`[${assessmentId || 'unknown'}] ${errorMsg}:`, JSON.stringify(responses));
      throw new Error(errorMsg);
    }

    console.log(`[${assessmentId}] Processing ${responses.length} responses.`);
    const categories = [...new Set(responses.map(r => r.category))];
    console.log(`[${assessmentId}] Response categories: ${categories.join(', ')}`);
    
    // Add additional logging for debugging
    try {
      const categorySummary = categories.map(category => {
        const count = responses.filter(r => r.category === category).length;
        const percentage = Math.round((count / responses.length) * 100);
        return `${category}: ${count} (${percentage}%)`;
      }).join(', ');
      console.log(`[${assessmentId}] Category distribution: ${categorySummary}`);
    } catch (logError: any) {
      console.error(`[${assessmentId}] Error generating category summary:`, logError?.message || logError);
    }
    
    // Clean and serialize responses for analysis
    const cleanedResponses = responses.map(r => ({
      ...r,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString()
    }));
    
    // Group responses by category for analysis
    const responsesByCategory = categorizeResponses(cleanedResponses);
    console.log(`[${assessmentId}] Categorized into ${Object.keys(responsesByCategory).length} categories`);
    
    // Calculate category coverage - how many questions were answered in each category
    const categoryCoverage = calculateCategoryCoverage(responsesByCategory);
    console.log(`[${assessmentId}] Category coverage:`, JSON.stringify(categoryCoverage));
    
    // Add additional resilience to generateAIAnalysis
    let attempts = 0;
    let analysis: PersonalityAnalysis | null = null;
    let lastError: any = null;
    
    while (attempts < 1 && !analysis) {  // CRITICAL FIX: Only try once in the edge function
      try {
        if (attempts > 0) {
          console.log(`[${assessmentId}] Retry attempt ${attempts} for AI analysis`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, attempts * 2000));
        }
        
        // Ensure assessmentId is valid before calling the analysis function
        if (!assessmentId) {
            throw new Error("Internal Server Error: Assessment ID is missing before analysis call.");
        }

        // Generate the AI analysis using OpenAI's API
        analysis = await generateAIAnalysis(responsesByCategory, assessmentId, categoryCoverage);
        break;
      } catch (error) {
        lastError = error;
        console.error(`[${assessmentId}] Error in AI analysis attempt ${attempts}:`, error);
        attempts++;
      }
    }
    
    if (!analysis) {
      const errorMsg = `Failed to generate analysis after ${attempts} attempts.`;
      console.error(`[${assessmentId}] ${errorMsg} Last error:`, lastError?.message || lastError);
      throw new Error(errorMsg);
    }
    
    console.log(`[${assessmentId}] Analysis completed successfully by AI`);
    console.log(`[${assessmentId}] Analysis ID:`, analysis.id);
    console.log(`[${assessmentId}] Analysis contains traits:`, analysis.traits?.length || 0);
    console.log(`[${assessmentId}] Intelligence score:`, analysis.intelligenceScore);
    console.log(`[${assessmentId}] Emotional intelligence score:`, analysis.emotionalIntelligenceScore);
    
    // --- Step 4: Save analysis to the database ---
    console.log(`[${assessmentId}] Attempting to save analysis to deep_analyses table...`);
    if (!supabaseClient) {
      throw new Error("Supabase client not initialized.");
    }

    try {
      const { data: insertData, error: insertError } = await supabaseClient
        .from('deep_analyses')
        .insert({
          assessment_id: assessmentId, // Assuming assessmentId from request matches the one needed for FK
          // user_id is handled by RLS policy and default value using auth.uid()
          analysis_data: analysis // Save the entire analysis object
        })
        .select() // Optionally select the inserted row back
        .single(); // Assuming one row is inserted

      if (insertError) {
        console.error(`[${assessmentId}] Database insert error:`, insertError);
        throw new Error(`Failed to save analysis results: ${insertError.message}`);
      }

      console.log(`[${assessmentId}] Successfully saved analysis to database. DB ID: ${insertData?.id}`);

    } catch (dbError: any) {
        const timestamp = new Date().toISOString();
        const errorPayload = {
          level: 'error',
          message: `Failed to save analysis results: ${dbError.message || 'Unknown DB error'}`,
          assessmentId: assessmentId,
          functionName: 'analyze-responses-deep handler (DB insert)',
          errorType: dbError.constructor?.name || 'DatabaseError',
          stack: dbError.stack,
          timestamp: timestamp
        };
        console.error("Database insert error details:", JSON.stringify(errorPayload, null, 2));
      // Decide if we should re-throw or return a specific error response
      // Re-throwing will be caught by the main handler
      throw dbError; 
    }
    // --- End Step 4 ---
    
    // Return the original analysis object to the client
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const timestamp = new Date().toISOString();
    const errorPayload = {
      level: 'error',
      message: error.message || 'Unknown error in analyze-responses-deep function',
      assessmentId: assessmentId || 'unknown',
      functionName: 'analyze-responses-deep handler',
      errorType: error.constructor?.name || 'Error',
      stack: error.stack,
      timestamp: timestamp
    };
    console.error("Error in analyze-responses-deep function:", JSON.stringify(errorPayload, null, 2));

    return new Response(JSON.stringify({ 
      error: errorPayload.message,
      errorType: errorPayload.errorType,
      assessmentId: errorPayload.assessmentId,
      timestamp: errorPayload.timestamp
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Group responses by their category
function categorizeResponses(responses: AssessmentResponse[]) {
  const categorized: Record<string, AssessmentResponse[]> = {};
  
  for (const response of responses) {
    if (!categorized[response.category]) {
      categorized[response.category] = [];
    }
    categorized[response.category].push(response);
  }
  
  return categorized;
}

// Calculate how comprehensively each category was covered
function calculateCategoryCoverage(responsesByCategory: Record<string, AssessmentResponse[]>) {
  // Define expected number of questions per category (ideal coverage)
  // Based on distribution: 8 * 9 categories + 7 (Creativity) + 6 (Leadership) = 72 + 13 = 85... needs adjustment
  // Let's re-distribute to hit 100:
  const expectedQuestionCounts: Record<string, number> = {
    personality: 8,
    emotional: 8,
    cognitive: 8,
    values: 8,
    motivation: 8,
    resilience: 8,
    social: 8,
    decision: 8,
    creativity: 7,
    leadership: 6,
    communication_style: 8, // Ensure keys match category names used in questions
    self_perception: 8,
    philosophical_outlook: 7, // Adjusted philosophical to 7 to make it sum to 100 (8*11 + 7 + 6 = 88+13 = 101, let's make one 7)
    // Total: 8*10 + 7*2 + 6 = 80 + 14 + 6 = 100
  };
  
  // Recalculate the target total based on the defined counts
  const totalExpected = Object.values(expectedQuestionCounts).reduce((sum, count) => sum + count, 0);
  // NOTE: This should ideally be 100 based on the counts above.
  // If it's different, the counts need review.
  console.log(`[DEBUG] Total expected questions defined: ${totalExpected}`);
  
  const coverage: Record<string, { 
    count: number, 
    expected: number, 
    percentage: number,
    responseQuality: number // 0-1 based on average response quality
  }> = {};
  
  for (const [category, responses] of Object.entries(responsesByCategory)) {
    // Use snake_case for consistency if categories are like that in questions, else adjust keys above
    const categoryKey = category.toLowerCase().replace(/ /g, '_').replace(/\//g, ''); 
    const expected = expectedQuestionCounts[categoryKey] || 8; // Default to 8 (average) if somehow missing
    const count = responses.length;
    const percentage = Math.min(100, Math.round((count / expected) * 100));
    
    // Calculate response quality based on whether custom responses were provided
    // and how substantive they appear to be
    const responseQuality = responses.reduce((sum, response) => {
      let quality = 0.5; // Default quality
      
      // Higher quality for custom responses with substantial content
      if (response.customResponse && response.customResponse.trim().length > 0) {
        quality = 0.7; // Base score for any custom response
        
        // If response includes detailed explanations (more than 100 chars)
        if (response.customResponse.length > 100) {
          quality = 0.9;
        }
        // If response is very detailed (more than 200 chars)
        if (response.customResponse.length > 200) {
          quality = 1.0;
        }
      }
      
      return sum + quality;
    }, 0) / responses.length;
    
    coverage[category] = {
      count,
      expected,
      percentage,
      responseQuality
    };
  }
  
  return coverage;
}

// Generate AI analysis using OpenAI's gpt-4o model
async function generateAIAnalysis(
  responsesByCategory: Record<string, AssessmentResponse[]>,
  assessmentId: string,
  categoryCoverage: Record<string, {
    count: number,
    expected: number,
    percentage: number,
    responseQuality: number
  }>
): Promise<PersonalityAnalysis> {
  // Count the total number of questions answered in each category
  const categoryCounts = Object.entries(responsesByCategory).map(([category, responses]) => {
    return `${category}: ${responses.length} questions`;
  }).join(', ');

  // Calculate cognitive and emotional intelligence base metrics based on coverage
  const cognitiveRelevantCategories = ['cognitive', 'decision', 'creativity'];
  const emotionalRelevantCategories = ['emotional', 'social', 'resilience'];

  const cognitiveBaseScore = calculateBaseScore(categoryCoverage, cognitiveRelevantCategories);
  const emotionalBaseScore = calculateBaseScore(categoryCoverage, emotionalRelevantCategories);

  console.log(`[${assessmentId}] Base cognitive score from coverage:`, cognitiveBaseScore);
  console.log(`[${assessmentId}] Base emotional intelligence score from coverage:`, emotionalBaseScore);

  // Generate detailed summaries of individual responses to reference in the analysis
  const categoryDetailedResponses = Object.entries(responsesByCategory).map(([category, responses]) => {
    const responseSummaries = responses.map((r, index) =>
      `Response ${index+1}: "${r.selectedOption || r.customResponse || "No answer"}" (Timestamp: ${r.timestamp})`
    ).join('\n');
    return `CATEGORY: ${category.toUpperCase()}\n${responseSummaries}`;
  }).join('\n\n');

  // Create a more specific and comprehensive prompt for analysis (DEEP version)
  const prompt = `
  You are an expert psychological profiler specializing in highly nuanced, evidence-based, comprehensive assessments from extensive data. Your task is to synthesize 100 assessment responses to create a deeply individualized personality profile reflecting complex dynamics, strengths, challenges, and potential.

  ## Assessment Data (100 Questions)
  The user has answered a comprehensive set of 100 questions across ${Object.keys(responsesByCategory).length} categories (${categoryCounts}):

  ## DETAILED RESPONSES - USE THESE EXTENSIVELY FOR SPECIFIC EVIDENCE AND NUANCED ANALYSIS
  ${categoryDetailedResponses}

  ## Cognitive and Emotional Intelligence Scoring Requirements (Deep Analysis)
  
  1. COGNITIVE FLEXIBILITY SCORE CALCULATION:
     - Base score begins at ${cognitiveBaseScore}/100 based on question coverage/quality.
     - Evaluate specific cognitive indicators with *increased depth* based on the richer data:
       * Complex perspective-taking and synthesis (+10-25 points)
       * Sophisticated pattern recognition and abstraction (+10-20 points)
       * Handling of ambiguity, paradox, and nuance (+10-20 points)
       * Strategic foresight and multi-step planning ability (+5-15 points)
       * Metacognitive awareness and self-correction (+5-15 points)
       * Analytical rigor and logical consistency (+5-15 points)
       * Originality and effectiveness of problem-solving (+5-15 points)
     - Identify cognitive rigidity, biases, or oversimplification patterns (-10 to -20 points)
     - Use multiple concrete examples from responses for scoring justification.
     - Final score (0-100) reflects overall cognitive processing sophistication.
  
  2. EMOTIONAL INTELLIGENCE SCORE CALCULATION:
     - Base score begins at ${emotionalBaseScore}/100 based on question coverage/quality.
     - Evaluate specific emotional intelligence indicators with *increased depth*:
       * Nuanced self-awareness and understanding of inner conflicts (+10-25 points)
       * Accurate and empathetic interpretation of others' complex emotions (+10-20 points)
       * Advanced emotional regulation and resilience strategies (+10-25 points)
       * Deep empathy and compassionate responding (+10-15 points)
       * Sophisticated social navigation and influence (+5-15 points)
       * Articulation of complex emotional states and experiences (+5-15 points)
       * Mature integration of emotion and reasoning in decision-making (+5-15 points)
     - Identify emotional reactivity, avoidance, or lack of insight (-10 to -20 points)
     - Use multiple concrete examples from responses for scoring justification.
     - Final score (0-100) reflects overall emotional maturity and intelligence.
  
  ## Analysis Requirements - FOLLOW THESE EXACTLY (DEEP ANALYSIS)

  1. DEEP SYNTHESIS REQUIRED:
     - Go beyond surface patterns. Synthesize insights across *multiple* categories and seemingly unrelated responses to reveal deeper underlying dynamics.
     - Identify subtle, complex, and potentially contradictory patterns requiring careful interpretation.
     - Use the large volume of responses (100) to build a highly robust and multi-faceted profile.

  2. OBJECTIVELY BALANCED & NUANCED:
     - Provide a balanced view, identifying significant strengths AND challenges/flaws with specific evidence.
     - Avoid idealization. Describe potential negative traits or maladaptive patterns constructively but directly.
     - Use nuanced language; avoid black-and-white descriptions.

  3. COMPLEXITY & CONTRADICTIONS:
     - Actively seek out and analyze contradictions or tensions between different responses or traits.
     - Explain these as integral parts of the individual's complex personality, not just inconsistencies.
     - Discuss the *implications* of these internal tensions.

  4. ABSOLUTELY NO GENERIC STATEMENTS:
     - CRITICAL: Every single statement MUST be grounded in specific evidence from the 100 responses.
     - Each trait description must detail unique behavioral manifestations hypothesized from *this specific data set*.
     - Constantly ask: "Could this apply to almost anyone?" If yes, revise to be more specific.

  5. EXTREME PERSONALIZATION:
     - The analysis must feel uniquely tailored, reflecting insights only derivable from this extensive 100-question data set.
     - Extensively quote or paraphrase specific, revealing responses.
     - Mirror the user's language and complexity where appropriate.

  6. OUTPUT LENGTH AND DETAIL REQUIREMENTS (SIGNIFICANTLY INCREASED):
     - Provide AT LEAST 18-22 distinct personality traits with highly detailed descriptions.
     - EACH trait description must be comprehensive: strengths, challenges, *likely behavioral manifestations*, underlying dynamics, and specific growth suggestions.
     - Include AT LEAST 8-10 distinct domains for cognitive assessment.
     - Include a MINIMUM of 15-18 core value system elements derived from responses.
     - Write an IN-DEPTH overview of at least 1000-1200 words, synthesizing the core personality structure, key dynamics, major strengths, and critical growth areas.
     - Include AT MINIMUM 10-12 significant growth areas with actionable, personalized development steps.
     - Your analysis MUST BE EXHAUSTIVE AND DEEPLY SYNTHESIZED.
     - Ensure ALL sections in the Output Format are populated with rich detail.

  7. SHADOW ASPECTS, BIASES, DEFENSES:
     - Dedicate specific attention to identifying potential shadow aspects, cognitive biases, and defense mechanisms suggested by patterns in the 100 responses.
     - Discuss their potential impact on behavior and perception.
     - Highlight potential discrepancies between self-perception and observed patterns.

  8. ADVANCED COGNITIVE PROFILE:
     - Provide a detailed analysis of the user's cognitive processing style, including preferred modes of thinking, information processing patterns, learning styles, and problem-solving heuristics identified from the responses.

  9. DEEPER ANALYSIS - ENHANCED REQUIREMENTS:
     - **Trait Interplay & Dynamics:** Analyze the complex interplay between *multiple* key traits. How do core traits form a dynamic system? Discuss reinforcing loops and points of conflict based on extensive evidence.
     - **Potential Origins & Development:** Based on patterns across the 100 responses, cautiously hypothesize potential developmental influences or origins for 2-3 core personality patterns or challenges. Frame these clearly as interpretations based *only* on the provided text.
     - **Contextual Behavior:** For several key traits, describe how they might manifest differently in various contexts (e.g., under stress, in collaborative settings, in leadership roles) based on response analysis.

  ## Output Format (DEEP ANALYSIS)
  Return your analysis as a structured JSON object adhering strictly to this format:

  {
    "id": "${assessmentId}",
    "createdAt": "current timestamp",
    "overview": "IN-DEPTH (1000-1200+ words) synthesis of personality structure, dynamics, strengths, challenges, citing extensive evidence from the 100 responses.",
    "traits": [ // MINIMUM 18-22 traits
      {
        "trait": "Specific, nuanced trait name with evidence",
        "score": score (0-10),
        "description": "Highly detailed description including specific examples, underlying dynamics, and hypothesized behavioral manifestations in different contexts.",
        "strengths": ["list", "of", "specific strengths with extensive evidence"],
        "challenges": ["list", "of", "specific challenges/potential downsides with evidence and impact analysis"],
        "growthSuggestions": ["list", "of", "actionable, personalized growth suggestions"]
      }
      // ... more traits ...
    ],
    "intelligence": {
      "type": "Detailed cognitive processing style analysis",
      "score": score (0-10),
      "description": "In-depth description of thinking patterns, problem-solving approaches, learning style, communication patterns.",
      "domains": [ // MINIMUM 8-10 domains
        {
          "name": "Cognitive Domain (e.g., 'Abstract Reasoning', 'Systems Thinking', etc.)",
          "score": score (0-10),
          "description": "Detailed description with multiple supporting examples from responses."
        }
        // ... more domains ...
      ]
    },
    "intelligenceScore": score (0-100, labeled as "Cognitive Flexibility Score"),
    "emotionalIntelligenceScore": score (0-100),
    "cognitiveStyle": {
      "primary": "Primary style with extensive evidence",
      "secondary": "Secondary style with evidence",
      "description": "Detailed explanation of cognitive style, including complexities, tensions, and context-dependent variations."
    },
    "valueSystem": ["List of core values (MINIMUM 15-18) with specific response evidence and potential priority/hierarchy"],
    "motivators": ["List of key motivators, analyzed for depth and potential conflicts, with evidence"],
    "inhibitors": ["List of inhibitors/demotivators, analyzed for impact, with evidence"],
    "weaknesses": [
      "List of significant weaknesses/challenges identified from patterns, with honest but constructive analysis of impact and potential origins."
    ],
    "shadowAspects": [
      "Detailed exploration of potential unconscious/denied aspects, cognitive biases, defense mechanisms, with strong evidence."
    ],
    "growthAreas": ["List of significant growth areas (MINIMUM 10-12) with specific, actionable, personalized development strategies."],
    "relationshipPatterns": {
      "strengths": ["Detailed relationship strengths with evidence"],
      "challenges": ["Detailed relationship challenges with evidence and potential dynamics"],
      "compatibleTypes": ["Analysis of compatible interaction styles and potential relationship needs/pitfalls."]
    },
    "careerSuggestions": ["Thoughtful career suggestions aligned with deep analysis of traits, style, values, motivators."],
    "learningPathways": ["Specific learning/development approaches suited to cognitive style and identified growth areas."],
    "roadmap": "Comprehensive, personalized development roadmap with phased milestones and suggested resources/practices."
  }

  IMPORTANT FINAL CHECK (DEEP ANALYSIS):
  - ENSURE your analysis includes AT MINIMUM 18-22 TRAITS.
  - Ensure ALL sections are present and populated with SIGNIFICANT DETAIL AND DEPTH, drawing from the full 100 responses.
  - Verify that analysis is HIGHLY PERSONALIZED and avoids generic statements.
  - Check that justifications and specific examples FROM THE RESPONSES are abundant.
  - Double-check JSON structure validity and completeness.
  `;

  // Refined system prompt for DEEP analysis
  const systemPromptContent = 'You are an expert psychological assessment analyst performing a DEEP analysis based on 100 questions. Your primary task is to generate a highly personalized, evidence-based personality analysis based *strictly* on the users provided assessment data and instructions. Key requirements: 1. Output MUST be a valid JSON object adhering EXACTLY to the format specified in the user prompt. 2. Analysis MUST be objective, balanced, nuanced, and synthesized from the extensive data, avoiding generic descriptions AT ALL COSTS. 3. Refer to "intelligence" as "cognitive processing" or "cognitive flexibility". 4. ALWAYS cite multiple specific examples from user responses as evidence.';

  try {
    console.log(`[${assessmentId}] Preparing OpenAI API request for DEEP analysis using gpt-4.1 model`);
    console.log(`[${assessmentId}] Number of categories to analyze:`, Object.keys(responsesByCategory).length);
    console.log(`[${assessmentId}] Total prompt length:`, prompt.length);
    
    // Create a unique seed based on assessment ID and timestamp for consistent but unique results
    // This ensures two users with similar answers won't get identical results
    const uniqueSeed = parseInt(assessmentId.split('-')[0], 16) % 10000 + Date.now() % 1000;
    console.log(`[${assessmentId}] Using seed for analysis:`, uniqueSeed);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1',  // Using gpt-4.1 for deep analysis
        messages: [
          { 
            role: 'system', 
            content: systemPromptContent // Use refined system prompt
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 16000, // Set maximum token count to 16,000
        seed: uniqueSeed, // Use unique seed for unique but consistent results
        temperature: 0.7  // Balanced temperature for creative but coherent analysis
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        errorData = { error: { message: await response.text() } };
      }
      const errorPayload = {
        level: 'error',
        message: `OpenAI API error: ${errorData.error?.message || response.statusText || 'Unknown API error'}`,
        assessmentId: assessmentId,
        functionName: 'generateAIAnalysis (API call - deep)',
        errorType: 'OpenAIError',
        apiStatus: response.status,
        apiHeaders: Object.fromEntries(response.headers.entries()),
        apiResponseBody: errorData, // Log the actual error body from OpenAI
        timestamp: new Date().toISOString()
      };
      console.error("OpenAI API error details (deep):", JSON.stringify(errorPayload, null, 2));
      throw new Error(errorPayload.message); // Throw simple message for main handler
    }

    const data = await response.json();
    console.log(`[${assessmentId}] Received response from OpenAI gpt-4.1 model`);
    console.log(`[${assessmentId}] Response token usage:`, data.usage);
    
    try {
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        const errorMsg = "Invalid response format from OpenAI";
        console.error(`[${assessmentId}] ${errorMsg}:`, JSON.stringify(data));
        throw new Error(errorMsg);
      }
      
      const analysisJson = JSON.parse(data.choices[0].message.content);
      console.log(`[${assessmentId}] Successfully parsed OpenAI response to JSON`);
      console.log(`[${assessmentId}] Analysis overview length:`, analysisJson.overview?.length || 0);
      console.log(`[${assessmentId}] Analysis traits count:`, analysisJson.traits?.length || 0);
      
      // Make sure createdAt is set correctly
      if (!analysisJson.createdAt || analysisJson.createdAt === "current timestamp") {
        analysisJson.createdAt = new Date().toISOString();
      }
      
      // Ensure shadowAspects is always an array
      if (!analysisJson.shadowAspects) {
        analysisJson.shadowAspects = [];
      }
      
      // Log some key metrics to help verify the quality of the analysis
      console.log(`[${assessmentId}] Analysis generated with cognitive flexibility score: ${analysisJson.intelligenceScore}, emotional intelligence: ${analysisJson.emotionalIntelligenceScore}`);
      console.log(`[${assessmentId}] Identified ${analysisJson.traits?.length || 0} personality traits and ${analysisJson.weaknesses?.length || 0} potential weaknesses`);
      console.log(`[${assessmentId}] Total response tokens used: ${data.usage.completion_tokens} out of ${data.usage.total_tokens}`);
      
      return analysisJson as PersonalityAnalysis;
    } catch (error: any) {
      const timestamp = new Date().toISOString();
      const errorPayload = {
        level: 'error',
        message: `Error parsing OpenAI response: ${error.message || 'Unknown parse error'}`,
        assessmentId: assessmentId,
        functionName: 'generateAIAnalysis (parsing - deep)',
        errorType: error.constructor?.name || 'ParseError',
        rawResponseContent: data.choices?.[0]?.message?.content, // Log raw content on parse failure
        stack: error.stack,
        timestamp: timestamp
      };
      console.error("Error parsing OpenAI response details (deep):", JSON.stringify(errorPayload, null, 2));
      throw new Error(errorPayload.message); // Throw simple message for main handler
    }
  } catch (error: any) {
    const timestamp = new Date().toISOString();
    const errorPayload = {
        level: 'error',
        message: `Failed to generate AI analysis: ${error.message || 'Unknown error in generateAIAnalysis'}`,
        assessmentId: assessmentId,
        functionName: 'generateAIAnalysis (outer try - deep)',
        errorType: error.constructor?.name || 'Error',
        stack: error.stack,
        timestamp: timestamp
      };
    console.error("Error generating AI analysis details (deep):", JSON.stringify(errorPayload, null, 2));
    throw error; // Re-throw original error to be caught by the retry loop/main handler
  }
}

// Helper function to calculate base score for cognitive/emotional intelligence from category coverage
function calculateBaseScore(
  categoryCoverage: Record<string, {
    count: number,
    expected: number,
    percentage: number,
    responseQuality: number
  }>,
  relevantCategories: string[]
): number {
  // Get average coverage percentage and quality across relevant categories
  let totalPercentage = 0;
  let totalQuality = 0;
  let categoriesFound = 0;

  for (const category of relevantCategories) {
    if (categoryCoverage[category]) {
      totalPercentage += categoryCoverage[category].percentage;
      totalQuality += categoryCoverage[category].responseQuality;
      categoriesFound++;
    }
  }

  // Default base score if no relevant categories were found
  if (categoriesFound === 0) {
    return 50; // Neutral starting point
  }

  // Calculate averages
  const avgPercentage = totalPercentage / categoriesFound;
  const avgQuality = totalQuality / categoriesFound;

  // Calculate base score: 70% weight on coverage, 30% on quality
  // Scale to 40-70 range as base score (allows room for specific factor adjustments)
  const baseScore = Math.round(((avgPercentage * 0.7) + (avgQuality * 100 * 0.3)) * 0.3) + 40;
  
  // Clamp score between 40 and 70
  return Math.min(70, Math.max(40, baseScore));
}
