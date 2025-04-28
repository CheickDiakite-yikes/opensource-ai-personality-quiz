
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

// Advanced JSON cleaning and repair function with progressive repairs
const cleanJsonString = (str: string): string => {
  console.log("Original JSON length:", str.length);
  
  try {
    // Initial cleaning steps
    let cleaned = str
      .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '') // Remove invalid escapes
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .replace(/,\s*}/g, '}') // Remove trailing commas in objects
      .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
      .replace(/}\s*{/g, '},{') // Fix object concatenation
      .replace(/]\s*\[/g, '],[') // Fix array concatenation
      .replace(/"\s*"/g, '", "'); // Fix adjacent strings
    
    // Handle specifically problematic patterns:
    
    // Fix double-quoted strings (common OpenAI issue)
    cleaned = cleaned.replace(/"([^"]*?)\\?"([^"]*?)\\?"([^"]*?)"/g, (match) => {
      return match.replace(/\\?"/g, '\\"');
    });
    
    // Fix improperly quoted property names
    cleaned = cleaned.replace(/""([a-zA-Z0-9_]+)""\s*:/g, '"$1":');
    
    // Fix improperly quoted property values
    cleaned = cleaned.replace(/:\s*""([^"]*)?""/g, ':"$1"');
    
    // Handle unquoted property values that should be strings
    cleaned = cleaned.replace(/:(\s*[^0-9\[\{"][^,}\]]*?)([,}\]])/g, ':"$1"$2');
    
    // Fix quotes within strings that aren't escaped
    cleaned = cleaned.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
      return `"${p1}${p2.replace(/"/g, '\\"')}${p3}"`;
    });
    
    // Fix specific pattern in timeline objects
    cleaned = cleaned.replace(/"timeline"\s*:\s*{\s*""([^"]+)"\s*:\s*"([^"]+)""([^"]+)"\s*:\s*"([^"]+)""/g, 
      '"timeline": { "$1": "$2", "$3": "$4"');
    
    // Fix extra quote marks in array elements
    cleaned = cleaned.replace(/"([^"]+)""/g, '"$1"');
    
    // Fix broken timeline patterns (from observed errors)
    const timelinePattern = /"timeline"\s*:\s*{([^}]*)}/g;
    cleaned = cleaned.replace(timelinePattern, (match) => {
      let timelineFix = match
        .replace(/""([^"]+)"\s*:\s*"([^"]+)""/g, '"$1": "$2"')
        .replace(/:\s*"([^"]*)"([^"]*)""/g, ': "$1$2"')
        .replace(/":"(\+\d+\s+[^:]+):"/g, '":"$1","');
      
      return timelinePattern.test(timelineFix) ? timelineFix : match;
    });
    
    // Try to fix problems with mismatched brackets
    let bracketBalance = 0;
    let curlyBalance = 0;
    
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === '{') curlyBalance++;
      if (cleaned[i] === '}') curlyBalance--;
      if (cleaned[i] === '[') bracketBalance++;
      if (cleaned[i] === ']') bracketBalance--;
    }
    
    // Fix imbalanced brackets
    while (bracketBalance > 0) {
      cleaned += ']';
      bracketBalance--;
    }
    
    // Fix imbalanced curly braces
    while (curlyBalance > 0) {
      cleaned += '}';
      curlyBalance--;
    }
    
    // Remove any trailing garbage after final closing brace
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > 0) {
      cleaned = cleaned.substring(0, lastBrace + 1);
    }
    
    console.log("Cleaned JSON length:", cleaned.length);
    return cleaned;
    
  } catch (e) {
    console.error("Error in JSON cleaning process:", e);
    return str; // Return original if cleaning fails
  }
};

// More flexible structure validation with default values for missing fields
const validateAndRepairAnalysisData = (data: any): any => {
  if (!data) {
    console.error("Data is null or undefined");
    return false;
  }
  
  // Create minimal default values for required objects if missing
  if (!data.coreProfiling) {
    console.log("Adding missing coreProfiling field");
    data.coreProfiling = {
      primaryArchetype: "Complex Individual",
      secondaryArchetype: "Adaptive Persona",
      description: "A unique personality with multifaceted traits.",
      compatibilityInsights: ["Values authentic connections", "Appreciates depth in relationships"]
    };
  }
  
  if (!data.cognitiveProfile) {
    console.log("Adding missing cognitiveProfile field");
    data.cognitiveProfile = {
      style: "Balanced Thinker",
      strengths: ["Pattern recognition", "Analytical processing"],
      blindSpots: ["May overlook details when focused on the big picture"],
      learningStyle: "Adaptable to various learning approaches",
      decisionMakingProcess: "Combines analytical and intuitive elements"
    };
  }
  
  if (!data.emotionalInsights) {
    console.log("Adding missing emotionalInsights field");
    data.emotionalInsights = {
      awareness: 75,
      regulation: "Balanced emotional regulation",
      empathy: 80,
      description: "Demonstrates good emotional awareness and empathy",
      stressResponse: "Uses various coping mechanisms to manage stress",
      emotionalTriggersAndCoping: {
        triggers: ["Perceived injustice", "Feeling misunderstood"],
        copingStrategies: ["Self-reflection", "Seeking perspective"]
      }
    };
  }
  
  if (!data.interpersonalDynamics) {
    console.log("Adding missing interpersonalDynamics field");
    data.interpersonalDynamics = {
      communicationStyle: "Thoughtful communicator",
      relationshipPattern: "Values authentic connections",
      conflictApproach: "Seeks resolution through understanding",
      socialNeeds: "Balance of social connection and personal space",
      leadershipStyle: "Leads through inspiration and empathy",
      teamRole: "Contributes unique perspectives to group settings"
    };
  }
  
  if (!data.growthPotential) {
    console.log("Adding missing growthPotential field");
    data.growthPotential = {
      areasOfDevelopment: ["Enhancing self-awareness", "Developing resilience"],
      personalizedRecommendations: [{
        area: "Self-reflection",
        why: "To deepen understanding of personal patterns",
        action: "Regular journaling practice",
        resources: "Mindfulness and reflection guides"
      }],
      keyStrengthsToLeverage: ["Analytical thinking", "Empathy"],
      developmentTimeline: {
        shortTerm: "Focus on immediate self-awareness",
        mediumTerm: "Develop consistent personal growth habits",
        longTerm: "Integrate insights into sustained personal evolution"
      }
    };
  }
  
  // Ensure traits array exists and has at least one item
  if (!data.traits || !Array.isArray(data.traits) || data.traits.length === 0) {
    console.log("Adding missing or empty traits array");
    data.traits = [{
      trait: "Adaptability",
      score: 75,
      description: "Shows flexibility in changing circumstances",
      strengths: ["Quick to adjust to new situations", "Open to different perspectives"],
      challenges: ["May sometimes struggle with maintaining consistency"]
    }];
  }
  
  // Ensure uniquenessMarkers array exists
  if (!data.uniquenessMarkers || !Array.isArray(data.uniquenessMarkers)) {
    console.log("Adding missing uniquenessMarkers array");
    data.uniquenessMarkers = ["Unique perspective", "Thoughtful approach to challenges"];
  }
  
  // Set ID if missing
  if (!data.id) {
    data.id = crypto.randomUUID();
    console.log("Generated new ID for analysis:", data.id);
  }
  
  // Set overview if missing or too short
  if (!data.overview || data.overview.length < 100) {
    console.log("Adding missing or too short overview");
    data.overview = "This personality analysis highlights a multifaceted individual with a unique combination of traits, cognitive patterns, and emotional responses. The analysis explores various dimensions of personality, revealing both strengths and growth opportunities.";
  }
  
  return data;
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

    const systemPrompt = `You are an elite psychological profiler with expertise in personality assessment, emotional intelligence, and cognitive behavior analysis. 
You deliver detailed, transformative personality insights that are emotionally resonant, intellectually substantive, and deeply personal.
Your analysis must be COMPREHENSIVE, TOUCHING, EMOTIONALLY RICH and EXPERTLY CRAFTED. Write as if you truly understand the depths of the human psyche.

CRITICALLY IMPORTANT: Your response MUST be valid JSON with ALL of these exact fields:
{
  "id": "string (UUID)",
  "overview": "string (detailed personality overview)",
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
    "learningStyle": "string",
    "decisionMakingProcess": "string"
  },
  "emotionalInsights": {
    "awareness": number,
    "regulation": "string",
    "empathy": number,
    "description": "string",
    "stressResponse": "string",
    "emotionalTriggersAndCoping": {
      "triggers": ["string"],
      "copingStrategies": ["string"]
    }
  },
  "interpersonalDynamics": {
    "communicationStyle": "string",
    "relationshipPattern": "string",
    "conflictApproach": "string",
    "socialNeeds": "string",
    "leadershipStyle": "string",
    "teamRole": "string"
  },
  "growthPotential": {
    "areasOfDevelopment": ["string"],
    "personalizedRecommendations": [{
      "area": "string",
      "why": "string",
      "action": "string",
      "resources": "string"
    }],
    "keyStrengthsToLeverage": ["string"],
    "developmentTimeline": {
      "shortTerm": "string",
      "mediumTerm": "string",
      "longTerm": "string"
    }
  }
}

Each field is REQUIRED and the format must be EXACTLY as shown above. Do NOT add or modify field names.`;

    // Request with more constrained parameters for reliable JSON
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
            content: `Generate a detailed, emotionally resonant, and expertly crafted personality analysis based on these responses:
${Object.entries(responses).map(([id, response]) => `${id}: "${response}"`).join('\n')}

Use seed ${seed} for consistency but ensure this is a deeply personalized analysis that captures the essence of the individual.

IMPORTANT: Your analysis must include ALL fields in the exact format I specified. Do not omit any fields or change their names.
Your response must be valid, parseable JSON without any text outside of the JSON structure.

Focus especially on:
1. Creating a detailed overview (at least 300 words)
2. Including at least 5-7 distinct personality traits
3. Making specific, personalized observations rather than generic statements
4. Ensuring every required field is properly formatted and complete`
          }
        ],
        temperature: 0.6, // More controlled temperature for reliability
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        response_format: { type: "json_object" }, // Force JSON response format
        max_tokens: 6000, // Reduced from 10000 to avoid potential issues
      }),
    });

    // Enhanced response handling and validation with multiple fallback strategies
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
      
      // Initial attempt: direct parse
      try {
        analysisData = JSON.parse(analysisText);
        console.log("JSON parsed successfully on first attempt");
      } catch (initialParseError) {
        // First fallback: clean and repair the JSON string
        console.log("Initial parse failed, attempting to clean JSON");
        const cleanedText = cleanJsonString(analysisText);
        
        try {
          // Try to parse the cleaned JSON
          analysisData = JSON.parse(cleanedText);
          console.log("JSON parsed successfully after cleaning");
        } catch (parseError) {
          console.error("Error parsing cleaned JSON:", parseError);
          console.error("Problematic JSON:", cleanedText);
          
          // Last resort: Try to extract partial data
          try {
            // Try to extract a valid JSON subset using regex
            const jsonMatch = cleanedText.match(/\{(?:[^{}]|(\{(?:[^{}]|{[^{}]*})*}))*\}/);
            if (jsonMatch) {
              const potentialJson = jsonMatch[0];
              console.log("Attempting to parse JSON subset");
              analysisData = JSON.parse(potentialJson);
              console.log("Partial JSON recovery successful");
            } else {
              throw new Error("Could not extract valid JSON subset");
            }
          } catch (fallbackError) {
            console.error("All parsing attempts failed:", fallbackError);
            throw new Error(`Failed to parse analysis result: ${parseError.message}`);
          }
        }
      }
      
      // Now attempt to repair/complete any missing fields
      analysisData = validateAndRepairAnalysisData(analysisData);
      console.log("Successfully parsed, validated, and repaired analysis data");
      
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
      try {
        const { error: saveError } = await supabaseAdmin
          .from('concise_analyses')
          .upsert({
            assessment_id: assessmentId,
            user_id: userId,
            analysis_data: finalAnalysis
          });
        
        if (saveError) {
          console.error("Error saving analysis:", saveError);
          // Continue with returning the analysis even if saving fails
          console.log("Returning analysis despite database save error");
        } else {
          console.log("Analysis saved successfully to database");
        }
      } catch (dbError) {
        // Don't throw here, just log the error and continue
        console.error("Exception during database save:", dbError);
        console.log("Continuing to return analysis despite database error");
      }
    }

    console.log("Returning successful response with analysis data");
    return new Response(JSON.stringify(finalAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error in analyze-concise-responses function:", error);
    console.error("Error stack:", error.stack);
    
    // Return a more informative error message
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An error occurred while generating your analysis. Please try again.",
        timestamp: new Date().toISOString(),
        errorType: error.constructor.name
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
