
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
  userId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Analyze concise responses function called");
    
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

    // Enhanced seed mechanism for consistent yet personalized results
    const seed = Math.floor(Math.random() * 10000);
    console.log(`Using seed: ${seed} for analysis generation`);

    // Simplified JSON structure with strict formatting requirements
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using more capable model for nuanced analysis
        messages: [
          {
            role: "system",
            content: `You are an expert personality profiler. Your analyses must be returned as strictly formatted JSON with these rules:
            1. Every string must be properly quoted with double quotes
            2. Every object must have closing braces
            3. Every array must have closing brackets
            4. Use proper comma separation between elements
            5. No trailing commas
            6. No comments or extra text
            7. Only valid JSON syntax is allowed`
          },
          {
            role: "user",
            content: generateSimplifiedAnalysisPrompt(responses, seed)
          }
        ],
        temperature: 0.5, // Lower temperature for more consistent formatting
        frequency_penalty: 0.3,
        presence_penalty: 0.2,
        response_format: { type: "json_object" }, // Enforce JSON response
        max_tokens: 4000,
      }),
    });

    // Enhanced response handling and validation
    let analysisData;
    try {
      const data = await response.json();
      console.log("OpenAI response received");
      
      if (!data.choices || data.choices.length === 0) {
        console.error("Invalid OpenAI API response:", data);
        throw new Error("Failed to generate analysis");
      }
      
      let analysisText = data.choices[0].message.content;
      console.log("Cleaning and validating response text");
      
      // Clean the response text
      analysisText = analysisText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/\\"/g, '"')
        .replace(/\t/g, ' ')
        .trim();
      
      // Attempt to repair common JSON issues
      analysisText = analysisText
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/([^"'])\s*:\s*([^"'\d\[{])/g, '$1: "$2') // Quote unquoted values
        .replace(/"\s*,\s*([}\]])/g, '"$1'); // Fix extra commas before closing brackets
      
      // Parse and validate the JSON structure
      try {
        analysisData = JSON.parse(analysisText);
        
        // Validate required fields
        const requiredFields = [
          'id', 'overview', 'uniquenessMarkers', 'coreProfiling',
          'traits', 'cognitiveProfile', 'emotionalInsights',
          'interpersonalDynamics', 'growthPotential'
        ];
        
        const missingFields = requiredFields.filter(field => !analysisData[field]);
        if (missingFields.length > 0) {
          throw new Error(`Analysis data missing required fields: ${missingFields.join(', ')}`);
        }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        console.error("Problematic JSON:", analysisText);
        throw new Error(`Failed to parse analysis result: ${parseError.message}`);
      }
      
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error("Failed to parse analysis result");
    }

    // Add metadata
    const finalAnalysis = {
      ...analysisData,
      userId: userId || analysisData.id,
      createdAt: new Date().toISOString()
    };

    // Save to database if we have a valid user ID
    if (userId) {
      const { error: saveError } = await supabaseAdmin
        .from('concise_analyses')
        .upsert({
          assessment_id: assessmentId,
          user_id: userId,
          analysis_data: finalAnalysis
        });
      
      if (saveError) {
        console.error("Error saving analysis:", saveError);
        throw saveError;
      }
      
      console.log("Analysis saved successfully");
    }

    return new Response(JSON.stringify(finalAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error in analyze-concise-responses function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An error occurred while generating your analysis. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateSimplifiedAnalysisPrompt(responses: Record<string, string>, seed: number): string {
  return `
Create a concise yet insightful personality analysis with this EXACT JSON structure:

{
  "id": "string (UUID)",
  "overview": "string (2-3 paragraphs)",
  "uniquenessMarkers": ["array of 3-5 strings"],
  "coreProfiling": {
    "primaryArchetype": "string",
    "secondaryArchetype": "string",
    "description": "string",
    "compatibilityInsights": ["string array"]
  },
  "traits": [
    {
      "trait": "string",
      "score": "number (1-10)",
      "description": "string",
      "strengths": ["string array"],
      "challenges": ["string array"]
    }
  ],
  "cognitiveProfile": {
    "style": "string",
    "strengths": ["string array"],
    "blindSpots": ["string array"],
    "learningStyle": "string"
  },
  "emotionalInsights": {
    "awareness": "number (1-10)",
    "regulation": "string",
    "empathy": "number (1-10)",
    "description": "string"
  },
  "interpersonalDynamics": {
    "communicationStyle": "string",
    "relationshipPattern": "string",
    "socialNeeds": ["string array"]
  },
  "growthPotential": {
    "focus": "string",
    "recommendations": ["string array"],
    "timeline": {
      "shortTerm": "string",
      "longTerm": "string"
    }
  }
}

Based on these responses:
${Object.entries(responses).map(([id, response]) => `${id}: "${response}"`).join('\n')}

Use seed ${seed} for consistency.

IMPORTANT REQUIREMENTS:
1. Return ONLY valid JSON
2. Use double quotes for ALL strings
3. No trailing commas
4. No comments or markup
5. Validate JSON structure before responding
6. Keep responses concise but meaningful
7. Focus on unique traits and patterns
8. Use specific examples from responses
`;
}
