
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log("Received request to generate-activity");
    const { analysis, userCategory } = await req.json();
    
    if (!analysis) {
      throw new Error("Missing analysis data");
    }
    
    console.log(`Generating personalized activity${userCategory ? ` for category: ${userCategory}` : ''}`);
    
    // Generate the activity using the OpenAI API
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

async function generateActivity(analysis: any, userCategory?: string) {
  // Create a system prompt that instructs the model to generate a personalized activity
  const analysisOverview = `
User Profile:
- Core Traits: ${analysis.traits.slice(0, 3).map(t => t.trait).join(', ')}
- Intelligence Type: ${analysis.intelligence.type}
- Cognitive Style: ${analysis.cognitiveStyle}
- Key Motivators: ${analysis.motivators.slice(0, 3).join(', ')}
- Growth Areas: ${analysis.growthAreas.slice(0, 3).join(', ')}
- Learning Pathways: ${analysis.learningPathways.slice(0, 2).join(', ')}
  `;

  const prompt = `
Generate a personalized growth activity for a user with the following profile:

${analysisOverview}

${userCategory ? `The activity should be specifically focused on the "${userCategory}" category.` : ''}

The activity should:
1. Be specific and actionable
2. Take between 15-60 minutes to complete
3. Target one of their growth areas
4. Align with their learning style and motivators
5. Have clear steps to follow
6. Explain why this will benefit their development

Return the activity in JSON format with these fields:
- title: A concise, engaging title (max 10 words)
- description: A detailed explanation (2-3 sentences)
- category: One of [COGNITIVE, EMOTIONAL, SOCIAL, PERSONALITY, MOTIVATION, VALUES, LEARNING, STRENGTHS]
- points: A number between 10-40 representing the challenge level
- steps: An array of 3-5 specific steps to complete the activity
- benefits: A brief explanation of how this helps their growth
`;

  try {
    console.log("Sending request to OpenAI API for activity generation");
    
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
            content: 'You are a personal development coach specialized in creating custom activities that help people grow. Always provide activities that are practical, specific, and tailored to the individual.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");
    
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
    console.error("Error generating activity:", error);
    throw new Error(`Failed to generate activity: ${error.message}`);
  }
}
