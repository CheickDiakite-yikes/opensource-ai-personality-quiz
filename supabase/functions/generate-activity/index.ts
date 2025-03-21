
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Enhanced security headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'",
};

// Basic request validation
const validateRequest = (req: Request, body: any) => {
  // Check for required fields
  if (!body.analysis) {
    throw new Error("Missing analysis data");
  }
  
  // Validate authorization if needed
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // We'll log this but not throw an error yet as we're using anon access
    console.warn("Request missing proper authorization");
  }
};

// Simple rate limiting (can be enhanced further)
const requestCounts = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

const checkRateLimit = (clientIP: string) => {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);
  
  if (!clientData) {
    requestCounts.set(clientIP, { count: 1, timestamp: now });
    return true;
  }
  
  if (now - clientData.timestamp > RATE_WINDOW) {
    // Reset if window has passed
    requestCounts.set(clientIP, { count: 1, timestamp: now });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded
  }
  
  // Increment count
  requestCounts.set(clientIP, { 
    count: clientData.count + 1, 
    timestamp: clientData.timestamp 
  });
  return true;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to generate-activity");
    
    // Get client IP for rate limiting (simplified for demo)
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const body = await req.json();
    
    // Validate the request body
    validateRequest(req, body);
    
    const { analysis, userCategory } = body;
    
    console.log(`Generating personalized activity${userCategory ? ` for category: ${userCategory}` : ''}`);
    
    // Add request timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 30000); // 30 seconds timeout
    });
    
    // Generate the activity with timeout
    const activityPromise = generateActivity(analysis, userCategory);
    const activity = await Promise.race([activityPromise, timeoutPromise]) as any;
    
    console.log("Activity generated successfully");
    
    return new Response(JSON.stringify({ activity }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-activity function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Generate activity using OpenAI's o3-mini model with enhanced security
async function generateActivity(analysis: any, userCategory?: string) {
  // Create a more detailed system prompt with user's personality insights
  const analysisOverview = `
User Profile:
- Core Traits: ${analysis.traits?.slice(0, 3)?.map(t => t.trait).join(', ') || 'Not specified'}
- Intelligence Type: ${analysis.intelligence?.type || 'Not specified'}
- Cognitive Style: ${analysis.cognitiveStyle || 'Not specified'}
- Key Motivators: ${analysis.motivators?.slice(0, 3)?.join(', ') || 'Not specified'}
- Growth Areas: ${analysis.growthAreas?.slice(0, 3)?.join(', ') || 'Not specified'}
- Learning Pathways: ${analysis.learningPathways?.slice(0, 2)?.join(', ') || 'Not specified'}
- Weaknesses: ${analysis.weaknesses?.slice(0, 2)?.join(', ') || 'Not specified'}
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
    
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }
    
    // Add timeout for fetch call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
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
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error("OpenAI API request timed out");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error generating activity:", error);
    throw new Error(`Failed to generate activity: ${error.message}`);
  }
}
