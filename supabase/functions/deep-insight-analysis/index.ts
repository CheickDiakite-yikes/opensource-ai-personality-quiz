
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
            and generate a comprehensive personality analysis. The analysis should include:
            - Core personality traits and characteristics
            - Cognitive patterns and thinking style
            - Emotional intelligence assessment
            - Growth areas and potential
            - Career suggestions based on personality traits
            - Interpersonal dynamics and relationship patterns
            - Learning style and preferences
            
            Format the response as a structured JSON object matching these fields. Use numerical scores (0-100) where appropriate.
            Be insightful, nuanced, and professional in your analysis.
            
            IMPORTANT: Return ONLY the JSON object with no markdown formatting, code blocks or additional text.`
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

    // Parse the AI response - handle potential JSON issues
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
    
    // Add metadata and format final response
    const analysis = {
      ...analysisContent,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      responsePatterns: analyzeResponsePatterns(responses)
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
