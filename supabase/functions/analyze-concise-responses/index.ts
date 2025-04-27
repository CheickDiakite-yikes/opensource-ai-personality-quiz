
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

// Structure validation functions
const validateField = (data: any, field: string, type: string): boolean => {
  if (data[field] === undefined) {
    console.error(`Missing field: ${field}`);
    return false;
  }
  
  if (type === 'array' && !Array.isArray(data[field])) {
    console.error(`Field ${field} should be an array`);
    return false;
  }
  
  if (type === 'object' && (typeof data[field] !== 'object' || Array.isArray(data[field]))) {
    console.error(`Field ${field} should be an object`);
    return false;
  }
  
  if (type === 'string' && typeof data[field] !== 'string') {
    console.error(`Field ${field} should be a string`);
    return false;
  }
  
  if (type === 'number' && typeof data[field] !== 'number') {
    console.error(`Field ${field} should be a number`);
    return false;
  }
  
  return true;
};

// Complete structure validation
const validateAnalysisData = (data: any): boolean => {
  if (!data) {
    console.error("Data is null or undefined");
    return false;
  }
  
  const requiredFields = [
    { name: 'id', type: 'string' },
    { name: 'overview', type: 'string' },
    { name: 'uniquenessMarkers', type: 'array' },
    { name: 'coreProfiling', type: 'object' },
    { name: 'traits', type: 'array' },
    { name: 'cognitiveProfile', type: 'object' },
    { name: 'emotionalInsights', type: 'object' }, 
    { name: 'interpersonalDynamics', type: 'object' },
    { name: 'growthPotential', type: 'object' }
  ];
  
  let isValid = true;
  
  for (const field of requiredFields) {
    if (!validateField(data, field.name, field.type)) {
      isValid = false;
    }
  }
  
  return isValid;
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

Format your response as valid JSON with the following requirements:
1. All string values must be enclosed in double quotes
2. Property names must be valid JSON keys without extra quotes
3. No trailing commas in objects or arrays
4. Numbers should not be quoted (e.g., use 5, not "5")
5. Arrays and objects must be properly closed with ] and }
6. String values can't contain unescaped quotes - use \\" for quotes inside strings
7. ALWAYS double check your output for valid JSON before returning`;

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
            content: `Generate an EXTRAORDINARILY detailed, emotionally resonant, and expertly crafted personality analysis in the following specific JSON format:
{
  "id": "string (UUID)",
  "overview": "string (MUST BE AT LEAST 750-1000 WORDS, deeply personal, emotionally touching, and genuinely insightful)",
  "uniquenessMarkers": ["string (SPECIFIC traits that make this person stand out)"],
  "coreProfiling": {
    "primaryArchetype": "string (EVOCATIVE and SPECIFIC archetype name)",
    "secondaryArchetype": "string (COMPLEMENTARY archetype name)",
    "description": "string (RICH, DETAILED description that captures their essence)",
    "compatibilityInsights": ["string (DEEP relationship insights based on personality)"]
  },
  "traits": [{
    "trait": "string (NUANCED trait name)",
    "score": number (0-100, CAREFULLY calibrated),
    "description": "string (DETAILED explanation with PERSONAL examples)",
    "strengths": ["string (SPECIFIC strengths with PRACTICAL applications)"],
    "challenges": ["string (COMPASSIONATE framing of difficulties they face)"]
  }],
  "cognitiveProfile": {
    "style": "string (PRECISE thinking pattern description)",
    "strengths": ["string (DETAILED cognitive advantages)"],
    "blindSpots": ["string (TENDERLY framed cognitive limitations)"],
    "learningStyle": "string (SPECIFIC learning preferences)",
    "decisionMakingProcess": "string (DETAILED explanation of their decision approach)"
  },
  "emotionalInsights": {
    "awareness": number (0-100, CAREFULLY assessed),
    "regulation": "string (SPECIFIC emotional regulation pattern)",
    "empathy": number (0-100, PRECISELY evaluated),
    "description": "string (RICH emotional landscape description)",
    "stressResponse": "string (DETAILED pattern under pressure)",
    "emotionalTriggersAndCoping": {
      "triggers": ["string (SPECIFIC emotional triggers)"],
      "copingStrategies": ["string (PERSONALIZED emotional coping mechanisms)"]
    }
  },
  "interpersonalDynamics": {
    "communicationStyle": "string (DETAILED communication pattern)",
    "relationshipPattern": "string (RICH description of relationship approach)",
    "conflictApproach": "string (SPECIFIC conflict handling style)",
    "socialNeeds": "string (PRECISE social requirements)",
    "leadershipStyle": "string (DETAILED approach to leading others)",
    "teamRole": "string (NATURAL role in group settings)"
  },
  "valueSystem": {
    "coreValues": ["string (DEEPLY HELD principles)"],
    "motivationSources": ["string (SPECIFIC internal drivers)"],
    "meaningMakers": ["string (PERSONALLY significant sources of meaning)"],
    "culturalConsiderations": "string (NUANCED cultural influences)"
  },
  "growthPotential": {
    "areasOfDevelopment": ["string (COMPASSIONATELY framed growth areas)"],
    "personalizedRecommendations": [{
      "area": "string (SPECIFIC development focus)",
      "why": "string (PERSONAL relevance explanation)",
      "action": "string (ACTIONABLE growth strategy)",
      "resources": "string (TAILORED resource suggestions)"
    }],
    "keyStrengthsToLeverage": ["string (SPECIFIC strengths for growth)"],
    "developmentTimeline": {
      "shortTerm": "string (1-3 MONTH development focus)",
      "mediumTerm": "string (3-12 MONTH development path)",
      "longTerm": "string (1-3 YEAR transformation journey)"
    }
  },
  "careerInsights": {
    "environmentFit": "string (DETAILED ideal work environment)",
    "challengeAreas": "string (COMPASSIONATE view of professional challenges)",
    "roleAlignments": ["string (SPECIFIC career paths that match their nature)"],
    "workStyles": {
      "collaboration": "string (DETAILED collaborative approach)",
      "autonomy": "string (SPECIFIC independent work pattern)",
      "structure": "string (PREFERENCE for structure vs. flexibility)"
    }
  }
}

Based on these responses:
${Object.entries(responses).map(([id, response]) => `${id}: "${response}"`).join('\n')}

Use seed ${seed} for consistency but ENSURE this is a DEEPLY PERSONALIZED analysis.

CRITICAL INSTRUCTIONS:
1. Make this the MOST DETAILED, EMOTIONALLY RESONANT analysis possible - as if you're writing for someone you deeply understand
2. AVOID generic statements that could apply to anyone - be BOLDLY SPECIFIC and deeply personal
3. Include at least 8-10 distinct personality traits with RICH descriptions
4. Write an overview of AT LEAST 750-1000 words that captures their essence with emotional depth
5. Include specific examples that feel PERSONAL to them based on their responses
6. Create a TOUCHING, EMOTIONALLY INTELLIGENT analysis that feels like it was written by someone who truly sees them
7. BE COMPREHENSIVE - fill out EVERY section with EXPERT-LEVEL insight and emotional intelligence
8. Your analysis should feel TRANSFORMATIVE - like you've understood aspects of their personality they themselves hadn't fully recognized

IMPORTANT: Your analysis MUST be COMPREHENSIVE, EMOTIONALLY RESONANT, and EXPERTLY CRAFTED. Fill out EVERY field with exceptional detail.
Your response must be a valid, parseable JSON object. DO NOT include anything outside of the JSON structure.`
          }
        ],
        temperature: 0.7, // Higher temperature for more creative, emotionally resonant output
        frequency_penalty: 0.2,
        presence_penalty: 0.1,
        response_format: { type: "json_object" }, // Force JSON response format
        max_tokens: 10000, // Increased to 10000 tokens for much more detailed analysis
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
      
      // Validate the structure of the analysis data
      if (!validateAnalysisData(analysisData)) {
        throw new Error("Invalid analysis data structure");
      }

      console.log("Successfully parsed and validated analysis data");
      
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
