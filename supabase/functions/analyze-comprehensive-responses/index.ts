import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    // Get request data
    const { assessmentId, responses, enhancedAnalysis, instructions, forceRun } = await req.json();
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAiKey) {
      throw new Error('Missing OpenAI API key');
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Validate input
    if (!assessmentId) {
      throw new Error('Missing assessmentId');
    }

    console.log(`Processing analysis for assessment ID: ${assessmentId}`);
    console.log(`Enhanced analysis requested: ${enhancedAnalysis ? 'yes' : 'no'}`);
    
    // Check if analysis already exists (unless force run is requested)
    if (!forceRun) {
      const { data: existingAnalysis, error: lookupError } = await supabase
        .from('comprehensive_analyses')
        .select('id')
        .eq('assessment_id', assessmentId)
        .maybeSingle();
        
      if (lookupError) {
        console.error("Error checking for existing analysis:", lookupError);
      } else if (existingAnalysis) {
        console.log(`Analysis already exists for assessment ${assessmentId}, returning existing analysis ID: ${existingAnalysis.id}`);
        return new Response(
          JSON.stringify({ 
            analysisId: existingAnalysis.id,
            message: "Using existing analysis" 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // If no responses provided, fetch them from the database
    let analysisResponses = responses;
    if (!analysisResponses || analysisResponses.length === 0) {
      console.log(`No responses provided, fetching from database for assessment ID: ${assessmentId}`);
      const { data: assessmentData, error: fetchError } = await supabase
        .from('comprehensive_assessments')
        .select('responses')
        .eq('id', assessmentId)
        .single();
        
      if (fetchError || !assessmentData) {
        throw new Error(`Failed to fetch assessment responses: ${fetchError?.message || 'No data found'}`);
      }
      
      analysisResponses = assessmentData.responses;
      console.log(`Fetched ${Array.isArray(analysisResponses) ? analysisResponses.length : 'unknown'} responses from database`);
    }
    
    // Ensure responses is an array and has items
    if (!Array.isArray(analysisResponses) || analysisResponses.length === 0) {
      throw new Error(`Invalid or empty responses data. Type: ${typeof analysisResponses}`);
    }
    
    console.log(`Processing ${analysisResponses.length} responses for analysis`);
    
    // Prepare the analysis request
    // Create a structured prompt for the OpenAI API to generate more sophisticated analysis
    
    // Extract category distribution for context
    const categoryDistribution = {};
    analysisResponses.forEach(r => {
      const category = r.category || 'Uncategorized';
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
    });
    
    // Extract response summaries for analysis
    const responseSummaries = analysisResponses.map(r => {
      return {
        category: r.category,
        question: r.questionId, // Typically this would be the actual question but we're using the ID for now
        answer: r.answer
      };
    });
    
    // Construct the system message
    const systemMessage = instructions?.systemInstruction || 
    `You are an expert psychological profiler and personality analyst. 
    Create a comprehensive personality analysis based on the assessment responses provided.
    Your analysis should be detailed, nuanced, and provide actionable insights.
    Format your response as structured JSON that can be parsed by a JavaScript application.`;
    
    // Construct the user message with context and instructions
    const userMessage = `
    I've completed a comprehensive personality assessment with ${analysisResponses.length} responses.
    
    Response distribution by category:
    ${Object.entries(categoryDistribution).map(([k, v]) => `${k}: ${v}`).join('\n')}
    
    Based on these responses, please provide a detailed personality analysis with the following components:
    
    1. A thorough overview paragraph capturing my personality essence
    2. At least 5 key personality traits with scores (1-10) and detailed descriptions
    3. Intelligence profile with cognitive strengths and weaknesses
    4. Emotional intelligence assessment (score 1-100)
    5. Motivators and inhibitors that drive or block my behavior
    6. Growth areas and development suggestions
    7. Relationship patterns and compatibility insights
    8. Career suggestions that align with my personality
    9. A personalized developmental roadmap with clear next steps
    
    Return your analysis as a structured JSON object that can be directly used in an application.`;
    
    // Prepare the OpenAI API request
    const openaiRequest = {
      model: "gpt-4o",  // Using gpt-4o for comprehensive, high-quality analysis
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user", 
          content: userMessage
        },
        {
          role: "user",
          content: JSON.stringify(responseSummaries.slice(0, 100)) // Send first 100 responses for context
        }
      ],
      temperature: instructions?.temperature || 0.7,
      max_tokens: 4000,
      response_format: { type: instructions?.responseFormat === "json" ? "json_object" : "text" }
    };
    
    console.log("Sending request to OpenAI API...");
    
    // Call the OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiKey}`
      },
      body: JSON.stringify(openaiRequest)
    });
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error(`OpenAI API error: ${openaiResponse.status} ${errorText}`);
      throw new Error(`OpenAI API returned error: ${openaiResponse.status} ${errorText}`);
    }
    
    const openaiData = await openaiResponse.json();
    console.log("Received response from OpenAI API");
    
    if (!openaiData.choices || openaiData.choices.length === 0) {
      throw new Error("Invalid response from OpenAI API");
    }
    
    // Extract the analysis content
    let analysisContent;
    const responseText = openaiData.choices[0].message.content;
    
    // Try to parse the response as JSON
    try {
      // Extract JSON if it's wrapped in code blocks
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*)```/);
      if (jsonMatch && jsonMatch[1]) {
        analysisContent = JSON.parse(jsonMatch[1].trim());
      } else {
        // Otherwise try to parse the whole response
        analysisContent = JSON.parse(responseText);
      }
    } catch (e) {
      console.error("Error parsing JSON from OpenAI response:", e);
      console.log("Raw response:", responseText);
      
      // Fall back to using the text as-is in a structured format
      analysisContent = {
        overview: responseText.slice(0, 1000),
        traits: [
          { name: "Analysis Error", score: 5, description: "Could not parse structured analysis" }
        ],
        error: "Failed to parse structured analysis"
      };
    }
    
    console.log("Successfully parsed analysis content");
    
    // Ensure we have a valid analysis structure with required fields
    const analysis = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      assessment_id: assessmentId,
      user_id: null, // Will be populated from the assessment
      overview: analysisContent.overview || "No overview provided",
      traits: analysisContent.traits || [],
      intelligence: analysisContent.intelligence || {},
      intelligence_score: analysisContent.intelligenceScore || analysisContent.intelligence_score || 0,
      emotional_intelligence_score: analysisContent.emotionalIntelligenceScore || analysisContent.emotional_intelligence_score || 0,
      cognitive_style: analysisContent.cognitiveStyle || {},
      value_system: analysisContent.valueSystem || analysisContent.values || [],
      motivators: analysisContent.motivators || [],
      inhibitors: analysisContent.inhibitors || [],
      weaknesses: analysisContent.weaknesses || [],
      growth_areas: analysisContent.growthAreas || analysisContent.growth_areas || [],
      relationship_patterns: analysisContent.relationshipPatterns || {},
      career_suggestions: analysisContent.careerSuggestions || analysisContent.career_suggestions || [],
      learning_pathways: analysisContent.learningPathways || [],
      roadmap: analysisContent.roadmap || "",
      result: analysisContent // Store the full result for future reference
    };
    
    // Get the user ID from the assessment
    const { data: assessmentData, error: fetchError } = await supabase
      .from('comprehensive_assessments')
      .select('user_id')
      .eq('id', assessmentId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching user_id from assessment:", fetchError);
    } else if (assessmentData) {
      analysis.user_id = assessmentData.user_id;
    }
    
    // Save the analysis to the database
    console.log(`Saving analysis to database with ID: ${analysis.id}`);
    const { error: saveError } = await supabase
      .from('comprehensive_analyses')
      .insert(analysis);
      
    if (saveError) {
      console.error("Error saving analysis to database:", saveError);
      throw new Error(`Failed to save analysis: ${saveError.message}`);
    }
    
    console.log("Analysis saved successfully");
    
    // Return the analysis ID
    return new Response(
      JSON.stringify({ 
        analysisId: analysis.id,
        analysis: {
          id: analysis.id,
          overview: analysis.overview,
          traits: analysis.traits.slice(0, 3) // Preview of traits
        },
        message: "Analysis completed successfully"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in analyze-comprehensive-responses function:", error);
    
    // Generate a basic fallback analysis when everything fails
    const fallbackAnalysis = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      assessment_id: assessmentId,
      user_id: null,
      overview: "Thank you for completing the assessment. We encountered an issue during processing, but your responses have been saved.",
      traits: [
        {
          name: "Analysis Processing",
          score: 5,
          description: "Your assessment is still being processed. Please check back shortly."
        }
      ],
      result: { error: error.message || "An unknown error occurred" }
    };
    
    // Try to save the fallback analysis
    try {
      await supabase
        .from('comprehensive_analyses')
        .insert(fallbackAnalysis);
        
      return new Response(
        JSON.stringify({ 
          analysisId: fallbackAnalysis.id,
          error: error.message || "An unknown error occurred",
          message: "Fallback analysis created"
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (saveError) {
      // If we can't even save the fallback, just return the error
      return new Response(
        JSON.stringify({ 
          error: error.message || "An unknown error occurred",
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  }
});
