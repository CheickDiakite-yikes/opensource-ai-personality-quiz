
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

// More flexible structure validation with enhanced default values and formatting requirements
const validateAndRepairAnalysisData = (data: any): any => {
  if (!data) {
    console.error("Data is null or undefined");
    return false;
  }
  
  // Create rich default values with proper context and explanations
  if (!data.coreProfiling) {
    console.log("Adding missing coreProfiling field");
    data.coreProfiling = {
      primaryArchetype: "Complex Individual",
      secondaryArchetype: "Adaptive Persona",
      description: "A unique personality with multifaceted traits that blend analytical thinking with emotional intelligence. Your personality doesn't fit neatly into common categories, showcasing your individuality.",
      compatibilityInsights: [
        "Values authentic connections where both parties can be their genuine selves",
        "Appreciates depth in relationships over superficial interactions",
        "Thrives with partners who respect both your need for closeness and independence"
      ]
    };
  } else if (data.coreProfiling.description && data.coreProfiling.description.length < 60) {
    // Ensure descriptions are sufficiently detailed
    data.coreProfiling.description += " This archetype represents a dynamic blend of traits that form your unique personality signature, influencing how you interact with the world around you.";
  }
  
  if (!data.cognitiveProfile) {
    console.log("Adding missing cognitiveProfile field");
    data.cognitiveProfile = {
      style: "Balanced Thinker (combines analytical and intuitive approaches)",
      strengths: [
        "Pattern recognition across diverse domains of knowledge",
        "Analytical processing that helps solve complex problems methodically"
      ],
      blindSpots: [
        "May overlook details when focused on the big picture, requiring occasional reminders to ground your thinking"
      ],
      learningStyle: "Adaptable to various learning approaches, with a preference for connecting new information to existing knowledge frameworks",
      decisionMakingProcess: "Combines analytical evaluation of facts with intuitive judgment, creating a balanced approach to choices"
    };
  }
  
  if (!data.emotionalInsights) {
    console.log("Adding missing emotionalInsights field");
    data.emotionalInsights = {
      awareness: "75/100 - Strong awareness: You recognize emotions as they arise and understand their origins",
      regulation: "Balanced emotional regulation with effective coping mechanisms for most situations",
      empathy: "80/100 - High empathy: You naturally attune to others' emotional states and perspectives",
      description: "Your emotional landscape demonstrates a well-developed awareness of both your own feelings and those of others, creating nuanced interpersonal understanding.",
      stressResponse: "Under stress, you tend to process internally before responding, using various coping mechanisms to manage emotional intensity",
      emotionalTriggersAndCoping: {
        triggers: [
          "Perceived injustice or unfairness in social situations",
          "Feeling misunderstood when expressing authentic opinions"
        ],
        copingStrategies: [
          "Self-reflection through journaling or quiet contemplation",
          "Seeking perspective through conversations with trusted confidants"
        ]
      }
    };
  } else {
    // Convert numeric awareness to descriptive format if needed
    if (typeof data.emotionalInsights.awareness === 'number') {
      const score = data.emotionalInsights.awareness;
      let description = "";
      
      if (score >= 90) description = "Exceptional awareness: You have profound insight into emotions and their complexities";
      else if (score >= 75) description = "Strong awareness: You recognize emotions as they arise and understand their origins";
      else if (score >= 60) description = "Good awareness: You generally notice and identify emotions effectively";
      else if (score >= 45) description = "Developing awareness: You recognize stronger emotions but may miss subtle feelings";
      else description = "Emerging awareness: You're beginning to recognize the importance of emotional signals";
      
      data.emotionalInsights.awareness = `${score}/100 - ${description}`;
    }
    
    // Convert numeric empathy to descriptive format if needed
    if (typeof data.emotionalInsights.empathy === 'number') {
      const score = data.emotionalInsights.empathy;
      let description = "";
      
      if (score >= 90) description = "Exceptional empathy: You have a remarkable ability to understand others' perspectives";
      else if (score >= 75) description = "High empathy: You naturally attune to others' emotional states and perspectives";
      else if (score >= 60) description = "Good empathy: You regularly consider others' feelings in your interactions";
      else if (score >= 45) description = "Developing empathy: You recognize others' emotions in clear situations";
      else description = "Emerging empathy: You're building awareness of others' emotional experiences";
      
      data.emotionalInsights.empathy = `${score}/100 - ${description}`;
    }
  }
  
  if (!data.interpersonalDynamics) {
    console.log("Adding missing interpersonalDynamics field");
    data.interpersonalDynamics = {
      communicationStyle: "Thoughtful communicator who balances sharing ideas with active listening",
      relationshipPattern: "Values authentic connections with depth and meaning over quantity",
      conflictApproach: "Seeks resolution through understanding multiple perspectives and finding common ground",
      socialNeeds: "Balance of meaningful social connection and quality personal space for reflection",
      leadershipStyle: "Leads through inspiration, empathy, and thoughtful guidance rather than authority",
      teamRole: "Contributes unique perspectives while supporting group cohesion and positive dynamics"
    };
  } else {
    // Ensure communication style is detailed enough
    if (data.interpersonalDynamics.communicationStyle?.length < 15) {
      data.interpersonalDynamics.communicationStyle += " - a style that balances expression with receptivity";
    }
    
    // Ensure relationship pattern is detailed enough
    if (data.interpersonalDynamics.relationshipPattern?.length < 15) {
      data.interpersonalDynamics.relationshipPattern += " - reflecting your approach to building connections";
    }
    
    // Ensure conflict approach is detailed enough
    if (data.interpersonalDynamics.conflictApproach?.length < 15) {
      data.interpersonalDynamics.conflictApproach += " - showing how you navigate disagreements";
    }
  }
  
  if (!data.growthPotential) {
    console.log("Adding missing growthPotential field");
    data.growthPotential = {
      areasOfDevelopment: [
        "Enhancing self-awareness through regular reflection practices",
        "Developing resilience in the face of unexpected challenges"
      ],
      personalizedRecommendations: [{
        area: "Self-reflection practices",
        why: "To deepen understanding of personal patterns and reactions",
        action: "Implement a regular journaling practice focusing on emotional responses",
        resources: "Guided mindfulness and reflection exercises from established sources"
      }],
      keyStrengthsToLeverage: [
        "Analytical thinking that helps solve complex problems methodically",
        "Empathy that enables meaningful connections with diverse individuals"
      ],
      developmentTimeline: {
        shortTerm: "Focus on immediate self-awareness through daily reflection",
        mediumTerm: "Develop consistent personal growth habits through practice",
        longTerm: "Integrate insights into sustained personal evolution and deeper connections"
      }
    };
  }
  
  // Ensure traits array exists and has detailed entries
  if (!data.traits || !Array.isArray(data.traits) || data.traits.length === 0) {
    console.log("Adding missing or empty traits array");
    data.traits = [
      {
        trait: "Adaptability",
        score: 75,
        description: "You show remarkable flexibility in changing circumstances, adjusting your approach based on new information and shifting contexts.",
        strengths: [
          "Quick to adjust to new situations without unnecessary resistance",
          "Open to different perspectives that might challenge existing views"
        ],
        challenges: [
          "May sometimes struggle with maintaining consistency across changing environments",
          "Could benefit from establishing more stable routines in some areas"
        ]
      },
      {
        trait: "Analytical Thinking",
        score: 82,
        description: "You approach problems with logical reasoning and careful consideration of different factors and potential outcomes.",
        strengths: [
          "Effectively breaks down complex issues into manageable parts",
          "Makes decisions based on evidence and rational evaluation"
        ],
        challenges: [
          "May occasionally overanalyze situations that require intuitive responses",
          "Could benefit from integrating emotional factors more fully in some analyses"
        ]
      }
    ];
  } else {
    // Ensure each trait has sufficient detail
    data.traits.forEach((trait: any) => {
      // Expand short descriptions
      if (trait.description && trait.description.length < 40) {
        trait.description += ` This quality influences how you interact with the world and others around you, shaping your unique personal style.`;
      }
      
      // Ensure numeric scores have contextual meaning
      if (typeof trait.score === 'number') {
        // Format scores consistently as out of 100 if they appear to be percentages
        if (trait.score > 0 && trait.score <= 1) {
          trait.score = Math.round(trait.score * 100);
        }
        // Ensure score is reasonable
        if (trait.score > 100) trait.score = 100;
        if (trait.score < 0) trait.score = 0;
      }
      
      // Ensure strengths and challenges have at least two items
      if (!Array.isArray(trait.strengths) || trait.strengths.length === 0) {
        trait.strengths = ["Shows flexibility in diverse situations", "Adapts effectively to changing circumstances"];
      } else if (trait.strengths.length === 1) {
        trait.strengths.push("Uses this trait effectively in both personal and professional contexts");
      }
      
      if (!Array.isArray(trait.challenges) || trait.challenges.length === 0) {
        trait.challenges = ["May occasionally overuse this trait in inappropriate contexts", "Could benefit from balancing this quality with complementary approaches"];
      } else if (trait.challenges.length === 1) {
        trait.challenges.push("May need to adjust this trait in certain social situations");
      }
    });
  }
  
  // Ensure uniquenessMarkers array exists with meaningful content
  if (!data.uniquenessMarkers || !Array.isArray(data.uniquenessMarkers) || data.uniquenessMarkers.length < 2) {
    console.log("Adding or enhancing uniquenessMarkers array");
    data.uniquenessMarkers = [
      "Unique perspective that blends analytical and emotional intelligence",
      "Thoughtful approach to challenges that considers multiple angles",
      "Distinctive communication style that adapts to different audiences",
      "Particular combination of traits that creates your individual signature"
    ];
  }
  
  // Set ID if missing
  if (!data.id) {
    data.id = crypto.randomUUID();
    console.log("Generated new ID for analysis:", data.id);
  }
  
  // Set overview if missing or too short
  if (!data.overview || data.overview.length < 150) {
    console.log("Adding missing or too short overview");
    data.overview = "This personality analysis highlights a multifaceted individual with a unique combination of traits, cognitive patterns, and emotional responses. The profile reveals a blend of analytical abilities and interpersonal skills that create a distinctive approach to life's challenges. Throughout the analysis, we explore various dimensions of personality, revealing both strengths to leverage and growth opportunities to explore. The insights provided offer a framework for understanding personal patterns and potential development pathways.";
  }
  
    // Convert numeric awareness to descriptive format if needed
    if (typeof data.emotionalInsights?.awareness === 'number') {
      const score = data.emotionalInsights.awareness;
      let description = "";
      
      if (score >= 90) description = "Exceptional awareness with extraordinary depth";
      else if (score >= 80) description = "Advanced awareness with strong insight";
      else if (score >= 70) description = "Good awareness with clear understanding";
      else if (score >= 60) description = "Developing awareness with growing insight";
      else if (score >= 50) description = "Moderate awareness with potential";
      else description = "Emerging awareness with room for growth";
      
      data.emotionalInsights.awareness = `${score}/100 - ${description}`;
      console.log(`Emotional awareness score: ${score}/100`);
    }
    
    // Convert numeric empathy to descriptive format if needed
    if (typeof data.emotionalInsights?.empathy === 'number') {
      const score = data.emotionalInsights.empathy;
      let description = "";
      
      if (score >= 90) description = "Exceptional empathic capacity";
      else if (score >= 80) description = "Strong empathic awareness";
      else if (score >= 70) description = "Solid empathic understanding";
      else if (score >= 60) description = "Growing empathic sensitivity";
      else if (score >= 50) description = "Developing empathic awareness";
      else description = "Basic empathic recognition";
      
      data.emotionalInsights.empathy = `${score}/100 - ${description}`;
      console.log(`Empathy score: ${score}/100`);
    }
  
    // Ensure traits array exists and has detailed entries with varied scores
    if (!data.traits || !Array.isArray(data.traits) || data.traits.length === 0) {
      console.log("No traits found, generating default traits with varied scores");
      data.traits = [
        {
          trait: "Adaptability",
          score: Math.floor(Math.random() * 30) + 60, // Score between 60-90
          description: "You show remarkable flexibility in changing circumstances, adjusting your approach based on new information and shifting contexts.",
          strengths: [
            "Quick to adjust to new situations without unnecessary resistance",
            "Open to different perspectives that might challenge existing views"
          ],
          challenges: [
            "May sometimes struggle with maintaining consistency across changing environments",
            "Could benefit from establishing more stable routines in some areas"
          ]
        }
      ];
    } else {
      // Log trait scores for monitoring
      data.traits.forEach((trait: any) => {
        if (typeof trait.score === 'number') {
          console.log(`Trait ${trait.trait} score: ${trait.score}/100`);
        }
      });
    }
  
    // Log all numeric scores for monitoring
    console.log("Score distribution in analysis:", {
      traits: data.traits?.map((t: any) => ({ trait: t.trait, score: t.score })),
      emotionalAwareness: data.emotionalInsights?.awareness,
      empathy: data.emotionalInsights?.empathy
    });
  
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

    // Enhanced seed mechanism for more variation
    const seed = Date.now() % 10000;
    console.log(`Using seed: ${seed} for analysis generation`);

    const systemPrompt = `You are an elite psychological profiler with expertise in personality assessment, emotional intelligence, and cognitive behavior analysis. 
You deliver detailed, transformative personality insights that are emotionally resonant, intellectually substantive, and deeply personal.

IMPORTANTLY: Scores must be varied and reflect the actual responses:
- Use the full range from 40-95 for scoring
- Avoid defaulting to common scores like 75 or 85
- Consider response patterns to determine accurate scores
- Each trait should have its own unique score based on specific indicators
- Justify high scores (90+) with specific evidence
- Document low scores (below 60) with clear areas for improvement

YOUR OUTPUT MUST BE VALID JSON with these fields:
{
  "id": "string (UUID)",
  "overview": "string (detailed personality overview, at least 250 words)",
  "uniquenessMarkers": [
    "string (specific trait or quality that makes this person distinctive)",
    "string (another distinctive quality)"
  ],
  "coreProfiling": {
    "primaryArchetype": "string (detailed archetype name)",
    "secondaryArchetype": "string (detailed supporting archetype)",
    "description": "string (at least 75 words explaining these archetypes for this person)",
    "compatibilityInsights": [
      "string (specific insight about compatibility)",
      "string (another compatibility insight)"
    ]
  },
  "traits": [
    {
      "trait": "string (name of personality trait)",
      "score": number (0-100 scale),
      "description": "string (at least 50 words explaining this trait)",
      "strengths": [
        "string (specific strength related to this trait)",
        "string (another strength)"
      ],
      "challenges": [
        "string (specific challenge related to this trait)",
        "string (another challenge)"
      ]
    }
  ],
  "cognitiveProfile": {
    "style": "string (detailed thinking style with explanation)",
    "strengths": [
      "string (specific cognitive strength with context)",
      "string (another cognitive strength)"
    ],
    "blindSpots": [
      "string (specific cognitive blindspot with context)",
      "string (another blindspot)"
    ],
    "learningStyle": "string (detailed learning style description, at least 30 words)",
    "decisionMakingProcess": "string (detailed explanation of decision process, at least 30 words)"
  },
  "emotionalInsights": {
    "awareness": "string (score/100 - description of emotional awareness)",
    "regulation": "string (detailed description of emotional regulation capacity)",
    "empathy": "string (score/100 - description of empathic capacity)",
    "description": "string (at least 50 words on emotional landscape)",
    "stressResponse": "string (detailed description of stress response pattern)",
    "emotionalTriggersAndCoping": {
      "triggers": [
        "string (specific emotional trigger with explanation)",
        "string (another trigger)"
      ],
      "copingStrategies": [
        "string (specific coping strategy with explanation)",
        "string (another strategy)"
      ]
    }
  },
  "interpersonalDynamics": {
    "communicationStyle": "string (detailed communication style description)",
    "relationshipPattern": "string (detailed relationship approach description)",
    "conflictApproach": "string (detailed conflict handling description)",
    "socialNeeds": "string (explanation of social needs and boundaries)",
    "leadershipStyle": "string (explanation of leadership approach)",
    "teamRole": "string (explanation of contribution to groups)"
  },
  "growthPotential": {
    "areasOfDevelopment": [
      "string (specific growth area with context)",
      "string (another growth area)"
    ],
    "personalizedRecommendations": [
      {
        "area": "string (focus area for growth)",
        "why": "string (reason this area matters)",
        "action": "string (specific action step)",
        "resources": "string (helpful resources or approaches)"
      }
    ],
    "keyStrengthsToLeverage": [
      "string (strength that can be utilized more)",
      "string (another strength)"
    ],
    "developmentTimeline": {
      "shortTerm": "string (next 30 days focus)",
      "mediumTerm": "string (next 3-6 months focus)",
      "longTerm": "string (1+ year development)"
    }
  }
}

Each field is REQUIRED and the format must be EXACTLY as shown above. Do NOT add or modify field names.
ENSURE that all text fields contain sufficiently detailed descriptions (at least 30-50 words for major descriptions).
ALWAYS include context for numeric values (e.g., "85/100 - Exceptional: You demonstrate...").`;

    // Request with adjusted parameters for more variation
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
            content: `Generate a detailed personality analysis based on these ${Object.keys(responses).length} responses. Use seed ${seed} for consistency but ensure scores are varied and justified based on the responses:
${Object.entries(responses).map(([id, response]) => `${id}: "${response}"`).join('\n')}

REMEMBER:
1. Scores should vary between 40-95 based on actual responses
2. Avoid clustering around common values like 75 or 85
3. Each trait needs unique scoring with clear justification
4. Document score distribution in the description fields`
          }
        ],
        temperature: 0.65, // Lowered for better consistency
        frequency_penalty: 0.2,
        presence_penalty: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 6000,
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
            const jsonMatch = cleanedText.match(/\{(?:[^{}]|(\\{(?:[^{}]|{[^{}]*})*}))*\}/);
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
      
      // Now attempt to repair/complete any missing fields and ensure quality
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
