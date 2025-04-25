import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AssessmentResponse, PersonalityAnalysis, QuestionCategory } from "./types.ts";

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let assessmentId: string | null = null; // Keep assessmentId accessible in catch block

  try {
    console.log("Received request to analyze-responses");
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
    
    console.log(`[${assessmentId}] Analysis completed successfully`);
    console.log(`[${assessmentId}] Analysis ID:`, analysis.id);
    console.log(`[${assessmentId}] Analysis contains traits:`, analysis.traits?.length || 0);
    console.log(`[${assessmentId}] Intelligence score:`, analysis.intelligenceScore);
    console.log(`[${assessmentId}] Emotional intelligence score:`, analysis.emotionalIntelligenceScore);
    
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const timestamp = new Date().toISOString();
    const errorPayload = {
      level: 'error',
      message: error.message || 'Unknown error in analyze-responses function',
      assessmentId: assessmentId || 'unknown',
      functionName: 'analyze-responses handler',
      errorType: error.constructor?.name || 'Error',
      stack: error.stack,
      timestamp: timestamp
    };
    console.error("Error in analyze-responses function:", JSON.stringify(errorPayload, null, 2));

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
  const expectedQuestionCounts: Record<string, number> = {
    personality: 5,
    emotional: 5, 
    cognitive: 5,
    values: 5,
    motivation: 5,
    resilience: 5,
    social: 5,
    decision: 5,
    creativity: 5,
    leadership: 5
  };
  
  const coverage: Record<string, { 
    count: number, 
    expected: number, 
    percentage: number,
    responseQuality: number // 0-1 based on average response quality
  }> = {};
  
  for (const [category, responses] of Object.entries(responsesByCategory)) {
    const expected = expectedQuestionCounts[category] || 5;
    const count = responses.length;
    const percentage = Math.min(100, Math.round((count / expected) * 100));
    
    // Calculate response quality based on whether custom responses were provided
    // and how substantive they appear to be - now with more critical evaluation
    const responseQuality = responses.reduce((sum, response) => {
      let quality = 0.4; // Lower default quality
      
      // Evaluate quality based on option selected - options at the end of the list (e/f)
      // generally indicate less sophisticated responses and get penalized
      if (response.selectedOption) {
        // Extract the option letter from the ID (e.g., "q31-a" -> "a")
        const optionLetter = response.selectedOption.split('-')[1] || '';
        
        // Assign quality score based on the option letter
        // Note: This is just an example, in reality we'd want to evaluate the actual response
        switch(optionLetter) {
          case 'a': quality = 0.8; break; // Usually insightful responses
          case 'b': quality = 0.7; break; // Often thoughtful responses
          case 'c': quality = 0.6; break; // Moderate responses
          case 'd': quality = 0.5; break; // Basic responses
          case 'e': quality = 0.3; break; // Potentially problematic responses
          case 'f': quality = 0.2; break; // Often indicates lack of insight
          default: quality = 0.4;
        }
      }
      
      // Higher quality for custom responses with substantial content
      if (response.customResponse && response.customResponse.trim().length > 0) {
        quality = Math.max(quality, 0.5); // Base score for any custom response
        
        // If response includes detailed explanations (more than 100 chars)
        if (response.customResponse.length > 100) {
          quality = Math.max(quality, 0.7);
        }
        // If response is very detailed (more than 200 chars)
        if (response.customResponse.length > 200) {
          quality = Math.max(quality, 0.9);
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

  // Create a more specific and comprehensive prompt for analysis
  const prompt = `You are an expert psychological profiler specializing in evidence-based, highly personalized assessments. Your task is to analyze assessment responses to create a truly individualized personality profile that is objective, balanced, deep, and reflects both positive traits and potential challenges using nuanced language.

  ## Assessment Data
  The user has answered questions across ${Object.keys(responsesByCategory).length} categories (${categoryCounts}):

  ## DETAILED RESPONSES - USE THESE FOR SPECIFIC EVIDENCE IN YOUR ANALYSIS
  ${categoryDetailedResponses}

  ## Cognitive and Emotional Intelligence Scoring Requirements

  1. COGNITIVE FLEXIBILITY SCORE CALCULATION:
     - Base score begins at ${cognitiveBaseScore}/100 based on question coverage
     - Evaluate specific cognitive indicators:
       * Ability to consider multiple perspectives simultaneously (+10-20 points)
       * Pattern recognition across disparate domains (+5-15 points)
       * Comfort with ambiguity and uncertainty (+5-15 points)
       * Strategic thinking and mental simulation abilities (+5-10 points)
       * Information processing speed and efficiency (+5-10 points)
       * Analytical depth demonstrated in responses (+5-15 points)
       * Creative problem-solving approaches (+5-15 points)
     - Identify cognitive rigidity or fixed thinking patterns (-5 to -15 points)
     - Consider evidence of cognitive biases and their awareness (-5 to +10 points)
     - Use concrete examples from their responses as evidence for your scoring
     - Final score should be 0-100, normalized based on all factors

  2. EMOTIONAL INTELLIGENCE SCORE CALCULATION:
     - Base score begins at ${emotionalBaseScore}/100 based on question coverage
     - Evaluate specific emotional intelligence indicators:
       * Self-awareness of own emotional states (+10-20 points)
       * Recognition of emotions in others (+5-15 points)
       * Emotional regulation capabilities (+10-20 points)
       * Empathy demonstrated in responses (+5-15 points)
       * Social awareness and relationship management (+5-15 points)
       * Ability to articulate complex emotional experiences (+5-10 points)
       * Integration of emotion with reasoning (+5-15 points)
     - Identify emotional regulation challenges or blind spots (-5 to -15 points)
     - Consider evidence of emotional depth versus superficiality (-10 to +10 points)
     - Use concrete examples from their responses as evidence for your scoring
     - Final score should be 0-100, normalized based on all factors

  ## Analysis Requirements - FOLLOW THESE EXACTLY

  1. CONSIDER ALL RESPONSES, not just patterns:
     - You MUST evaluate and consider EVERY individual response, not just general patterns
     - Identify unique combinations of traits that would not apply to most people
     - If you cite a pattern, give at least 2-3 specific response examples that support it
     - Make full use of the available context window to analyze as many responses as possible
     
  2. BE OBJECTIVELY BALANCED:
     - Do NOT portray the individual as only positive or idealized
     - Identify and describe potential negative traits, character flaws, or challenges revealed through responses
     - Be honest about limitations or weaknesses, but phrase them constructively and with nuance
     - Don't sugarcoat responses that reveal difficult traits like arrogance, selfishness, manipulative tendencies, etc.
     - Look for patterns of cognitive biases, defense mechanisms, or blind spots in their thinking

  3. IDENTIFY CONTRADICTIONS AND TENSIONS:
     - Look for contradictory or seemingly inconsistent answers
     - Identify and explain these tensions as part of the personality complexity
     - When finding contradictions, cite the specific responses that contradict each other
     - Explain what these contradictions reveal about the person's nuanced personality and inner dynamics

  4. AVOID GENERIC DESCRIPTIONS:
     - CRITICAL: NEVER use vague statements that could apply to anyone (e.g., "you are sometimes outgoing and sometimes shy")
     - Each trait description must include specific behaviors or thought patterns hypothesized from this individual's unique responses
     - Provide concrete examples or direct quotes from their responses that showcase uniqueness
     - Do not use Barnum statements or generalities that most people would agree with

  5. PERSONALIZATION REQUIREMENTS:
     - Your analysis must feel deeply custom-tailored to this specific individual
     - Include specific percentile rankings where appropriate (e.g., "Your analytical thinking appears to be in the top 12% based on these responses")
     - Reference the specific content and *phrasing* of their responses, not just the patterns
     - Subtly mirror the vocabulary and communication style evident in their written responses where appropriate, without being unnatural.

  6. OUTPUT LENGTH AND DETAIL REQUIREMENTS (INCREASED):
     - Provide AT LEAST 14-16 distinct personality traits with detailed descriptions
     - EACH trait must have a complete description with strengths, challenges, and growth suggestions. Ensure depth and nuance in these descriptions.
     - DO NOT SKIP OR ABBREVIATE ANY TRAIT - fully describe each one
     - Include AT LEAST 6-7 domains for cognitive intelligence assessment
     - Include a MINIMUM of 10-12 value system elements derived directly from responses
     - Write a COMPREHENSIVE overview of at least 750 words, synthesizing key findings and personality dynamics.
     - Include AT MINIMUM 7-9 growth areas with specific, actionable development suggestions tied directly to the analysis.
     - Your analysis MUST BE EXHAUSTIVE - don't leave any sections incomplete or superficial
     - The analysis MUST include all the sections in the Output Format below

  7. SHADOW ASPECTS AND BLIND SPOTS:
     - Identify potential shadow aspects (unconscious or denied parts of personality) with supporting evidence from response patterns or contradictions.
     - Describe possible blind spots based on response patterns or omissions.
     - Note any defense mechanisms or cognitive biases evident in responses, explaining their potential impact.
     - Highlight areas where self-perception might differ from the impression given by their responses, citing specific inconsistencies.

  8. COGNITIVE PROCESSING PROFILE:
     - When analyzing cognitive patterns, examine specific examples of problem-solving approaches, reasoning steps, and assumptions evident in their responses
     - Use response content to evaluate their communication style (e.g., directness, verbosity, structure) and thought organization
     - Analyze tensions between different cognitive approaches (e.g., analytical vs. intuitive) apparent in their answers
     - Base cognitive assessments on specific response patterns and content, not generic typing
     - Label this as "Cognitive Processing Style" rather than just intelligence

  9. DEEPER ANALYSIS - NEW REQUIREMENTS:
     - **Trait Interplay:** Explicitly discuss how 2-3 key identified traits might interact, conflict, or reinforce each other within the individual's personality structure. Provide examples based on responses.
     - **Potential Origins:** For 1-2 significant traits or challenges, cautiously speculate on potential underlying origins or contributing factors suggested by the patterns in their responses (e.g., "This pattern *might* stem from...", "The responses *could suggest* an emphasis on..."). Frame these as hypotheses based *only* on the provided text.
     - **Behavioral Manifestations:** For each major trait, describe 1-2 specific, concrete *hypothetical* behaviors that might manifest based on the response analysis (e.g., "Given this pattern, in a team setting, they might tend to...").

  ## Output Format
  Return your analysis as a structured JSON object with the following properties:

  {
    "id": "${assessmentId}",
    "createdAt": "current timestamp",
    "overview": "COMPREHENSIVE (750+ words) and highly specific summary paragraph that cites unique response patterns, discusses key personality dynamics and interplay, and avoids generic descriptions",
    "traits": [ // MINIMUM 14-16 traits
      {
        "trait": "specific trait name with evidence",
        "score": score (0-10), // Ensure scoring reflects nuanced analysis
        "description": "detailed description with specific examples, discussing nuance and potential behavioral manifestations",
        "strengths": ["list", "of", "specific strengths with reference to response patterns"],
        "challenges": ["list", "of", "specific challenges with direct supporting evidence and potential impact"],
        "growthSuggestions": ["list", "of", "personalized, actionable growth suggestions"]
      }
      // ... more traits ...
    ],
    "intelligence": {
      "type": "specific cognitive processing style - highly personalized",
      "score": score (0-10),
      "description": "detailed description of thinking patterns, including communication style and problem-solving approach",
      "domains": [ // MINIMUM 6-7 domains
        {
          "name": "domain name (e.g., 'Pattern Recognition', 'Analytical Processing', 'Abstract Reasoning', etc.)",
          "score": score (0-10),
          "description": "description with specific supporting evidence from responses"
        }
        // ... more domains ...
      ]
    },
    "intelligenceScore": score (0-100, labeled as "Cognitive Flexibility Score"), // Final calculated score
    "emotionalIntelligenceScore": score (0-100), // Final calculated score
    "cognitiveStyle": {
      "primary": "primary style with evidence",
      "secondary": "secondary style with evidence",
      "description": "detailed explanation citing specific response contradictions and complexities, discussing tensions between styles"
    },
    "valueSystem": ["list of core values (MINIMUM 10-12) with specific response evidence for each"],
    "motivators": ["list of key motivators with specific response examples and discussion of their potential strength"],
    "inhibitors": ["list of inhibitors or demotivators with supporting evidence from responses"],
    "weaknesses": [
      "list of weaknesses/challenges with evidence from responses - be honest but constructive, explaining potential impact"
    ],
    "shadowAspects": [
      "list of potential unconscious or denied personality aspects suggested by response patterns or contradictions, with evidence"
    ],
    "growthAreas": ["list of growth areas (MINIMUM 7-9) with specific, actionable development suggestions tied to analysis"],
    "relationshipPatterns": {
      "strengths": ["relationship strengths with evidence"],
      "challenges": ["relationship challenges with evidence"],
      "compatibleTypes": ["discussion of compatible interaction styles based on specific patterns"]
    },
    "careerSuggestions": ["list of career suggestions aligned with identified traits, cognitive style, and motivators"],
    "learningPathways": ["list of learning approaches suited to cognitive style and identified challenges"],
    "roadmap": "personalized development roadmap with measurable milestones and suggested first steps"
    // Consider adding new optional fields here in the future if needed, e.g., "potentialBiases", "communicationStyleAnalysis"
  }

  IMPORTANT FINAL CHECK:
  - ENSURE your analysis includes AT MINIMUM 14-16 TRAITS - this is a critical requirement
  - Include ALL traits with scores, detailed descriptions, strengths, challenges and growth suggestions
  - Make sure your analysis doesn't skip or abbreviate ANY required section or substep described above. Depth is key.
  - Verify that you've provided personalized, specific examples and justifications FROM THE RESPONSES for all claims.
  - Double-check that ALL fields in the specified JSON structure are properly populated with detailed, non-generic content.
  `;

  try {
    console.log(`[${assessmentId}] Preparing OpenAI API request for analysis using gpt-4.1 model`);
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
        model: 'gpt-4.1',  // Using gpt-4.1 for accurate analysis
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert psychological assessment analyst. Your primary task is to generate a highly personalized, evidence-based personality analysis based *strictly* on the user\'s provided assessment data and instructions. Key requirements: 1. Output MUST be a valid JSON object adhering EXACTLY to the format specified in the user prompt. 2. Analysis MUST be objective, balanced, and avoid generic descriptions or Barnum statements AT ALL COSTS. 3. Refer to "intelligence" as "cognitive processing" or "cognitive flexibility". 4. ALWAYS cite specific examples from user responses as evidence.'
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 16000, // Set maximum token count to 16,000 to maximize output
        seed: uniqueSeed, // Use unique seed for unique but consistent results
        temperature: 0.7,  // Balanced temperature for creative but coherent analysis
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
        functionName: 'generateAIAnalysis (API call)',
        errorType: 'OpenAIError',
        apiStatus: response.status,
        apiHeaders: Object.fromEntries(response.headers.entries()),
        apiResponseBody: errorData, // Log the actual error body from OpenAI
        timestamp: new Date().toISOString()
      };
      console.error("OpenAI API error details:", JSON.stringify(errorPayload, null, 2));
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
        functionName: 'generateAIAnalysis (parsing)',
        errorType: error.constructor?.name || 'ParseError',
        rawResponseContent: data.choices?.[0]?.message?.content, // Log raw content on parse failure
        stack: error.stack,
        timestamp: timestamp
      };
      console.error("Error parsing OpenAI response details:", JSON.stringify(errorPayload, null, 2));
      throw new Error(errorPayload.message); // Throw simple message for main handler
    }
  } catch (error: any) {
    const timestamp = new Date().toISOString();
    const errorPayload = {
        level: 'error',
        message: `Failed to generate AI analysis: ${error.message || 'Unknown error in generateAIAnalysis'}`,
        assessmentId: assessmentId,
        functionName: 'generateAIAnalysis (outer try)',
        errorType: error.constructor?.name || 'Error',
        stack: error.stack,
        timestamp: timestamp
      };
    console.error("Error generating AI analysis details:", JSON.stringify(errorPayload, null, 2));
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
    return 40; // Lower neutral starting point
  }

  // Calculate averages
  const avgPercentage = totalPercentage / categoriesFound;
  const avgQuality = totalQuality / categoriesFound;

  // Calculate base score: 60% weight on coverage, 40% on quality
  // Scale to 30-60 range as base score (allows room for specific factor adjustments)
  const baseScore = Math.round(((avgPercentage * 0.6) + (avgQuality * 100 * 0.4)) * 0.3) + 30;
  
  // Clamp score between 30 and 60
  return Math.min(60, Math.max(30, baseScore));
}
