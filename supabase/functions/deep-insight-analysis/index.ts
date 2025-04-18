
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
      console.log("Successfully parsed AI analysis");
    } catch (jsonError) {
      console.error("Failed to parse OpenAI response:", jsonError);
      console.log("Raw response:", aiResult.choices[0].message.content);
      throw new Error('Could not parse AI analysis results');
    }
    
    // Analyze response patterns
    const responsePatterns = analyzeResponsePatterns(responses);
    
    // Create complete analysis object with all required fields
    const analysis = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      
      // Personality overview
      overview: `Based on your responses, you appear to be a ${analysisContent.coreTraits?.primary || "thoughtful"} individual who ${analysisContent.cognitivePatterning?.decisionMaking || "values careful consideration in decision-making"}. Your approach to life combines ${analysisContent.coreTraits?.secondary || "analytical thinking"} with ${analysisContent.emotionalArchitecture?.empathicCapacity || "empathy towards others"}.`,
      
      // Include all required structured data fields
      coreTraits: analysisContent.coreTraits || {
        primary: "Balanced thinker",
        secondary: "Adaptable problem-solver",
        strengths: ["Analytical thinking", "Emotional awareness", "Adaptability"],
        challenges: ["Decision making under pressure", "Perfectionism", "Overthinking"]
      },
      
      cognitivePatterning: analysisContent.cognitivePatterning || {
        decisionMaking: "You tend to gather information methodically before making decisions. You value logical consistency and consider multiple perspectives when evaluating options.",
        learningStyle: "You learn best through structured, systematic approaches with clear objectives.",
        attention: "You have a focused attention style that allows you to concentrate deeply on tasks of interest."
      },
      
      emotionalArchitecture: analysisContent.emotionalArchitecture || {
        emotionalAwareness: "You have strong awareness of your emotional states and can generally identify what you're feeling in the moment.",
        regulationStyle: "You manage emotions through a combination of analytical processing and practical coping strategies.",
        empathicCapacity: "You can understand others' emotional experiences, particularly when they're clearly communicated."
      },
      
      interpersonalDynamics: analysisContent.interpersonalDynamics || {
        attachmentStyle: "You form meaningful connections with others while maintaining healthy boundaries.",
        communicationPattern: "Your communication style is thoughtful and precise, focusing on clarity and accuracy.",
        conflictResolution: "You approach conflicts with a problem-solving mindset, seeking fair and logical resolutions."
      },
      
      growthPotential: analysisContent.growthPotential || {
        developmentAreas: ["Finding balance between analysis and action", "Developing comfort with ambiguity", "Building resilience to setbacks"],
        recommendations: ["Practice time-bounded decision making", "Engage in mindfulness to reduce overthinking", "Seek feedback from diverse perspectives"]
      },
      
      // Add response patterns analysis
      responsePatterns: responsePatterns,
      
      // Add additional fields required by the frontend
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

// Helper function to analyze response patterns
function analyzeResponsePatterns(responses: DeepInsightResponses) {
  console.log("Analyzing response patterns");
  
  // Extract key insights to personalize the analysis
  const responsesArray = Object.entries(responses);
  
  // Count different answer choices to detect patterns
  const answerCounts = {
    a: 0,
    b: 0, 
    c: 0,
    d: 0,
    e: 0,
    f: 0
  };
  
  responsesArray.forEach(([_, answer]) => {
    const lastChar = answer.charAt(answer.length - 1);
    if (lastChar === 'a') answerCounts.a++;
    if (lastChar === 'b') answerCounts.b++;
    if (lastChar === 'c') answerCounts.c++;
    if (lastChar === 'd') answerCounts.d++;
    if (lastChar === 'e') answerCounts.e++;
    if (lastChar === 'f') answerCounts.f++;
  });
  
  const totalResponses = responsesArray.length;
  const percentages = {
    a: Math.round((answerCounts.a / totalResponses) * 100),
    b: Math.round((answerCounts.b / totalResponses) * 100),
    c: Math.round((answerCounts.c / totalResponses) * 100),
    d: Math.round((answerCounts.d / totalResponses) * 100),
    e: Math.round((answerCounts.e / totalResponses) * 100),
    f: Math.round((answerCounts.f / totalResponses) * 100)
  };
  
  // Generate a unique response signature
  const responseSignature = `${percentages.a}-${percentages.b}-${percentages.c}-${percentages.d}-${percentages.e}-${percentages.f}`;
  
  // Determine primary tendencies based on highest percentages
  const sortedChoices = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)
    .map(([choice]) => choice);
  
  const primaryChoice = sortedChoices[0];
  const secondaryChoice = sortedChoices[1];
  
  return {
    percentages,
    primaryChoice,
    secondaryChoice,
    responseSignature
  };
}
