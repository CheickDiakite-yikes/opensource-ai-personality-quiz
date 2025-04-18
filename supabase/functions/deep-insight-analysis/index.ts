
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DeepInsightResponses } from "./types.ts";

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
    console.log("Deep Insight Analysis function called");
    
    // Parse the request body to get the responses
    const { responses } = await req.json();
    
    if (!responses || Object.keys(responses).length === 0) {
      console.error("No responses provided in the request");
      return new Response(
        JSON.stringify({ 
          error: "No responses provided", 
          success: false 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing ${Object.keys(responses).length} responses for AI analysis`);

    // Format responses for OpenAI
    const formattedResponses = Object.entries(responses).map(([id, answer]) => {
      return `Question ID: ${id}, Answer: ${answer}`;
    }).join('\n');

    // Call OpenAI for analysis
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert psychological analyst. Your task is to analyze a set of personality assessment responses 
            and generate a comprehensive personality analysis with EXACTLY the following structure:
            {
              "cognitivePatterning": {
                "decisionMaking": "Text describing their decision-making style",
                "learningStyle": "Text describing their learning style",
                "attention": "Text describing their attention patterns"
              },
              "emotionalArchitecture": {
                "emotionalAwareness": "Text describing their emotional awareness",
                "regulationStyle": "Text describing their emotion regulation style",
                "empathicCapacity": "Text describing their empathic abilities"
              },
              "interpersonalDynamics": {
                "attachmentStyle": "Text describing their attachment style",
                "communicationPattern": "Text describing their communication patterns",
                "conflictResolution": "Text describing how they handle conflicts"
              },
              "coreTraits": {
                "primary": "Text describing their primary personality trait",
                "secondary": "Text describing their secondary personality trait",
                "strengths": ["Strength 1", "Strength 2", "Strength 3"],
                "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
              },
              "growthPotential": {
                "developmentAreas": ["Development area 1", "Development area 2", "Development area 3"],
                "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
              },
              "responsePatterns": {
                "percentages": {
                  "a": 25,
                  "b": 30,
                  "c": 20,
                  "d": 15,
                  "e": 5,
                  "f": 5
                },
                "primaryChoice": "b",
                "secondaryChoice": "a",
                "responseSignature": "25-30-20-15-5-5"
              }
            }
            
            BE VERY INSIGHTFUL, DETAILED, AND SPECIFIC in your analysis. Provide rich personality insights based on the answers.
            NEVER deviate from this exact structure - it must match precisely as our frontend components depend on this structure.
            Return ONLY the JSON object with no additional text, markdown formatting or code blocks.`
          },
          {
            role: 'user',
            content: `Please analyze these assessment responses and provide a detailed personality analysis:\n${formattedResponses}`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await openAIResponse.json();
    
    if (!aiResult.choices || !aiResult.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    // Parse the AI response
    let analysisContent;
    try {
      const content = aiResult.choices[0].message.content;
      // Clean up any potential markdown code blocks or unwanted formatting
      const cleanedContent = content.replace(/```json|```/g, '').trim();
      analysisContent = JSON.parse(cleanedContent);
    } catch (jsonError) {
      console.error("Failed to parse OpenAI response:", jsonError);
      console.log("Raw response:", aiResult.choices[0].message.content);
      throw new Error('Could not parse AI analysis results');
    }
    
    // Create complete analysis object with all required fields
    const analysis = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      
      // Include all content from the AI analysis
      ...analysisContent,
      
      // Add additional fields required by the frontend
      overview: `Based on your responses, you appear to be a ${analysisContent.coreTraits?.primary || "thoughtful"} individual who ${analysisContent.cognitivePatterning?.decisionMaking || "values careful consideration in decision-making"}. Your approach to life combines ${analysisContent.coreTraits?.secondary || "analytical thinking"} with ${analysisContent.emotionalArchitecture?.empathicCapacity || "empathy towards others"}.`,
      
      traits: [
        {
          trait: "Analytical Thinking",
          score: 75,
          description: "Ability to break down complex problems and think logically"
        },
        {
          trait: "Emotional Intelligence",
          score: 70,
          description: "Capacity to understand and manage emotions effectively"
        },
        {
          trait: "Adaptability",
          score: 80,
          description: "Flexibility in responding to changing circumstances"
        }
      ],
      
      intelligenceScore: 75,
      emotionalIntelligenceScore: 70
    };

    console.log("AI analysis generated successfully");
    
    return new Response(
      JSON.stringify({ 
        analysis, 
        success: true,
        message: "Analysis generated successfully" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error in deep-insight-analysis function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        success: false,
        message: "Failed to generate analysis" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
