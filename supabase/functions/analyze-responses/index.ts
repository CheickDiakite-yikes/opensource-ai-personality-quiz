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
    const requestData = await req.json();
    const { responses, assessmentId, retryCount = 0 } = requestData;
    
    // CRITICAL FIX: Check for retry information and log it
    if (retryCount > 0) {
      console.log(`⚠️ This is retry attempt #${retryCount} for assessment ID: ${assessmentId}`);
    }
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid responses data:", JSON.stringify(responses));
      throw new Error("Invalid or missing responses data");
    }

    console.log(`Processing ${responses.length} responses for assessment ID: ${assessmentId}`);
    console.log(`Response categories: ${[...new Set(responses.map(r => r.category))].join(', ')}`);
    
    // Add additional logging for debugging
    try {
      const categorySummary = [...new Set(responses.map(r => r.category))].map(category => {
        const count = responses.filter(r => r.category === category).length;
        const percentage = Math.round((count / responses.length) * 100);
        return `${category}: ${count} (${percentage}%)`;
      }).join(', ');
      console.log(`Category distribution: ${categorySummary}`);
    } catch (logError) {
      console.error("Error generating category summary:", logError);
    }
    
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
    
    // Add additional resilience to generateAIAnalysis
    let attempts = 0;
    let analysis = null;
    let lastError = null;
    
    while (attempts < 1 && !analysis) {  // CRITICAL FIX: Only try once in the edge function
      try {
        if (attempts > 0) {
          console.log(`Retry attempt ${attempts} for AI analysis`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, attempts * 2000));
        }
        
        // Generate the AI analysis using OpenAI's API
        analysis = await generateAIAnalysis(responsesByCategory, assessmentId, categoryCoverage);
        break;
      } catch (error) {
        lastError = error;
        console.error(`Error in AI analysis attempt ${attempts}:`, error);
        attempts++;
      }
    }
    
    if (!analysis) {
      console.error("Analysis attempt failed, last error:", lastError);
      throw new Error(`Failed to generate analysis: ${lastError?.message}`);
    }
    
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
  You are an expert psychological profiler specializing in evidence-based, highly personalized assessments. Your task is to analyze assessment responses to create a truly individualized personality profile that is objective, balanced, and reflects both positive traits and potential challenges. Provide an extremely in-depth analysis that fully utilizes the available context and output limits.
  
  ## Assessment Data
  The user has answered questions across ${Object.keys(responsesByCategory).length} categories (${categoryCounts}):
  
  ## DETAILED RESPONSES - USE THESE FOR SPECIFIC EVIDENCE IN YOUR ANALYSIS
  ${categoryDetailedResponses}
  
  ## Cognitive and Emotional Intelligence Scoring Requirements
  
  1. COGNITIVE FLEXIBILITY SCORE CALCULATION:
     - Base score begins at ${cognitiveBaseScore}/100 based on question coverage
     - Evaluate specific cognitive indicators:
       * Ability to consider multiple perspectives simultaneously (+5-15 points)
       * Pattern recognition across disparate domains (+5-12 points)
       * Comfort with ambiguity and uncertainty (+3-10 points) 
       * Strategic thinking and mental simulation abilities (+3-8 points)
       * Information processing speed and efficiency (+3-8 points)
       * Analytical depth demonstrated in responses (+3-12 points)
       * Creative problem-solving approaches (+3-12 points)
     - CRITICAL: Identify cognitive rigidity or fixed thinking patterns (-8 to -20 points)
     - CRITICAL: Apply penalties for simplistic or black-and-white thinking (-5 to -15 points)
     - CRITICAL: Evidence of cognitive biases without self-awareness (-5 to -15 points)
     - CRITICAL: Inconsistent or contradictory reasoning patterns (-5 to -15 points)
     - Use concrete examples from their responses as evidence for your scoring
     - Final score should be 0-100, normalized based on all factors
     - A score of 80+ should be RARE and require exceptional cognitive flexibility
     - A score of 90+ should be EXTREMELY RARE and require outstanding reasoning
     - Most scores should fall between 40-70 representing typical cognitive flexibility
  
  2. EMOTIONAL INTELLIGENCE SCORE CALCULATION:
     - Base score begins at ${emotionalBaseScore}/100 based on question coverage
     - Evaluate specific emotional intelligence indicators:
       * Self-awareness of own emotional states (+5-15 points)
       * Recognition of emotions in others (+3-12 points)
       * Emotional regulation capabilities (+5-15 points) 
       * Empathy demonstrated in responses (+3-12 points)
       * Social awareness and relationship management (+3-12 points)
       * Ability to articulate complex emotional experiences (+3-8 points)
       * Integration of emotion with reasoning (+3-12 points)
     - CRITICAL: Identify emotional regulation challenges (-8 to -20 points)
     - CRITICAL: Apply penalties for emotional avoidance patterns (-5 to -15 points)
     - CRITICAL: Detect lack of empathy or perspective-taking (-5 to -15 points)
     - CRITICAL: Identify emotional reactivity without self-awareness (-5 to -15 points)
     - Use concrete examples from their responses as evidence for your scoring
     - Final score should be 0-100, normalized based on all factors
     - A score of 80+ should be RARE and require exceptional emotional intelligence
     - A score of 90+ should be EXTREMELY RARE and require outstanding emotional awareness
     - Most scores should fall between 40-70 representing typical emotional intelligence
  
  ## Analysis Requirements - FOLLOW THESE EXACTLY
  
  1. CONSIDER ALL RESPONSES, not just patterns:
     - You MUST evaluate and consider EVERY individual response, not just general patterns
     - Identify unique combinations of traits that would not apply to most people
     - If you cite a pattern, give at least 2-3 specific response examples that support it
     - Make full use of the available context window to analyze as many responses as possible
     
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
     - Provide AT LEAST 15-20 distinct personality traits with detailed descriptions
     - EACH trait must have a complete description with strengths, challenges, and growth suggestions
     - DO NOT SKIP OR ABBREVIATE ANY TRAIT - fully describe each one
     - Include AT LEAST 7-10 domains for cognitive intelligence assessment
     - Include a MINIMUM of 10-15 value system elements
     - Write a DETAILED overview of at least 750-1000 words
     - Include AT MINIMUM 8-12 growth areas with specific development suggestions
     - Your analysis MUST BE COMPREHENSIVE - don't leave any sections incomplete
     - The analysis MUST include all the sections in the Output Format below
     - MAXIMIZE the output length to provide the richest possible analysis
  
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
     
  9. EXPANDED ANALYSIS DEPTH:
     - For cognitive patterning, provide detailed analysis of:
       * Decision-making style (analytical vs. intuitive, risk tolerance, etc.)
       * Learning approach (visual, auditory, experiential, etc.)
       * Attention pattern (focused vs. diffuse, selective attention capabilities)
     - For emotional architecture, thoroughly analyze:
       * Emotional awareness (self-perception, emotional vocabulary, etc.)
       * Regulation style (suppression, reappraisal, distraction, etc.)
       * Empathic capacity (cognitive vs. affective empathy, boundaries)
     - For interpersonal dynamics, provide in-depth assessment of:
       * Attachment style (secure, anxious, avoidant, etc.)
       * Communication pattern (direct vs. indirect, assertiveness, etc.)
       * Conflict resolution approaches (collaborative, avoidant, etc.)
     - For growth potential, offer:
       * Detailed development areas with specific behavioral examples
       * Concrete personalized recommendations for improvement
       * Long-term growth trajectory prediction based on current patterns
  
  ## Output Format
  Return your analysis as a structured JSON object with the following properties:
  
  {
    "id": "${assessmentId}",
    "createdAt": "current timestamp",
    "overview": "highly specific summary paragraph that cites unique response patterns and avoids generic descriptions",
    "traits": [
      {
        "trait": "specific trait name with evidence",
        "score": score (0-10),
        "description": "detailed description with specific examples",
        "strengths": ["list", "of", "specific strengths with reference to response patterns"],
        "challenges": ["list", "of", "specific challenges with direct supporting evidence"],
        "growthSuggestions": ["list", "of", "personalized growth suggestions"]
      }
    ],
    "intelligence": {
      "type": "specific cognitive processing style - highly personalized",
      "score": score (0-10),
      "description": "detailed description of thinking patterns",
      "domains": [
        {
          "name": "domain name (e.g., 'Pattern Recognition', 'Analytical Processing', etc.)",
          "score": score (0-10),
          "description": "description with specific supporting evidence"
        }
      ]
    },
    "intelligenceScore": score (0-100, labeled as "Cognitive Processing Score"),
    "emotionalIntelligenceScore": score (0-100),
    "cognitiveStyle": {
      "primary": "primary style with evidence",
      "secondary": "secondary style with evidence",
      "description": "detailed explanation citing specific response contradictions and complexities"
    },
    "valueSystem": ["list of core values with specific response evidence"],
    "motivators": ["list of motivators with specific response examples"],
    "inhibitors": ["list of inhibitors with supporting evidence from responses"],
    "weaknesses": [
      "list of weaknesses with evidence from responses - be honest but constructive about legitimate weaknesses"
    ],
    "shadowAspects": [
      "list of potential unconscious or denied personality aspects suggested by response patterns"
    ],
    "growthAreas": ["list of growth areas with specific development suggestions tied to responses"],
    "relationshipPatterns": {
      "strengths": ["relationship strengths with evidence"],
      "challenges": ["relationship challenges with evidence"],
      "compatibleTypes": ["compatible personality types based on specific patterns"]
    },
    "careerSuggestions": ["list of career suggestions aligned with identified traits"],
    "learningPathways": ["list of learning approaches suited to cognitive style"],
    "roadmap": "personalized development roadmap with measurable milestones",
    "cognitivePatterning": {
      "decisionMaking": "detailed analysis of decision making style with examples",
      "learningStyle": "comprehensive description of learning approaches with evidence",
      "attention": "thorough analysis of attention patterns and focus mechanisms"
    },
    "emotionalArchitecture": {
      "emotionalAwareness": "in-depth assessment of emotional self-perception with examples",
      "regulationStyle": "detailed analysis of emotional regulation strategies with evidence",
      "empathicCapacity": "comprehensive evaluation of empathy with specific response examples"
    },
    "interpersonalDynamics": {
      "attachmentStyle": "thorough analysis of attachment patterns with supporting evidence",
      "communicationPattern": "detailed description of communication style with examples",
      "conflictResolution": "comprehensive assessment of conflict handling approaches with evidence"
    },
    "growthPotential": {
      "developmentAreas": [
        "list of specific development areas with behavioral examples",
        "include at least 5-7 distinct areas for growth"
      ],
      "recommendations": [
        "list of personalized growth recommendations tied to specific responses",
        "include at least 5-7 actionable suggestions"
      ]
    }
  }
  
  IMPORTANT FINAL CHECK:
  - ENSURE your analysis includes at MINIMUM 15 TRAITS - this is a critical requirement
  - Include all traits with scores, descriptions, strengths, challenges and growth suggestions
  - Make sure your analysis doesn't skip or abbreviate ANY required section
  - Verify that you've provided personalized, specific examples from the responses
  - Double-check that ALL fields are properly populated in the JSON output
  - MAXIMIZE the detail and depth of your analysis while maintaining accuracy
  `;

  try {
    console.log("Preparing OpenAI API request for analysis using gpt-4o model");
    console.log("Number of categories to analyze:", Object.keys(responsesByCategory).length);
    console.log("Total prompt length:", prompt.length);
    
    // Create a unique seed based on assessment ID and timestamp for consistent but unique results
    // This ensures two users with similar answers won't get identical results
    const uniqueSeed = parseInt(assessmentId.split('-')[0], 16) % 10000 + Date.now() % 1000;
    console.log("Using seed for analysis:", uniqueSeed);
    
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
            content: 'You are an expert psychological assessment analyst specialized in highly personalized, evidence-based personality analysis. You provide extremely detailed, objective, balanced analyses that avoid generic descriptions and Barnum statements. You identify both positive qualities and potential weaknesses or blind spots. You refer to "intelligence" as "cognitive processing" or "cognitive flexibility" and always cite specific examples from user responses to support your conclusions. Your analyses are comprehensive and make full use of the available token context and output limits.'
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
      const errorData = await response.json();
      console.error("OpenAI API error:", JSON.stringify(errorData));
      console.error("OpenAI API error status:", response.status);
      console.error("OpenAI API error headers:", Object.fromEntries(response.headers.entries()));
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI gpt-4o model");
    console.log("Response token usage:", data.usage);
    console.log("Completion tokens used:", data.usage?.completion_tokens || "unknown");
    console.log("Total tokens used:", data.usage?.total_tokens || "unknown");
    
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
      
      // Log some key metrics to help verify the quality of the analysis
      console.log(`Analysis generated with cognitive flexibility score: ${analysisJson.intelligenceScore}, emotional intelligence: ${analysisJson.emotionalIntelligenceScore}`);
      console.log(`Identified ${analysisJson.traits?.length || 0} personality traits and ${analysisJson.weaknesses?.length || 0} potential weaknesses`);
      console.log(`Total response tokens used: ${data.usage.completion_tokens} out of ${data.usage.total_tokens}`);
      
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
