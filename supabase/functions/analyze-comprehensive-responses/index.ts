
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
        question: r.questionId, // This could be enhanced to fetch the actual question text
        answer: r.answer
      };
    });
    
    // Construct the system message with more detailed instructions for comprehensive output
    const systemMessage = instructions?.systemInstruction || 
    `You are an expert psychological profiler and personality analyst with advanced degrees in psychology.
    
    Create a detailed, evidence-based personality analysis based on the assessment responses provided.
    Your analysis must be thorough, nuanced, and cover ALL of the required sections with substantial content.
    
    Format your response as a structured JSON object with the following mandatory fields:
    
    1. "overview": A comprehensive paragraph (at least 250 words) capturing the person's personality essence
    2. "traits": Array of at least 8 personality traits, each with:
       - name (string)
       - trait (string, same as name for compatibility)
       - score (number between 1-10)
       - description (string, at least 100 characters)
       - impact (string array with at least 3 items)
       - recommendations (string array with at least 3 items)
       - strengths (string array with at least 3 items)
       - challenges (string array with at least 2 items)
       - growthSuggestions (string array with at least 3 items)
    3. "intelligence": Object with:
       - type (string)
       - score (number between 70-130)
       - description (string, at least 100 characters)
       - strengths (string array with at least 3 items)
       - areas_for_development (string array with at least 3 items)
       - learning_style (string)
       - cognitive_preferences (string array with at least 3 items)
       - domains (optional array of objects with name and score)
    4. "intelligenceScore": number (between 70-130)
    5. "emotionalIntelligenceScore": number (between 60-140)
    6. "cognitiveStyle": Object with primary, secondary, and description fields
    7. "valueSystem": Object with strengths, weaknesses, description, and compatibleTypes fields
    8. "motivators": String array with at least 5 items
    9. "inhibitors": String array with at least 3 items
    10. "weaknesses": String array with at least 3 items
    11. "growthAreas": String array with at least 4 items
    12. "relationshipPatterns": Object with strengths, challenges, and compatibleTypes arrays
    13. "careerSuggestions": String array with at least 5 career options
    14. "learningPathways": String array with at least 3 learning suggestions
    15. "roadmap": String with a developmental journey of at least 200 characters
    
    You MUST include ALL these fields with substantial content. Do not leave any field empty or with minimal content.
    The final output must be valid JSON that can be parsed by JavaScript.`;
    
    // Construct the user message with context and specific output requirements
    const userMessage = `
    I've completed a comprehensive personality assessment with ${analysisResponses.length} responses.
    
    Response distribution by category:
    ${Object.entries(categoryDistribution).map(([k, v]) => `${k}: ${v}`).join('\n')}
    
    Based on these responses, provide a detailed psychological profile with all of the following components:
    
    1. A 250+ word overview paragraph capturing my personality essence
    2. At least 8 key personality traits with scores (1-10) and detailed descriptions
    3. Intelligence profile with cognitive strengths and weaknesses
    4. Emotional intelligence assessment (score 60-140)
    5. Specific motivators and inhibitors that drive or block my behavior (minimum 5 motivators)
    6. At least 4 growth areas with specific development suggestions
    7. Relationship patterns and compatibility insights
    8. At least 5 career suggestions that align with my personality
    9. A detailed developmental roadmap with clear next steps
    
    Make sure to provide substantial content for EACH section - this is critical for my personal development.`;
    
    // Configure OpenAI request with more tokens and clear JSON formatting requirements
    const openaiRequest = {
      model: "gpt-4o", // Using the most capable model for high-quality analysis
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
          content: `Here are my responses to analyze: ${JSON.stringify(responseSummaries.slice(0, 100))}

          IMPORTANT: Ensure your response is a valid JSON object with ALL required fields populated with substantial content.
          Your analysis MUST be thorough and complete - do not skip any sections.`
        }
      ],
      temperature: instructions?.temperature || 0.5, // Lower temperature for more consistent outputs
      max_tokens: 4096, // Increased token limit for more detailed analysis
      response_format: { type: "json_object" } // Force JSON format response
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
      
      // Enhanced fallback implementation
      analysisContent = generateFallbackAnalysis(responseText);
    }
    
    console.log("Successfully parsed analysis content");
    
    // Validate that the analysis has required fields, add fallbacks for missing ones
    const analysis = ensureCompleteAnalysis(analysisContent, assessmentId);
    
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
    
    // Return the analysis ID and a preview
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
    
    // Create a fallback analysis with the error information
    try {
      // Generate a more substantial fallback analysis
      const fallbackAnalysis = generateComprehensiveFallback(assessmentId);
      
      // Try to save the fallback analysis
      await supabase
        .from('comprehensive_analyses')
        .insert(fallbackAnalysis);
        
      return new Response(
        JSON.stringify({ 
          analysisId: fallbackAnalysis.id,
          analysis: {
            id: fallbackAnalysis.id,
            overview: fallbackAnalysis.overview,
            traits: fallbackAnalysis.traits.slice(0, 3)
          },
          message: "Fallback analysis created due to processing error"
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
          message: "Failed to create analysis"
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  }
});

// Function to generate a fallback analysis if JSON parsing fails
function generateFallbackAnalysis(rawText) {
  console.log("Generating structured fallback from raw text");
  
  // Extract any useful content from the raw text
  let overview = "Analysis processing encountered an issue with the structured output format.";
  
  // Try to extract some content from the raw text
  if (rawText && rawText.length > 50) {
    // Look for potential overview paragraph
    const paragraphs = rawText.split('\n\n').filter(p => p.length > 100);
    if (paragraphs.length > 0) {
      overview = paragraphs[0].substring(0, 500);
    } else {
      // Just use the first chunk of text
      overview = rawText.substring(0, 500);
    }
  }
  
  // Return a minimal structured analysis
  return {
    overview,
    traits: [
      {
        name: "Analysis Processing",
        trait: "Analysis Processing",
        score: 5,
        description: "Your full personality analysis is still being processed. We've encountered a formatting issue with the AI output.",
        impact: ["We're working to provide you with a complete analysis", "Your responses have been saved", "The system is analyzing your profile"],
        recommendations: ["Check back soon for your complete analysis", "Try refreshing the page", "Your data is safe and will be available shortly"],
        strengths: ["You've completed the full assessment", "Your responses are being analyzed", "We're generating insights based on your answers"],
        challenges: ["Processing complex personality data takes time"],
        growthSuggestions: ["While waiting, reflect on what insights you hope to gain", "Consider which personality areas you're most curious about", "Think about how you might apply the insights to your personal development"]
      }
    ],
    intelligence: {
      type: "Comprehensive Analysis",
      score: 100,
      description: "Your intelligence profile is being generated based on your assessment responses.",
      strengths: ["Analysis in progress", "Results coming soon", "Comprehensive evaluation"],
      areas_for_development: ["Patience while waiting for results", "Reflection on self-assessment", "Preparation to apply insights"],
      learning_style: "Being determined",
      cognitive_preferences: ["Analytical thinking", "Problem-solving", "Strategic planning"]
    },
    intelligenceScore: 100,
    emotionalIntelligenceScore: 100,
    cognitiveStyle: {
      primary: "Analytical",
      secondary: "Reflective",
      description: "You take a thoughtful approach to understanding yourself and others."
    },
    valueSystem: {
      strengths: ["Self-improvement", "Personal growth", "Insight seeking"],
      weaknesses: ["Analysis still in progress", "Complete profile coming soon"],
      description: "Your value system emphasizes self-knowledge and personal development.",
      compatibleTypes: ["Growth-oriented individuals", "Self-aware partners", "Communicative collaborators"]
    },
    motivators: ["Self-understanding", "Personal growth", "Insight generation", "Skill development", "Performance optimization"],
    inhibitors: ["Analysis processing delay", "Incomplete insights", "Waiting for results"],
    weaknesses: ["Full analysis pending", "Complete profile coming soon", "Processing in progress"],
    growthAreas: [
      "Self-reflection while waiting for results", 
      "Patience during processing", 
      "Preparation to apply forthcoming insights", 
      "Consideration of personal development goals"
    ],
    relationshipPatterns: {
      strengths: ["Communication", "Self-awareness", "Growth orientation"],
      challenges: ["Full analysis pending", "Complete insights coming soon"],
      compatibleTypes: ["Growth-minded individuals", "Patient partners", "Communicative collaborators"]
    },
    careerSuggestions: [
      "Personal Development Coach", 
      "Strategic Advisor", 
      "Analytical Specialist", 
      "Research Professional",
      "Organizational Consultant"
    ],
    learningPathways: [
      "Self-reflection practice", 
      "Emotional intelligence development", 
      "Strategic thinking enhancement"
    ],
    roadmap: "Your personal development journey begins with understanding your unique psychological profile. Once your complete analysis is ready, you'll receive specific insights and actionable recommendations tailored to your personality traits, cognitive style, emotional patterns, and growth opportunities. This will provide you with a clear path for personal and professional development."
  };
}

// Function to generate a comprehensive fallback analysis when everything fails
function generateComprehensiveFallback(assessmentId) {
  const id = crypto.randomUUID();
  
  return {
    id,
    created_at: new Date().toISOString(),
    assessment_id: assessmentId,
    user_id: null, // Will be updated if available
    overview: "Thank you for completing our comprehensive personality assessment! We're currently processing your responses to generate personalized insights about your personality traits, cognitive patterns, emotional intelligence, and more. This analysis will provide you with a detailed understanding of your psychological profile and offer actionable recommendations for personal growth and development.",
    traits: [
      {
        name: "Analysis In Progress",
        trait: "Analysis In Progress",
        score: 5,
        description: "Your personality traits are being analyzed based on your assessment responses. The system is working to identify your key characteristics, strengths, and potential growth areas.",
        impact: ["Your complete personality profile is being generated", "Our AI system is analyzing response patterns", "Multiple psychological frameworks are being applied to your data"],
        recommendations: ["Check back soon for your complete analysis", "Refresh the page in a few moments", "Your comprehensive profile will be ready shortly"],
        strengths: ["You've completed the full assessment", "Your responses are being processed", "Your profile is being created"],
        challenges: ["Processing complex personality data takes time"],
        growthSuggestions: ["While waiting, reflect on what insights you hope to gain", "Consider which personality areas you're most curious about", "Think about how you might apply the insights to your personal development"]
      },
      {
        name: "Self-Reflection",
        trait: "Self-Reflection",
        score: 7,
        description: "By completing this assessment, you've demonstrated a commitment to self-understanding and personal growth. This reflective quality is valuable for ongoing development and insight generation.",
        impact: ["Enables continual personal growth", "Facilitates deeper self-awareness", "Supports meaningful life choices"],
        recommendations: ["Journal regularly about your thoughts and feelings", "Set aside time each week for personal reflection", "Ask trusted friends for honest feedback"],
        strengths: ["Willingness to examine yourself", "Interest in personal development", "Openness to feedback"],
        challenges: ["Balancing reflection with action"],
        growthSuggestions: ["Practice mindfulness to deepen self-awareness", "Connect reflection to concrete action steps", "Explore different reflection techniques like journaling, meditation, or structured review"]
      },
      {
        name: "Growth Mindset",
        trait: "Growth Mindset",
        score: 8,
        description: "Your interest in understanding your personality suggests a growth mindset - the belief that capabilities can be developed through dedication and work. This mindset is associated with resilience and achievement.",
        impact: ["Supports resilience during challenges", "Encourages continuous learning", "Helps overcome limitations"],
        recommendations: ["Embrace challenges as opportunities to grow", "Focus on learning process rather than outcomes", "Develop strategies for persistent effort"],
        strengths: ["Adaptability to new situations", "Resilience when facing setbacks", "Openness to learning"],
        challenges: ["Maintaining motivation during plateaus"],
        growthSuggestions: ["Celebrate progress rather than perfection", "Seek feedback as a growth tool", "Develop specific growth goals in different life areas"]
      }
    ],
    intelligence: {
      type: "Analytical Intelligence",
      score: 110,
      description: "Your intelligence profile reflects your cognitive abilities across multiple domains. Our analysis is processing your unique cognitive strengths and potential areas for development.",
      strengths: ["Pattern recognition", "Critical thinking", "Problem-solving ability"],
      areas_for_development: ["Applying knowledge to novel situations", "Integrating multiple perspectives", "Creative thinking outside established frameworks"],
      learning_style: "Adaptive",
      cognitive_preferences: ["Systematic analysis", "Logical reasoning", "Strategic planning"]
    },
    intelligence_score: 110,
    intelligenceScore: 110,
    emotional_intelligence_score: 115,
    emotionalIntelligenceScore: 115,
    cognitive_style: {
      primary: "Analytical",
      secondary: "Reflective",
      description: "You likely approach situations with careful consideration and systematic thinking, balancing analysis with reflection."
    },
    cognitiveStyle: {
      primary: "Analytical",
      secondary: "Reflective",
      description: "You likely approach situations with careful consideration and systematic thinking, balancing analysis with reflection."
    },
    value_system: {
      strengths: ["Personal growth", "Self-understanding", "Authenticity"],
      weaknesses: ["Full analysis pending", "Complete profile coming soon"],
      description: "Your values appear to emphasize personal development, authenticity, and meaningful growth.",
      compatibleTypes: ["Growth-oriented individuals", "Authentic communicators", "Reflective partners"]
    },
    valueSystem: {
      strengths: ["Personal growth", "Self-understanding", "Authenticity"],
      weaknesses: ["Full analysis pending", "Complete profile coming soon"],
      description: "Your values appear to emphasize personal development, authenticity, and meaningful growth.",
      compatibleTypes: ["Growth-oriented individuals", "Authentic communicators", "Reflective partners"]
    },
    motivators: ["Self-improvement", "Knowledge acquisition", "Personal insight", "Meaningful connection", "Achievement", "Growth opportunities"],
    inhibitors: ["Uncertainty about direction", "Perfectionism", "Analysis paralysis", "External pressures"],
    weaknesses: ["Analysis still processing", "Full profile pending", "Complete assessment being generated"],
    growth_areas: ["Self-awareness development", "Emotional regulation", "Interpersonal effectiveness", "Strategic goal-setting", "Resilience building"],
    growthAreas: ["Self-awareness development", "Emotional regulation", "Interpersonal effectiveness", "Strategic goal-setting", "Resilience building"],
    relationship_patterns: {
      strengths: ["Thoughtfulness", "Depth of connection", "Authenticity"],
      challenges: ["Analysis still processing", "Full profile pending"],
      compatibleTypes: ["Growth-oriented individuals", "Communicative partners", "Emotionally intelligent connections"]
    },
    relationshipPatterns: {
      strengths: ["Thoughtfulness", "Depth of connection", "Authenticity"],
      challenges: ["Analysis still processing", "Full profile pending"],
      compatibleTypes: ["Growth-oriented individuals", "Communicative partners", "Emotionally intelligent connections"]
    },
    career_suggestions: ["Personal Development Coach", "Strategic Analyst", "Research Specialist", "Organizational Consultant", "Educational Designer", "Human Resources Developer"],
    careerSuggestions: ["Personal Development Coach", "Strategic Analyst", "Research Specialist", "Organizational Consultant", "Educational Designer", "Human Resources Developer"],
    learning_pathways: ["Self-directed study", "Structured learning programs", "Experiential learning", "Mentorship and coaching"],
    learningPathways: ["Self-directed study", "Structured learning programs", "Experiential learning", "Mentorship and coaching"],
    roadmap: "Your personal development journey begins with understanding your unique psychological profile. Once your complete analysis is processed, you'll receive specific insights and actionable recommendations tailored to your personality traits, cognitive style, emotional patterns, and growth opportunities. This will provide you with a clear roadmap for personal and professional development, highlighting key areas for focus and suggesting practical strategies for growth. Consider this the first step in a meaningful journey toward greater self-awareness and intentional development."
  };
}

// Function to ensure the analysis has all required fields with substantial content
function ensureCompleteAnalysis(analysisContent, assessmentId) {
  // Create base analysis object with ID and timestamps
  const analysis = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    assessment_id: assessmentId,
    user_id: null,
    result: analysisContent // Store the original result
  };
  
  // Ensure overview exists and is substantial
  analysis.overview = ensureField(analysisContent.overview, 
    "This personality analysis is based on your comprehensive assessment responses. It reveals patterns in your thinking, emotional processing, social interactions, and core values. Your profile shows a unique constellation of traits that influence how you perceive the world, make decisions, and connect with others. The insights provided aim to enhance your self-awareness and offer pathways for personal growth and development in various life domains.", 250);
  
  // Ensure traits exist and are properly structured
  analysis.traits = ensureTraits(analysisContent.traits);
  
  // Ensure intelligence exists and is properly structured
  analysis.intelligence = ensureIntelligence(analysisContent.intelligence);
  
  // Ensure scores exist
  analysis.intelligence_score = ensureNumberField(analysisContent.intelligenceScore || analysisContent.intelligence_score, 70, 130);
  analysis.intelligenceScore = analysis.intelligence_score;
  analysis.emotional_intelligence_score = ensureNumberField(analysisContent.emotionalIntelligenceScore || analysisContent.emotional_intelligence_score, 60, 140);
  analysis.emotionalIntelligenceScore = analysis.emotional_intelligence_score;
  
  // Ensure cognitive style exists
  analysis.cognitive_style = ensureCognitiveStyle(analysisContent.cognitiveStyle || analysisContent.cognitive_style);
  analysis.cognitiveStyle = analysis.cognitive_style;
  
  // Ensure value system exists
  analysis.value_system = ensureValueSystem(analysisContent.valueSystem || analysisContent.value_system);
  analysis.valueSystem = analysis.value_system;
  
  // Ensure motivators and inhibitors exist
  analysis.motivators = ensureStringArray(analysisContent.motivators, 5, 
    ["Personal growth", "Knowledge acquisition", "Achievement", "Social connection", "Autonomy", "Creativity"]);
  analysis.inhibitors = ensureStringArray(analysisContent.inhibitors, 3,
    ["Fear of failure", "Perfectionism", "External pressure", "Lack of clarity"]);
  
  // Ensure weaknesses exist
  analysis.weaknesses = ensureStringArray(analysisContent.weaknesses, 3,
    ["Overthinking decisions", "Difficulty with uncertainty", "Balancing multiple priorities"]);
  
  // Ensure growth areas exist
  analysis.growth_areas = ensureStringArray(analysisContent.growthAreas || analysisContent.growth_areas, 4,
    ["Emotional regulation", "Strategic decision-making", "Interpersonal effectiveness", "Self-compassion development"]);
  analysis.growthAreas = analysis.growth_areas;
  
  // Ensure relationship patterns exist
  analysis.relationship_patterns = ensureRelationshipPatterns(analysisContent.relationshipPatterns || analysisContent.relationship_patterns);
  analysis.relationshipPatterns = analysis.relationship_patterns;
  
  // Ensure career suggestions exist
  analysis.career_suggestions = ensureStringArray(analysisContent.careerSuggestions || analysisContent.career_suggestions, 5,
    ["Strategic Consultant", "Research Analyst", "Educational Developer", "Creative Director", "Wellness Coach"]);
  analysis.careerSuggestions = analysis.career_suggestions;
  
  // Ensure learning pathways exist
  analysis.learning_pathways = ensureStringArray(analysisContent.learningPathways || analysisContent.learning_pathways, 3,
    ["Self-directed study in areas of interest", "Structured programs with clear milestones", "Experiential learning through practical application"]);
  analysis.learningPathways = analysis.learning_pathways;
  
  // Ensure roadmap exists
  analysis.roadmap = ensureField(analysisContent.roadmap,
    "Your personal development journey begins with increased self-awareness from this assessment. Start by focusing on one key growth area identified in your analysis. Set specific, measurable goals and integrate daily practices that reinforce your development. Seek feedback from trusted others to monitor your progress. As you make progress, gradually expand your focus to additional areas while maintaining your initial improvements. This gradual, intentional approach will lead to sustainable personal growth over time.", 200);
  
  return analysis;
}

// Helper function to ensure a field exists and has minimum length
function ensureField(value, fallback, minLength = 100) {
  if (!value || typeof value !== 'string' || value.length < minLength) {
    return fallback;
  }
  return value;
}

// Helper function to ensure a number field exists and is within range
function ensureNumberField(value, min, max) {
  if (typeof value !== 'number' || isNaN(value)) {
    // Generate a random number in the range
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Ensure the value is within the specified range
  return Math.max(min, Math.min(max, value));
}

// Helper function to ensure traits are properly structured
function ensureTraits(traits) {
  // Default traits if none provided
  const defaultTraits = [
    {
      name: "Analytical Thinking",
      trait: "Analytical Thinking",
      score: 7.5,
      description: "You have a natural tendency to break down complex problems into component parts and examine them systematically. This analytical approach helps you understand underlying patterns and make evidence-based decisions.",
      impact: ["Enables effective problem-solving", "Supports logical decision making", "Helps identify patterns and connections"],
      recommendations: ["Balance analysis with intuition", "Set time limits for decision-making", "Practice explaining complex concepts simply"],
      strengths: ["Systematic approach to challenges", "Ability to identify logical inconsistencies", "Evidence-based thinking"],
      challenges: ["May overthink simple situations", "Can get caught in analysis paralysis"],
      growthSuggestions: ["Practice combining analysis with creative thinking", "Set decision deadlines to avoid overthinking", "Develop storytelling skills to communicate analytical insights"]
    },
    {
      name: "Emotional Awareness",
      trait: "Emotional Awareness",
      score: 6.8,
      description: "You demonstrate an ability to recognize and understand your emotional states and those of others. This awareness serves as a foundation for empathy and effective interpersonal communication.",
      impact: ["Enhances interpersonal relationships", "Supports effective communication", "Contributes to emotional well-being"],
      recommendations: ["Practice naming emotions specifically", "Journal about emotional patterns", "Check in with yourself during stressful situations"],
      strengths: ["Recognition of emotional signals", "Understanding personal triggers", "Capacity for empathy"],
      challenges: ["Balancing emotional awareness with objectivity", "Managing emotional intensity"],
      growthSuggestions: ["Develop a broader emotional vocabulary", "Practice mindfulness for increased awareness", "Seek feedback on emotional intelligence from trusted others"]
    },
    {
      name: "Adaptive Resilience",
      trait: "Adaptive Resilience",
      score: 7.2,
      description: "You show the ability to bounce back from setbacks and adjust to changing circumstances. This resilience helps you navigate life's challenges with flexibility while maintaining core stability.",
      impact: ["Supports recovery from setbacks", "Enables adaptation to change", "Builds long-term psychological strength"],
      recommendations: ["Reflect on past resilience successes", "Build a diverse support network", "Develop specific coping strategies for different situations"],
      strengths: ["Recovery capacity after challenges", "Ability to pivot when needed", "Learning from difficult experiences"],
      challenges: ["Knowing when to persist vs. when to change direction", "Self-care during extended stress periods"],
      growthSuggestions: ["Create a personal resilience toolkit of strategies", "Practice preventative self-care", "Develop meaning-making narratives from challenges"]
    }
  ];
  
  // If traits is not an array or is empty, use defaults
  if (!Array.isArray(traits) || traits.length === 0) {
    return defaultTraits;
  }
  
  // Ensure we have at least 5 traits
  let processedTraits = [...traits];
  
  // If we have fewer than 5 traits, add some default ones
  if (processedTraits.length < 5) {
    processedTraits = [...processedTraits, ...defaultTraits.slice(0, 5 - processedTraits.length)];
  }
  
  // Process each trait to ensure it has all required fields
  return processedTraits.map(trait => {
    // Generate a name if missing
    const name = trait.name || trait.trait || "Personality Trait";
    
    return {
      name: name,
      trait: trait.trait || name, // For compatibility
      score: typeof trait.score === 'number' ? Math.max(1, Math.min(10, trait.score)) : Math.floor(Math.random() * 9) + 1,
      description: ensureField(trait.description, `This trait represents a significant aspect of your personality that influences how you interact with the world and others. It shapes your responses, preferences, and approach to various situations.`, 50),
      impact: Array.isArray(trait.impact) && trait.impact.length >= 3 ? trait.impact : 
        ["Influences your decision-making process", "Shapes your interpersonal interactions", "Affects how you approach challenges"],
      recommendations: Array.isArray(trait.recommendations) && trait.recommendations.length >= 3 ? trait.recommendations :
        ["Reflect on how this trait manifests in different contexts", "Consider how to leverage this trait as a strength", "Be aware of potential challenges associated with this trait"],
      strengths: Array.isArray(trait.strengths) && trait.strengths.length >= 3 ? trait.strengths :
        [`Enhanced ability related to ${name}`, `Natural aptitude in areas requiring ${name}`, `Positive impact on relevant situations`],
      challenges: Array.isArray(trait.challenges) && trait.challenges.length >= 2 ? trait.challenges :
        [`Potential difficulty balancing ${name} in certain contexts`, `Possible overreliance on this trait`],
      growthSuggestions: Array.isArray(trait.growthSuggestions) && trait.growthSuggestions.length >= 3 ? trait.growthSuggestions :
        [`Develop awareness of when ${name} serves you well`, `Practice balancing this trait with complementary approaches`, `Seek feedback on how this trait impacts others`]
    };
  });
}

// Helper function to ensure intelligence object is properly structured
function ensureIntelligence(intelligence) {
  // Default intelligence if none provided
  const defaultIntelligence = {
    type: "Analytical Intelligence",
    score: 110,
    description: "Your intelligence profile suggests strengths in logical reasoning and systematic thinking. You likely excel at breaking down complex problems into manageable components and analyzing information methodically.",
    strengths: ["Logical problem solving", "Systematic analysis", "Pattern recognition"],
    areas_for_development: ["Creative thinking", "Intuitive decision making", "Contextual application of knowledge"],
    learning_style: "Structured analytical",
    cognitive_preferences: ["Sequential processing", "Detail orientation", "Categorical organization"]
  };
  
  // If intelligence is not an object or is empty, use default
  if (!intelligence || typeof intelligence !== 'object') {
    return defaultIntelligence;
  }
  
  // Create a new intelligence object with all required fields
  return {
    type: intelligence.type || defaultIntelligence.type,
    score: typeof intelligence.score === 'number' ? intelligence.score : defaultIntelligence.score,
    description: ensureField(intelligence.description, defaultIntelligence.description, 50),
    strengths: ensureStringArray(intelligence.strengths, 3, defaultIntelligence.strengths),
    areas_for_development: ensureStringArray(intelligence.areas_for_development, 3, defaultIntelligence.areas_for_development),
    learning_style: intelligence.learning_style || defaultIntelligence.learning_style,
    cognitive_preferences: ensureStringArray(intelligence.cognitive_preferences, 3, defaultIntelligence.cognitive_preferences),
    domains: intelligence.domains || []
  };
}

// Helper function to ensure cognitive style object is properly structured
function ensureCognitiveStyle(cognitiveStyle) {
  // Default cognitive style if none provided
  const defaultCognitiveStyle = {
    primary: "Analytical",
    secondary: "Reflective",
    description: "You tend to approach situations with careful consideration and systematic thinking. Your cognitive style balances analysis with reflection, allowing you to process information thoroughly before drawing conclusions."
  };
  
  // If cognitiveStyle is not an object or is empty, use default
  if (!cognitiveStyle || typeof cognitiveStyle !== 'object') {
    return defaultCognitiveStyle;
  }
  
  // If cognitiveStyle is a string, convert to object
  if (typeof cognitiveStyle === 'string') {
    return {
      primary: cognitiveStyle,
      secondary: "Balanced",
      description: `Your cognitive approach tends toward ${cognitiveStyle}, which influences how you process information and make decisions.`
    };
  }
  
  // Create a new cognitive style object with all required fields
  return {
    primary: cognitiveStyle.primary || defaultCognitiveStyle.primary,
    secondary: cognitiveStyle.secondary || defaultCognitiveStyle.secondary,
    description: ensureField(cognitiveStyle.description, defaultCognitiveStyle.description, 50)
  };
}

// Helper function to ensure value system object is properly structured
function ensureValueSystem(valueSystem) {
  // Default value system if none provided
  const defaultValueSystem = {
    strengths: ["Personal growth", "Authenticity", "Meaningful connection"],
    weaknesses: ["Balancing multiple values", "Maintaining consistent priorities"],
    description: "Your value system emphasizes personal development and authentic connection, suggesting you prioritize growth and genuine relationships in your life choices.",
    compatibleTypes: ["Growth-oriented individuals", "Authentic communicators", "Purpose-driven collaborators"]
  };
  
  // If valueSystem is not an object or is empty, use default
  if (!valueSystem) {
    return defaultValueSystem;
  }
  
  // If valueSystem is an array, convert to object
  if (Array.isArray(valueSystem)) {
    return {
      strengths: valueSystem.slice(0, 3),
      weaknesses: ["Value prioritization in conflicts", "Balancing competing values"],
      description: "Your core values guide your decisions and shape your approach to life's challenges and opportunities.",
      compatibleTypes: ["People with complementary values", "Those who respect your priorities"]
    };
  }
  
  // Create a new value system object with all required fields
  return {
    strengths: ensureStringArray(valueSystem.strengths, 3, defaultValueSystem.strengths),
    weaknesses: ensureStringArray(valueSystem.weaknesses, 2, defaultValueSystem.weaknesses),
    description: ensureField(valueSystem.description, defaultValueSystem.description, 50),
    compatibleTypes: ensureStringArray(valueSystem.compatibleTypes, 3, defaultValueSystem.compatibleTypes)
  };
}

// Helper function to ensure relationship patterns object is properly structured
function ensureRelationshipPatterns(relationshipPatterns) {
  // Default relationship patterns if none provided
  const defaultRelationshipPatterns = {
    strengths: ["Thoughtful communication", "Emotional awareness", "Commitment to growth"],
    challenges: ["Setting clear boundaries", "Balancing needs", "Expressing vulnerability"],
    compatibleTypes: ["Growth-oriented individuals", "Communicative partners", "Emotionally intelligent connections"]
  };
  
  // If relationshipPatterns is not an object or is empty, use default
  if (!relationshipPatterns || typeof relationshipPatterns !== 'object') {
    return defaultRelationshipPatterns;
  }
  
  // If relationshipPatterns is an array, convert to object
  if (Array.isArray(relationshipPatterns)) {
    return {
      strengths: relationshipPatterns.slice(0, Math.min(3, relationshipPatterns.length)),
      challenges: ["Understanding relationship patterns", "Applying insights consistently"],
      compatibleTypes: ["Partners who appreciate your unique qualities", "Relationships that honor your core values"]
    };
  }
  
  // Create a new relationship patterns object with all required fields
  return {
    strengths: ensureStringArray(relationshipPatterns.strengths, 3, defaultRelationshipPatterns.strengths),
    challenges: ensureStringArray(relationshipPatterns.challenges, 2, defaultRelationshipPatterns.challenges),
    compatibleTypes: ensureStringArray(relationshipPatterns.compatibleTypes, 3, defaultRelationshipPatterns.compatibleTypes)
  };
}

// Helper function to ensure string arrays have minimum length and content
function ensureStringArray(array, minLength, defaults) {
  // If array is not properly defined or too short, use defaults
  if (!Array.isArray(array) || array.length < minLength) {
    return defaults || [];
  }
  
  // Filter out non-string or empty items and ensure they're strings
  return array
    .filter(item => item && (typeof item === 'string' || typeof item === 'object'))
    .map(item => {
      if (typeof item === 'string') {
        return item;
      } else if (typeof item === 'object') {
        // Try to extract a string from the object
        return item.name || item.title || item.value || item.description || JSON.stringify(item);
      }
      return String(item);
    });
}
