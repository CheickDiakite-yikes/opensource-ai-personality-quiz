
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestPayload {
  assessmentId: string;
  responses: Record<string, string>;
  userId?: string; // Add userId parameter to be passed from the frontend
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Analyze concise responses function called");
    
    // Get the request payload
    const payload: RequestPayload = await req.json();
    const { assessmentId, responses, userId } = payload;
    console.log(`Processing ${Object.keys(responses).length} responses for assessment ID: ${assessmentId}`);
    
    if (!responses || Object.keys(responses).length === 0) {
      throw new Error("No responses provided");
    }
    
    // Set up Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get the OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Create a prompt for the AI analysis
    const seed = Math.floor(Math.random() * 10000); // Random seed for consistency in repeated runs
    const prompt = generateAnalysisPrompt(responses, seed);
    console.log(`Generated prompt with ${prompt.length} characters, seed: ${seed}`);
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert psychological profiler specializing in creating insightful personality analyses based on assessment responses. Your analyses are nuanced, balanced, and actionable. Avoid stereotypes or overgeneralization. Return only valid JSON without any markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    // Parse the OpenAI API response
    const data = await response.json();
    console.log("OpenAI response received");
    
    if (!data.choices || data.choices.length === 0) {
      console.error("Invalid OpenAI API response:", data);
      throw new Error("Failed to generate analysis");
    }
    
    let analysisText = data.choices[0].message.content;
    
    try {
      // Clean the response text by removing any markdown code block indicators
      analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      console.log("Cleaned analysis text for parsing");
      
      // Parse the JSON response from OpenAI
      const analysisData = JSON.parse(analysisText);
      console.log("Successfully parsed analysis JSON");
      
      // Some basic validation
      if (!analysisData.id || !analysisData.overview) {
        throw new Error("Analysis data incomplete");
      }
      
      // Add metadata and ensure valid user ID
      const finalAnalysis = {
        ...analysisData,
        // Use the provided userId if available, otherwise use the analysis ID as a placeholder
        userId: userId || analysisData.id,
        createdAt: new Date().toISOString()
      };
      
      // Only save to database if we have a valid user ID
      if (userId) {
        // Save to database
        const { error } = await supabaseAdmin
          .from('concise_analyses')
          .upsert({
            assessment_id: assessmentId,
            user_id: userId,
            analysis_data: finalAnalysis
          });
        
        if (error) {
          console.error("Error saving analysis to database:", error);
        } else {
          console.log("Analysis saved to database");
        }
      } else {
        console.log("No valid user ID provided, skipping database save");
      }
      
      return new Response(JSON.stringify(finalAnalysis), {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
      
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw response:", analysisText);
      throw new Error("Failed to parse analysis result");
    }
    
  } catch (error) {
    console.error("Error in analyze-concise-responses function:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper function to generate the analysis prompt
function generateAnalysisPrompt(responses: Record<string, string>, seed: number): string {
  // Convert responses to more readable format
  const questionDescriptions: Record<string, string> = {
    "core-1": "Approach to major life decisions",
    "core-2": "Response to unexpected change",
    "core-3": "Most energizing activities",
    "core-4": "What matters most in success",
    "core-5": "Self-perception",
    "emotional-1": "Experience of strong emotions",
    "emotional-2": "Predicting others' emotional responses",
    "emotional-3": "Response to others' difficult experiences",
    "emotional-4": "Behavior after conflict",
    "emotional-5": "Handling emotions during crisis",
    "cognitive-1": "Learning style preference",
    "cognitive-2": "Problem-solving approach",
    "cognitive-3": "Decision-making process",
    "cognitive-4": "Project planning preference",
    "cognitive-5": "Response to criticism",
    "social-1": "Role in group settings",
    "social-2": "Handling disagreement",
    "social-3": "Approach to social boundaries",
    "social-4": "Priorities in close relationships",
    "social-5": "Response to others' problems",
    "values-1": "Main driver of life decisions",
    "values-2": "Source of fulfillment and purpose",
    "values-3": "Core values resonance",
    "values-4": "Meaningful recognition type",
    "values-5": "Future priorities"
  };

  const optionMappings: Record<string, Record<string, number>> = {
    "core-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-5": { "a": 1, "b": 2, "c": 3, "d": 4 }
  };
  
  // Format responses for the prompt
  const formattedResponses = Object.entries(responses).map(([questionId, answer]) => {
    const questionDesc = questionDescriptions[questionId] || questionId;
    const optionNumber = optionMappings[questionId]?.[answer] || answer;
    return `${questionDesc}: Option ${optionNumber}`;
  }).join("\n");

  return `
Analyze the following 25 personality assessment responses and create a comprehensive personality profile. These questions cover core traits, emotional intelligence, cognitive patterns, social dynamics, and values/motivations.

RESPONSE DATA:
${formattedResponses}

INSTRUCTIONS:
Create a detailed personality analysis in pure JSON format (no markdown code blocks) with the following structure:

{
  "id": "${crypto.randomUUID()}",
  "userId": "system-generated",
  "overview": "A 2-3 paragraph overview of the individual's personality profile, highlighting the most distinctive patterns and characteristics.",
  "coreProfiling": {
    "primaryArchetype": "The dominant personality archetype (e.g., 'Analytical Strategist', 'Empathic Connector', 'Adaptive Problem-Solver', etc.)",
    "secondaryArchetype": "A secondary influence on their personality",
    "description": "A paragraph explaining how these archetypes manifest in their personality"
  },
  "traits": [
    {
      "trait": "A specific personality trait (5-7 traits total)",
      "score": A number between 1-10 indicating strength of this trait,
      "description": "Brief description of how this trait manifests",
      "strengths": ["3-4 strengths associated with this trait"],
      "challenges": ["2-3 challenges or growth areas associated with this trait"]
    }
  ],
  "cognitiveProfile": {
    "style": "A description of their cognitive/thinking style",
    "strengths": ["3-4 cognitive strengths"],
    "blindSpots": ["2-3 cognitive blind spots or challenges"],
    "description": "A paragraph explaining their cognitive patterns in more depth"
  },
  "emotionalInsights": {
    "awareness": "Description of their emotional self-awareness",
    "regulation": "Description of their emotional regulation approach",
    "empathy": A number between 1-10 indicating empathic capacity,
    "description": "A paragraph about their emotional landscape and patterns"
  },
  "interpersonalDynamics": {
    "communicationStyle": "Their primary communication style",
    "relationshipPattern": "Their typical approach to relationships",
    "conflictApproach": "Their typical approach to handling conflict"
  },
  "growthPotential": {
    "areasOfDevelopment": ["3-4 primary areas for growth and development"],
    "personalizedRecommendations": ["3-5 specific recommendations for development"],
    "keyStrengthsToLeverage": ["3 key strengths they can leverage for growth"]
  },
  "careerInsights": ["5-7 career fields or roles that might align well with their profile"]
}

IMPORTANT:
- Use the response patterns to identify genuine insights - avoid generic statements.
- Balance positive attributes with genuine growth areas - be honest but constructive.
- Make insights specific and actionable.
- For the scores (trait scores, empathy score), use realistic values based on response patterns, not overly high values.
- Use the seed value ${seed} to ensure consistency if the analysis is regenerated.
- Return valid JSON without any markdown code block formatting (no \`\`\`json tags).
- Ensure all JSON is properly formatted with no errors.
`;
}
