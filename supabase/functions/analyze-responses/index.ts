import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AssessmentResponse, PersonalityAnalysis, QuestionCategory } from "./types.ts";

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Security headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://api.openai.com;",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to analyze-responses");
    
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error("Method not allowed. Only POST requests are supported.");
    }
    
    // Validate request content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error("Invalid content type. Expected application/json.");
    }
    
    const { responses, assessmentId } = await req.json();
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      throw new Error("Invalid or missing responses data");
    }

    if (!assessmentId) {
      throw new Error("Missing assessment ID");
    }

    console.log(`Processing ${responses.length} responses for assessment ID: ${assessmentId}`);
    
    // Clean and serialize responses for analysis
    const cleanedResponses = responses.map(r => ({
      ...r,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString()
    }));
    
    // Group responses by category for analysis
    const responsesByCategory = categorizeResponses(cleanedResponses);
    
    // Rate limiting - check if we have too many requests
    const requestCount = await checkRateLimit(assessmentId);
    if (requestCount > 10) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    
    // Generate the AI analysis using OpenAI's API
    const analysis = await generateAIAnalysis(responsesByCategory, assessmentId);
    
    console.log("Analysis completed successfully");
    
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in analyze-responses function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simple in-memory rate limiting (would use Redis or similar in production)
const rateLimits = new Map<string, { count: number, timestamp: number }>();

async function checkRateLimit(id: string): Promise<number> {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  // Clean up old entries
  for (const [key, data] of rateLimits.entries()) {
    if (now - data.timestamp > oneHour) {
      rateLimits.delete(key);
    }
  }
  
  const existing = rateLimits.get(id) || { count: 0, timestamp: now };
  if (now - existing.timestamp > oneHour) {
    // Reset if more than an hour has passed
    rateLimits.set(id, { count: 1, timestamp: now });
    return 1;
  } else {
    // Increment count
    const newCount = existing.count + 1;
    rateLimits.set(id, { count: newCount, timestamp: existing.timestamp });
    return newCount;
  }
}

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

// Generate AI analysis using OpenAI's gpt-4o-mini model
async function generateAIAnalysis(
  responsesByCategory: Record<string, AssessmentResponse[]>,
  assessmentId: string
): Promise<PersonalityAnalysis> {
  const categorySummaries = Object.entries(responsesByCategory).map(([category, responses]) => {
    const summary = responses.map(r => 
      `Q: ${r.questionId}, Answer: ${r.selectedOption || r.customResponse || "No answer"}`
    ).join('\n');
    return `Category ${category}:\n${summary}`;
  }).join('\n\n');

  // Create a detailed prompt for analysis
  const prompt = `
  You are an expert psychological profiler analyzing assessment responses to create a comprehensive personality profile.
  
  Below are the assessment responses organized by category:
  
  ${categorySummaries}
  
  Think step by step to analyze these responses and create a detailed personality profile.
  First, identify patterns across different categories.
  Then, determine key personality traits based on response patterns.
  Next, assess strengths, weaknesses, and cognitive styles.
  Finally, generate personalized development recommendations.
  
  Return your analysis as a structured JSON object with the following properties:
  
  {
    "id": "${assessmentId}",
    "createdAt": "current timestamp",
    "overview": "summary paragraph about the personality profile",
    "traits": [
      {
        "trait": "trait name",
        "score": score (0-10),
        "description": "description",
        "strengths": ["list", "of", "strengths"],
        "challenges": ["list", "of", "challenges"],
        "growthSuggestions": ["list", "of", "growth suggestions"]
      }
    ],
    "intelligence": {
      "type": "intelligence type",
      "score": score (0-10),
      "description": "description",
      "domains": [
        {
          "name": "domain name",
          "score": score (0-10),
          "description": "description"
        }
      ]
    },
    "intelligenceScore": score (0-100),
    "emotionalIntelligenceScore": score (0-100),
    "cognitiveStyle": "description",
    "valueSystem": ["list", "of", "core values"],
    "motivators": ["list", "of", "motivators"],
    "inhibitors": ["list", "of", "inhibitors"],
    "weaknesses": ["list", "of", "weaknesses"],
    "growthAreas": ["list", "of", "growth areas"],
    "relationshipPatterns": ["list", "of", "relationship patterns"],
    "careerSuggestions": ["list", "of", "career suggestions"],
    "learningPathways": ["list", "of", "learning pathways"],
    "roadmap": "personalized development roadmap paragraph"
  }
  
  Ensure the analysis is detailed, personalized, and actionable.`;

  try {
    console.log("Sending request to OpenAI API using gpt-4o-mini model");
    
    // Add timeout for OpenAI request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Use the correct parameters supported by the gpt-4o-mini model
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a psychological assessment expert specialized in personality analysis. Focus on providing insightful, accurate, and helpful analysis.'
            },
            { role: 'user', content: prompt }
          ],
          response_format: { type: "json_object" },
          seed: parseInt(assessmentId.split('-')[0], 16) % 10000, // Use part of UUID for consistent results
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("Received response from OpenAI gpt-4o-mini model");
      
      try {
        const analysisJson = JSON.parse(data.choices[0].message.content);
        // Make sure createdAt is set correctly
        if (!analysisJson.createdAt || analysisJson.createdAt === "current timestamp") {
          analysisJson.createdAt = new Date().toISOString();
        }
        return analysisJson as PersonalityAnalysis;
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        throw new Error("Failed to parse AI analysis results");
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
  }
}
