
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Enhanced security headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://api.openai.com;",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

// Rate limiting cache - would use Redis in production
const rateLimits = new Map<string, { count: number, timestamp: number }>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to generate-activity");
    
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error("Method not allowed. Only POST requests are supported.");
    }
    
    // Validate request content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error("Invalid content type. Expected application/json.");
    }
    
    const { analysis, userCategory, userId } = await req.json();
    
    // Simple rate limiting - would use Redis in production
    if (userId) {
      const requestsPerHour = await checkRateLimit(userId);
      if (requestsPerHour > 20) { // Allow 20 activities per hour
        throw new Error("Rate limit exceeded. Please try again later.");
      }
    }
    
    console.log(`Generating personalized activity${userCategory ? ` for category: ${userCategory}` : ''}`);
    
    // Generate the activity using the OpenAI API
    // IMPORTANT: We exclusively use the o3-mini model for all AI generation
    const activity = await generateActivity(analysis, userCategory);
    
    console.log("Activity generated successfully");
    
    return new Response(JSON.stringify({ activity }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-activity function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simple rate limiting function
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

// Generate activity using OpenAI's o3-mini model
async function generateActivity(analysis: any, userCategory?: string) {
  // Create a more detailed system prompt with user's personality insights
  const analysisOverview = `
User Profile:
- Core Traits: ${analysis.traits.slice(0, 3).map(t => t.trait).join(', ')}
- Intelligence Type: ${analysis.intelligence.type}
- Cognitive Style: ${analysis.cognitiveStyle}
- Key Motivators: ${analysis.motivators.slice(0, 3).join(', ')}
- Growth Areas: ${analysis.growthAreas.slice(0, 3).join(', ')}
- Learning Pathways: ${analysis.learningPathways.slice(0, 2).join(', ')}
- Weaknesses: ${analysis.weaknesses.slice(0, 2).join(', ')}
  `;

  const prompt = `
Generate a personalized growth activity for a user with the following profile:

${analysisOverview}

${userCategory ? `The activity should be specifically focused on the "${userCategory}" category.` : ''}

The activity should:
1. Be specific and actionable
2. Take between 15-60 minutes to complete
3. Target one of their growth areas or weaknesses
4. Align with their learning style, intelligence type, and motivators
5. Have clear steps to follow
6. Explain why this will benefit their development

Return the activity in JSON format with these fields:
- title: A concise, engaging title (max 10 words)
- description: A detailed explanation (2-3 sentences)
- category: One of [COGNITIVE, EMOTIONAL, SOCIAL, PERSONALITY, MOTIVATION, VALUES, LEARNING, STRENGTHS] 
  or if specified: ${userCategory || 'any appropriate category'}
- points: A number between 10-40 representing the challenge level
- steps: An array of 3-5 specific steps to complete the activity
- benefits: A brief explanation of how this helps their growth
`;

  try {
    console.log("Sending request to OpenAI API using o3-mini model for activity generation");
    
    // Add timeout for OpenAI request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    try {
      // Using the correct parameters for o3-mini
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'o3-mini', 
          messages: [
            { 
              role: 'system', 
              content: 'You are a personal development coach specialized in creating custom activities that help people grow based on their personality assessment. Always provide activities that are practical, specific, and tailored to the individual.'
            },
            { role: 'user', content: prompt }
          ],
          // Removed unsupported temperature parameter
          max_completion_tokens: 4000, // Using max_completion_tokens for reasoning models
          response_format: { type: "json_object" },
          reasoning_effort: "medium", // o3-mini model supports reasoning_effort parameter
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
      console.log("Received response from OpenAI o3-mini model");
      
      try {
        // Parse the activity from the OpenAI response
        const activityData = JSON.parse(data.choices[0].message.content);
        
        // Generate a unique ID for the activity
        const uniqueId = `activity-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Add the ID and completed status
        return {
          id: uniqueId,
          title: activityData.title,
          description: activityData.description,
          category: activityData.category,
          points: activityData.points || Math.floor(Math.random() * 30) + 10,
          steps: activityData.steps || [],
          benefits: activityData.benefits || "",
          completed: false
        };
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        throw new Error("Failed to parse activity generation results");
      }
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Error generating activity:", error);
    throw new Error(`Failed to generate activity: ${error.message}`);
  }
}
