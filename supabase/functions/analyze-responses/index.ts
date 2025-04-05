
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
      throw new Error("Invalid or missing responses data");
    }

    console.log(`Processing ${responses.length} responses for assessment ID: ${assessmentId}`);
    
    // Clean and serialize responses for analysis
    const cleanedResponses = responses.map(r => ({
      ...r,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString()
    }));
    
    // Group responses by category for analysis
    const responsesByCategory = categorizeResponses(cleanedResponses);
    
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

// Generate AI analysis using OpenAI's gpt-4o model with maximum output tokens
async function generateAIAnalysis(
  responsesByCategory: Record<string, AssessmentResponse[]>,
  assessmentId: string
): Promise<PersonalityAnalysis> {
  // Count the total number of questions answered in each category
  const categoryCounts = Object.entries(responsesByCategory).map(([category, responses]) => {
    return `${category}: ${responses.length} questions`;
  }).join(', ');

  const categorySummaries = Object.entries(responsesByCategory).map(([category, responses]) => {
    const summary = responses.map(r => 
      `Q: ${r.questionId}, Answer: ${r.selectedOption || r.customResponse || "No answer"}`
    ).join('\n');
    return `Category ${category}:\n${summary}`;
  }).join('\n\n');

  // Create a detailed prompt for analysis with enhanced methodology
  const prompt = `
  You are an expert psychological profiler specializing in evidence-based assessment analysis. Your task is to analyze assessment responses to create a comprehensive, objective, and scientifically grounded personality profile.
  
  ## Assessment Data
  The user has answered questions across ${Object.keys(responsesByCategory).length} categories (${categoryCounts}):
  
  ${categorySummaries}
  
  ## Analysis Methodology
  Follow these rigorous steps to ensure an objective, reliable analysis:
  
  1. First, identify response patterns across categories while accounting for the number of questions in each category.
  
  2. For intelligence assessment:
     - Analyze cognitive patterns responses to evaluate analytical reasoning
     - Review decision-making responses to assess problem-solving approach
     - Consider creativity responses to measure innovative thinking
     - Examine leadership responses for strategic thinking ability
     - Base intelligence scores on demonstrated reasoning in responses, not on "correct" answers
     - Assign scores on a curve: 40-60 is average, 60-80 is above average, 80-90 is exceptional, 90-100 is rare
  
  3. For personality traits:
     - Identify consistent patterns across categories
     - Weigh contradictory responses appropriately
     - Consider contextual nuance in responses
     - Use evidence-based frameworks (Big Five/HEXACO) to guide trait analysis
     - Provide balanced analysis of both strengths and challenges
  
  4. For cognitive style and emotional intelligence:
     - Look for patterns in how the person processes information
     - Analyze emotional responses and self-awareness indicators
     - Evaluate interpersonal patterns from social interaction responses
     - Assess adaptability from resilience responses
  
  5. For value systems and motivators:
     - Identify underlying values from decision criteria
     - Note patterns in what drives engagement
     - Consider how values influence decisions and relationships
  
  ## Output Format
  Return your analysis as a structured JSON object with the following properties:
  
  {
    "id": "${assessmentId}",
    "createdAt": "current timestamp",
    "overview": "detailed summary paragraph about the personality profile with explanation of methodology",
    "traits": [
      {
        "trait": "trait name",
        "score": score (0-10),
        "description": "evidence-based description referring to specific response patterns",
        "strengths": ["list", "of", "strengths with justification"],
        "challenges": ["list", "of", "challenges with supportive evidence"],
        "growthSuggestions": ["list", "of", "evidence-based growth suggestions"]
      }
    ],
    "intelligence": {
      "type": "intelligence type with explanation of classification criteria",
      "score": score (0-10),
      "description": "detailed description with specific evidence from responses",
      "domains": [
        {
          "name": "domain name",
          "score": score (0-10),
          "description": "description with specific supporting evidence"
        }
      ]
    },
    "intelligenceScore": score (0-100),
    "emotionalIntelligenceScore": score (0-100),
    "cognitiveStyle": {
      "primary": "primary style",
      "secondary": "secondary style",
      "description": "detailed explanation with supporting evidence"
    },
    "valueSystem": ["list of core values with supporting evidence"],
    "motivators": ["list of motivators with specific response examples"],
    "inhibitors": ["list of inhibitors with supporting evidence"],
    "weaknesses": ["list of weaknesses with balanced perspective"],
    "growthAreas": ["list of growth areas with specific development paths"],
    "relationshipPatterns": {
      "strengths": ["relationship strengths"],
      "challenges": ["relationship challenges"],
      "compatibleTypes": ["compatible personality types"]
    },
    "careerSuggestions": ["list of career suggestions aligned with identified traits and values"],
    "learningPathways": ["list of learning approaches suited to cognitive style"],
    "roadmap": "personalized development roadmap with measurable milestones"
  }
  
  Ensure the analysis is detailed, evidence-based, balanced, and includes specific references to response patterns that justify your conclusions. Avoid overgeneralizations and include appropriate caveats about the limitations of the assessment.`;

  try {
    console.log("Sending request to OpenAI API using gpt-4o model");
    
    // Use the correct parameters supported by the gpt-4o model with maximum tokens
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
            content: 'You are an expert psychological assessment analyst specialized in evidence-based personality analysis. You provide detailed, objective, and scientifically grounded analyses with clear explanations of your methodology.'
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 4096, // Maximum output tokens for gpt-4o
        seed: parseInt(assessmentId.split('-')[0], 16) % 10000, // Use part of UUID for consistent results
        temperature: 0.4,  // Lower temperature for more consistent, less creative responses
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI gpt-4o model");
    
    try {
      const analysisJson = JSON.parse(data.choices[0].message.content);
      // Make sure createdAt is set correctly
      if (!analysisJson.createdAt || analysisJson.createdAt === "current timestamp") {
        analysisJson.createdAt = new Date().toISOString();
      }
      
      // Log some key metrics to help verify the quality of the analysis
      console.log(`Analysis generated with intelligence score: ${analysisJson.intelligenceScore}, emotional intelligence: ${analysisJson.emotionalIntelligenceScore}`);
      console.log(`Identified ${analysisJson.traits?.length || 0} personality traits`);
      
      return analysisJson as PersonalityAnalysis;
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error("Failed to parse AI analysis results");
    }
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
  }
}
