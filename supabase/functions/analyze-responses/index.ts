
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

  try {
    console.log("Received request to analyze-responses");
    const { responses, assessmentId } = await req.json();
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid responses data:", JSON.stringify(responses));
      throw new Error("Invalid or missing responses data");
    }

    console.log(`Processing ${responses.length} responses for assessment ID: ${assessmentId}`);
    console.log(`Response categories: ${[...new Set(responses.map(r => r.category))].join(', ')}`);
    
    // Log a sample of the responses to verify data structure
    console.log("Sample responses (first 2):", JSON.stringify(responses.slice(0, 2)));
    
    // Clean and serialize responses for analysis
    const cleanedResponses = responses.map(r => ({
      ...r,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString()
    }));
    
    // Group responses by category for analysis
    const responsesByCategory = categorizeResponses(cleanedResponses);
    console.log(`Categorized into ${Object.keys(responsesByCategory).length} categories`);
    
    // Calculate category coverage - how many questions were answered in each category
    const categoryCoverage = calculateCategoryCoverage(responsesByCategory);
    console.log("Category coverage:", JSON.stringify(categoryCoverage));
    
    // Generate the AI analysis using OpenAI's API
    const analysis = await generateAIAnalysis(responsesByCategory, assessmentId, categoryCoverage);
    
    console.log("Analysis completed successfully");
    console.log("Analysis ID:", analysis.id);
    console.log("Analysis contains traits:", analysis.traits?.length || 0);
    console.log("Intelligence score:", analysis.intelligenceScore);
    console.log("Emotional intelligence score:", analysis.emotionalIntelligenceScore);
    
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in analyze-responses function:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
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
  
  console.log("Base cognitive score from coverage:", cognitiveBaseScore);
  console.log("Base emotional intelligence score from coverage:", emotionalBaseScore);

  // Generate detailed summaries of individual responses to reference in the analysis
  const categoryDetailedResponses = Object.entries(responsesByCategory).map(([category, responses]) => {
    const responseSummaries = responses.map((r, index) => 
      `Response ${index+1}: "${r.selectedOption || r.customResponse || "No answer"}" (Timestamp: ${r.timestamp})`
    ).join('\n');
    return `CATEGORY: ${category.toUpperCase()}\n${responseSummaries}`;
  }).join('\n\n');

  // Create a more specific and comprehensive prompt for analysis
  const prompt = `
  You are an expert psychological profiler specializing in evidence-based, highly personalized assessments. Your task is to analyze assessment responses to create a truly individualized personality profile that is objective, balanced, and reflects both positive traits and potential challenges.
  
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
     - SCORING MUST BE CONSISTENT and evidence-based with clear reasoning
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
     - SCORING MUST BE CONSISTENT and evidence-based with clear reasoning
     - Final score should be 0-100, normalized based on all factors
  
  ## Analysis Requirements - FOLLOW THESE EXACTLY
  
  1. CONSIDER ALL RESPONSES, not just patterns:
     - You MUST evaluate and consider EVERY individual response, not just general patterns
     - Identify unique combinations of traits that would not apply to most people
     - If you cite a pattern, give at least 2-3 specific response examples that support it
     
  2. BE OBJECTIVELY BALANCED:
     - Do NOT portray the individual as only positive or idealized
     - Identify and describe potential negative traits, character flaws, or challenges revealed through responses
     - Be honest about limitations or weaknesses, but phrase them constructively
     - Don't sugarcoat responses that reveal difficult traits like arrogance, selfishness, manipulative tendencies, etc.
     - Look for patterns of cognitive biases, defense mechanisms, or blind spots in their thinking
  
  3. IDENTIFY CONTRADICTIONS AND TENSIONS:
     - Look for contradictory or seemingly inconsistent answers
     - Identify and explain these tensions as part of the personality complexity
     - When finding contradictions, cite the specific responses that contradict each other
     - Explain what these contradictions reveal about the person's nuanced personality
  
  4. AVOID GENERIC DESCRIPTIONS:
     - NEVER use vague statements that could apply to anyone (e.g., "you are sometimes outgoing and sometimes shy")
     - Each trait description must include specific behaviors or thought patterns unique to this individual
     - Provide concrete examples from their responses that showcase uniqueness
     - Do not use Barnum statements or generalities that most people would agree with
  
  5. PERSONALIZATION REQUIREMENTS:
     - Your analysis must feel custom-tailored to this specific individual
     - Include specific percentile rankings where appropriate (e.g., "Your analytical thinking is in the top 12% of respondents")
     - Reference the specific content of their responses, not just the patterns
     - Use the same vocabulary and communication style evident in their written responses
  
  6. OUTPUT LENGTH AND DETAIL REQUIREMENTS:
     - EXTREMELY IMPORTANT: Write LENGTHY, DETAILED content for each section
     - Aim for 500-800 words for the overview section
     - For each trait description, write at least 250-300 words with multiple paragraphs
     - Include at least 8-12 distinct personality traits
     - Include 10-15 growth suggestions for each trait
     - Write lengthy descriptions for cognitive processing styles - at least 300 words
     - Provide extremely detailed explanations with examples for all sections
     - The total analysis should be comprehensive - aim for 5000-8000 words total
  
  7. SHADOW ASPECTS AND BLIND SPOTS:
     - Identify potential shadow aspects (unconscious or denied parts of personality)
     - Describe possible blind spots based on response patterns
     - Note any defense mechanisms or cognitive biases evident in responses
     - Highlight areas where self-perception might differ from reality based on response inconsistencies
  
  8. COGNITIVE PROCESSING PROFILE:
     - When analyzing cognitive patterns, examine specific examples of problem-solving approaches from their responses
     - Use response content to evaluate their communication style and thought organization
     - Look for tensions between different cognitive approaches in their answers
     - Base cognitive assessments on specific response patterns, not generic typing
     - Label this as "Cognitive Processing Style" rather than intelligence
  
  ## Output Format
  Return your analysis as a structured JSON object with the following properties:
  
  {
    "id": "${assessmentId}",
    "createdAt": "current timestamp",
    "overview": "highly specific summary paragraph that cites unique response patterns and avoids generic descriptions - make this at least 500-800 words",
    "traits": [
      {
        "trait": "specific trait name with evidence",
        "score": score (0-10),
        "description": "detailed description with specific examples - at least 250-300 words per trait",
        "strengths": ["list", "of", "specific strengths with reference to response patterns - include at least 5-8 items"],
        "challenges": ["list", "of", "specific challenges with direct supporting evidence - include at least 5-8 items"],
        "growthSuggestions": ["list", "of", "personalized growth suggestions - include at least 10-15 detailed suggestions"]
      }
    ],
    "intelligence": {
      "type": "specific cognitive processing style - highly personalized",
      "score": score (0-10),
      "description": "detailed description of thinking patterns - at least 300 words",
      "domains": [
        {
          "name": "domain name (e.g., 'Pattern Recognition', 'Analytical Processing', etc.)",
          "score": score (0-10),
          "description": "description with specific supporting evidence - at least 150 words per domain"
        }
      ]
    },
    "intelligenceScore": score (0-100, labeled as "Cognitive Processing Score"),
    "emotionalIntelligenceScore": score (0-100),
    "cognitiveStyle": {
      "primary": "primary style with evidence",
      "secondary": "secondary style with evidence",
      "description": "detailed explanation citing specific response contradictions and complexities - at least 300 words"
    },
    "valueSystem": ["list of core values with specific response evidence - at least 8-10 values with detailed descriptions"],
    "motivators": ["list of motivators with specific response examples - at least 8-10 detailed motivators"],
    "inhibitors": ["list of inhibitors with supporting evidence from responses - at least 6-8 detailed inhibitors"],
    "weaknesses": [
      "list of weaknesses with evidence from responses - be honest but constructive about legitimate weaknesses - include at least 6-8 items",
      "don't sugarcoat genuine issues revealed in their responses"
    ],
    "shadowAspects": [
      "list of potential unconscious or denied personality aspects suggested by response patterns - at least 5-8 items",
      "provide detailed explanations for each shadow aspect - at least 100 words per aspect"
    ],
    "growthAreas": ["list of growth areas with specific development suggestions tied to responses - at least 8-10 detailed areas"],
    "relationshipPatterns": {
      "strengths": ["relationship strengths with evidence - at least 6-8 detailed items"],
      "challenges": ["relationship challenges with evidence - at least 6-8 detailed items"],
      "compatibleTypes": ["compatible personality types based on specific patterns - at least 5-7 types with explanations"],
      "potentialConflictAreas": ["areas that might cause relationship difficulties based on response patterns - at least 6-8 areas"]
    },
    "careerSuggestions": ["list of career suggestions aligned with identified traits - at least 12-15 detailed career paths"],
    "learningPathways": ["list of learning approaches suited to cognitive style - at least 8-10 detailed approaches"],
    "roadmap": "personalized development roadmap with measurable milestones - at least 500 words"
  }
  
  IMPORTANT FINAL CHECKS:
  - Have you written DETAILED, LENGTHY content for each section?
  - Have you avoided generic Barnum statements that could apply to anyone?
  - Have you identified potential negative traits, weaknesses or shadow aspects honestly?
  - Have you identified unique contradictions or tensions in their response patterns?
  - Would your analysis feel custom-written to the individual based on their specific responses?
  - Is your analysis distinguishable from one you would write for someone with different responses?
  - Have you provided at least the minimum word count for each section?`;

  try {
    console.log("Preparing OpenAI API request for analysis using gpt-4o model");
    console.log("Number of categories to analyze:", Object.keys(responsesByCategory).length);
    console.log("Total prompt length:", prompt.length);
    
    // Create a unique seed based on assessment ID and timestamp for consistent but unique results
    // This ensures two users with similar answers won't get identical results
    const uniqueSeed = parseInt(assessmentId.split('-')[0], 16) % 10000 + Date.now() % 1000;
    console.log("Using seed for analysis:", uniqueSeed);
    
    // Set up the request for a very detailed output without using min_tokens parameter
    console.log("Setting up request for comprehensive analysis");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Using gpt-4o for accurate analysis
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert psychological assessment analyst specialized in highly personalized, evidence-based personality analysis. You provide objective, balanced analyses that avoid generic descriptions and Barnum statements. You identify both positive qualities and potential weaknesses or blind spots. You refer to "intelligence" as "cognitive processing" or "cognitive flexibility" and always cite specific examples from user responses to support your conclusions. You write LENGTHY, DETAILED content for each section of the analysis. Your outputs MUST be comprehensive, covering all required sections in detail.'
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 16000, // Set maximum token count to 16,000 only
        seed: uniqueSeed, // Use unique seed for unique but consistent results
        temperature: 0.7,  // Increased temperature for more creative, detailed responses
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", JSON.stringify(errorData));
      console.error("OpenAI API error status:", response.status);
      console.error("OpenAI API error headers:", Object.fromEntries(response.headers.entries()));
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI gpt-4o model");
    console.log("Response token usage:", data.usage);
    
    try {
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error("Unexpected OpenAI response format:", JSON.stringify(data));
        throw new Error("Invalid response format from OpenAI");
      }
      
      const analysisJson = JSON.parse(data.choices[0].message.content);
      console.log("Successfully parsed OpenAI response to JSON");
      console.log("Analysis overview length:", analysisJson.overview?.length || 0);
      console.log("Analysis traits count:", analysisJson.traits?.length || 0);
      
      // Make sure createdAt is set correctly
      if (!analysisJson.createdAt || analysisJson.createdAt === "current timestamp") {
        analysisJson.createdAt = new Date().toISOString();
      }
      
      // Ensure shadowAspects is always an array
      if (!analysisJson.shadowAspects) {
        analysisJson.shadowAspects = [];
      }
      
      // Validate analysis quality - ensure it's personalized by checking for specific elements
      const validationResults = validateAnalysisQuality(analysisJson);
      if (!validationResults.isValid) {
        console.error("Analysis quality validation warnings:", validationResults.warnings);
        // Continue anyway but log the warnings
      }
      
      // Log some key metrics to help verify the quality of the analysis
      console.log(`Analysis generated with cognitive flexibility score: ${analysisJson.intelligenceScore}, emotional intelligence: ${analysisJson.emotionalIntelligenceScore}`);
      console.log(`Identified ${analysisJson.traits?.length || 0} personality traits and ${analysisJson.weaknesses?.length || 0} potential weaknesses`);
      
      return analysisJson as PersonalityAnalysis;
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.error("Raw OpenAI response content:", data.choices?.[0]?.message?.content);
      throw new Error("Failed to parse AI analysis results: " + error.message);
    }
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    console.error("Error stack:", error.stack);
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
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

// Validate the quality of the analysis to ensure it's personalized and not generic
function validateAnalysisQuality(analysis: any) {
  const warnings: string[] = [];
  
  // Check that the overview isn't too short
  if (analysis.overview && analysis.overview.length < 300) {
    warnings.push(`Overview seems too short (${analysis.overview.length} characters) - we asked for 500-800 words`);
  }
  
  // Check that we have enough traits
  if (!analysis.traits || analysis.traits.length < 8) {
    warnings.push(`Not enough traits identified (${analysis.traits?.length || 0}) - we asked for 8-12 traits`);
  }
  
  // Check trait descriptions for length
  if (analysis.traits && analysis.traits.length > 0) {
    for (const trait of analysis.traits) {
      if (trait.description && trait.description.length < 200) {
        warnings.push(`Trait '${trait.trait}' has a short description (${trait.description.length} characters) - we asked for 250-300 words`);
      }
      
      // Check growth suggestions count
      if (!trait.growthSuggestions || trait.growthSuggestions.length < 8) {
        warnings.push(`Trait '${trait.trait}' has too few growth suggestions (${trait.growthSuggestions?.length || 0}) - we asked for 10-15`);
      }
    }
  }
  
  // Check for balanced analysis - make sure we have some weaknesses or shadow aspects identified
  if ((!analysis.weaknesses || analysis.weaknesses.length < 3) && 
      (!analysis.shadowAspects || analysis.shadowAspects.length < 3)) {
    warnings.push("Analysis may be too positively biased - not enough weaknesses or shadow aspects identified");
  }
  
  // Check roadmap length
  if (analysis.roadmap && analysis.roadmap.length < 300) {
    warnings.push(`Roadmap seems too short (${analysis.roadmap.length} characters) - we asked for at least 500 words`);
  }
  
  // Check intelligence scores for reasonableness
  if (analysis.intelligenceScore < 30 || analysis.intelligenceScore > 95) {
    warnings.push(`Intelligence score (${analysis.intelligenceScore}) seems extreme - verify calculations`);
  }
  
  if (analysis.emotionalIntelligenceScore < 30 || analysis.emotionalIntelligenceScore > 95) {
    warnings.push(`Emotional intelligence score (${analysis.emotionalIntelligenceScore}) seems extreme - verify calculations`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}
