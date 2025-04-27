
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

// Helper function to clean and repair JSON strings
const cleanJsonString = (str: string): string => {
  return str
    .replace(/\\"/g, '"') // Fix escaped quotes
    .replace(/"\s*"\s*([^"]+)\s*"\s*"/, '"$1"') // Fix double quoted values
    .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
    .replace(/([^"'])\s*:\s*"?\s*([^"'\d\[{][^,}\]]*)\s*"?\s*([,}\]])/g, '$1:"$2"$3') // Quote unquoted string values
    .replace(/"\s*,\s*([}\]])/g, '"$1') // Fix extra commas before closing brackets/braces
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
};

// Validate analysis data structure
const validateAnalysisData = (data: any): boolean => {
  const requiredFields = [
    'id', 'overview', 'uniquenessMarkers', 'coreProfiling',
    'traits', 'cognitiveProfile', 'emotionalInsights', 
    'interpersonalDynamics', 'growthPotential'
  ];
  
  return requiredFields.every(field => {
    const hasField = data?.[field] !== undefined;
    if (!hasField) {
      console.error(`Missing required field: ${field}`);
    }
    return hasField;
  });
};

serve(async (req) => {
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
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Enhanced seed mechanism for consistent yet personalized results
    const seed = Math.floor(Math.random() * 10000);
    console.log(`Using seed: ${seed} for analysis generation`);

    const systemPrompt = `You are an expert personality profiler that generates analysis in precise JSON format.
    Important JSON formatting rules:
    1. All strings must use double quotes
    2. No trailing commas
    3. All numbers should be unquoted
    4. Property names must be valid JSON keys
    5. Arrays and objects must be properly closed
    6. Validate JSON structure before responding
    7. Keep responses concise and focused`;

    // Request with strict JSON formatting
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
            content: systemPrompt
          },
          {
            role: "user",
            content: `Generate a personality analysis in the following exact JSON format with these specific types:
{
  "id": "string (UUID)",
  "overview": "string",
  "uniquenessMarkers": ["string"],
  "coreProfiling": {
    "primaryArchetype": "string",
    "secondaryArchetype": "string",
    "description": "string",
    "compatibilityInsights": ["string"]
  },
  "traits": [{
    "trait": "string",
    "score": number,
    "description": "string",
    "strengths": ["string"],
    "challenges": ["string"]
  }],
  "cognitiveProfile": {
    "style": "string",
    "strengths": ["string"],
    "blindSpots": ["string"],
    "learningStyle": "string"
  },
  "emotionalInsights": {
    "awareness": number,
    "regulation": "string",
    "empathy": number,
    "description": "string"
  },
  "interpersonalDynamics": {
    "communicationStyle": "string",
    "relationshipPattern": "string",
    "socialNeeds": ["string"]
  },
  "growthPotential": {
    "focus": "string",
    "recommendations": ["string"],
    "timeline": {
      "shortTerm": "string",
      "longTerm": "string"
    }
  }
}

Based on these responses:
${Object.entries(responses).map(([id, response]) => `${id}: "${response}"`).join('\n')}

Use seed ${seed} for consistency.`
          }
        ],
        temperature: 0.5,
        frequency_penalty: 0.3,
        presence_penalty: 0.2,
        response_format: { type: "json_object" },
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
      
      // Clean and repair the JSON string
      analysisText = cleanJsonString(analysisText);
      
      // Parse and validate the JSON structure
      try {
        analysisData = JSON.parse(analysisText);
        
        if (!validateAnalysisData(analysisData)) {
          throw new Error("Invalid analysis data structure");
        }

        console.log("Successfully parsed and validated analysis data");
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
