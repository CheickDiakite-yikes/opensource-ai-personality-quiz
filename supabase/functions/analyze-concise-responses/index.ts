
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
    
    // Get the request payload
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

    // Create a prompt for the AI analysis
    const seed = Math.floor(Math.random() * 10000); // Random seed for consistency in repeated runs
    const prompt = generateEnhancedAnalysisPrompt(responses, seed);
    console.log(`Generated prompt with ${prompt.length} characters, seed: ${seed}`);
    
    // Call OpenAI API with enhanced parameters
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using the more capable model for deeper analysis
        messages: [
          {
            role: "system",
            content: "You are an expert psychological profiler with deep expertise in cognitive psychology, personality theory, emotional intelligence, and human development. Your analyses demonstrate clinical precision while remaining accessible and actionable. You provide nuanced, evidence-based personality insights that avoid stereotypes or overgeneralizations. Return only valid JSON without any markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5, // Reduced temperature for more consistent results
        max_tokens: 4000,
      }),
    });

    // Parse the OpenAI API response
    const data = await response.json();
    console.log("OpenAI response received");
    
    if (!data.choices || data.choices.length === 0) {
      console.error("Invalid OpenAI API response:", data);
      throw new Error("Failed to generate analysis");
    }
    
    let analysisText = data.choices[0].message.content;
    
    try {
      // Clean the response text by removing any markdown code block indicators
      analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      console.log("Cleaned analysis text for parsing");
      
      // Parse the JSON response from OpenAI
      const analysisData = JSON.parse(analysisText);
      console.log("Successfully parsed analysis JSON");
      
      // Enhanced validation for new structure
      if (!analysisData.id || !analysisData.overview || 
          !analysisData.coreProfiling || !analysisData.traits || 
          !analysisData.cognitiveProfile || !analysisData.emotionalInsights || 
          !analysisData.interpersonalDynamics || !analysisData.growthPotential) {
        throw new Error("Analysis data incomplete or missing required sections");
      }
      
      // Add metadata and ensure valid user ID
      const finalAnalysis = {
        ...analysisData,
        userId: userId || analysisData.id,
        createdAt: new Date().toISOString()
      };
      
      // Only save to database if we have a valid user ID
      if (userId) {
        // Save to database
        const { error } = await supabaseAdmin
          .from('concise_analyses')
          .upsert({
            assessment_id: assessmentId,
            user_id: userId,
            analysis_data: finalAnalysis
          });
        
        if (error) {
          console.error("Error saving analysis to database:", error);
        } else {
          console.log("Analysis saved to database");
        }
      } else {
        console.log("No valid user ID provided, skipping database save");
      }
      
      return new Response(JSON.stringify(finalAnalysis), {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
      
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw response:", analysisText);
      throw new Error("Failed to parse analysis result");
    }
    
  } catch (error) {
    console.error("Error in analyze-concise-responses function:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Enhanced question weighting system for more nuanced analysis
const questionWeights: Record<string, number> = {
  // Core traits questions - highest weights as they define fundamental patterns
  "core-1": 1.5, // Approach to major life decisions - highly predictive
  "core-2": 1.3, // Response to unexpected change - reveals adaptability
  "core-3": 1.4, // Most energizing activities - shows core motivations
  "core-4": 1.2, // What matters most in success - reveals values
  "core-5": 1.5, // Self-perception - fundamental to identity

  // Emotional intelligence questions - moderate-high weights
  "emotional-1": 1.2, // Experience of strong emotions - emotional awareness
  "emotional-2": 1.3, // Predicting others' responses - empathy indicator
  "emotional-3": 1.1, // Response to others' difficult experiences
  "emotional-4": 1.0, // Behavior after conflict - recovery pattern
  "emotional-5": 1.2, // Handling emotions during crisis - regulation

  // Cognitive pattern questions - moderate weights
  "cognitive-1": 1.1, // Learning style preference
  "cognitive-2": 1.2, // Problem-solving approach - key cognitive indicator
  "cognitive-3": 1.3, // Decision-making process - highly relevant
  "cognitive-4": 0.9, // Project planning preference
  "cognitive-5": 1.0, // Response to criticism - growth mindset indicator

  // Social interaction questions - moderate weights
  "social-1": 1.1, // Role in group settings
  "social-2": 1.2, // Handling disagreement - conflict style
  "social-3": 0.9, // Approach to social boundaries
  "social-4": 1.0, // Priorities in close relationships
  "social-5": 1.1, // Response to others' problems - support style

  // Values questions - high weights for deeper meaning
  "values-1": 1.4, // Main driver of life decisions - core values
  "values-2": 1.3, // Source of fulfillment and purpose
  "values-3": 1.2, // Core values resonance
  "values-4": 1.0, // Meaningful recognition type
  "values-5": 1.3  // Future priorities - aspirational direction
};

// Helper function to generate the enhanced analysis prompt
function generateEnhancedAnalysisPrompt(responses: Record<string, string>, seed: number): string {
  // Convert responses to more readable format with enhanced descriptions
  const questionDescriptions: Record<string, string> = {
    "core-1": "Approach to major life decisions",
    "core-2": "Response to unexpected change",
    "core-3": "Most energizing activities",
    "core-4": "What matters most in success",
    "core-5": "Self-perception",
    "emotional-1": "Experience of strong emotions",
    "emotional-2": "Predicting others' emotional responses",
    "emotional-3": "Response to others' difficult experiences",
    "emotional-4": "Behavior after conflict",
    "emotional-5": "Handling emotions during crisis",
    "cognitive-1": "Learning style preference",
    "cognitive-2": "Problem-solving approach",
    "cognitive-3": "Decision-making process",
    "cognitive-4": "Project planning preference",
    "cognitive-5": "Response to criticism",
    "social-1": "Role in group settings",
    "social-2": "Handling disagreement",
    "social-3": "Approach to social boundaries",
    "social-4": "Priorities in close relationships",
    "social-5": "Response to others' problems",
    "values-1": "Main driver of life decisions",
    "values-2": "Source of fulfillment and purpose",
    "values-3": "Core values resonance",
    "values-4": "Meaningful recognition type",
    "values-5": "Future priorities"
  };

  const optionMappings: Record<string, Record<string, number>> = {
    "core-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "core-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "emotional-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "cognitive-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "social-5": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-1": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-2": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-3": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-4": { "a": 1, "b": 2, "c": 3, "d": 4 },
    "values-5": { "a": 1, "b": 2, "c": 3, "d": 4 }
  };
  
  // Format responses for the prompt with weights
  const formattedResponses = Object.entries(responses).map(([questionId, answer]) => {
    const questionDesc = questionDescriptions[questionId] || questionId;
    const optionNumber = optionMappings[questionId]?.[answer] || answer;
    const weight = questionWeights[questionId] || 1.0;
    return `${questionDesc}: Option ${optionNumber} (Weight: ${weight.toFixed(1)})`;
  }).join("\n");
  
  // Calculate category scores for pattern detection
  const categoryScores: Record<string, {total: number, count: number}> = {
    "core": {total: 0, count: 0},
    "emotional": {total: 0, count: 0},
    "cognitive": {total: 0, count: 0},
    "social": {total: 0, count: 0},
    "values": {total: 0, count: 0}
  };
  
  Object.entries(responses).forEach(([questionId, answer]) => {
    const category = questionId.split('-')[0];
    const optionNumber = optionMappings[questionId]?.[answer] || parseInt(answer);
    const weight = questionWeights[questionId] || 1.0;
    
    if (categoryScores[category]) {
      categoryScores[category].total += optionNumber * weight;
      categoryScores[category].count += weight;
    }
  });
  
  const categoryAverages = Object.entries(categoryScores).map(([category, {total, count}]) => {
    return `${category.charAt(0).toUpperCase() + category.slice(1)} average: ${count > 0 ? (total/count).toFixed(2) : 'N/A'}`;
  }).join(", ");

  return `
Analyze the following 25 personality assessment responses and create a comprehensive, evidence-based personality profile. These questions cover core traits, emotional intelligence, cognitive patterns, social dynamics, and values/motivations.

RESPONSE DATA:
${formattedResponses}

RESPONSE PATTERNS:
${categoryAverages}

INSTRUCTIONS:
Create a detailed personality analysis in pure JSON format (no markdown code blocks) with the following enhanced structure:

{
  "id": "${crypto.randomUUID()}",
  "userId": "system-generated",
  "overview": "A 2-3 paragraph overview of the individual's psychological profile, highlighting distinctive patterns, key strengths, potential blindspots, and unique personality dynamics. Focus on the interaction between traits rather than isolated characteristics.",
  "coreProfiling": {
    "primaryArchetype": "The dominant personality archetype (e.g., 'Analytical Strategist', 'Empathic Connector', 'Adaptive Problem-Solver', etc.)",
    "secondaryArchetype": "A secondary influence on their personality",
    "description": "A paragraph explaining how these archetypes manifest in their personality with specific behavioral examples",
    "compatibilityInsights": ["3-4 types of people they likely work well with", "2-3 types of people they might find challenging"]
  },
  "traits": [
    {
      "trait": "A specific personality trait (5-7 traits total)",
      "score": A number between 1-10 indicating strength of this trait,
      "description": "Brief description of how this trait manifests with specific behavioral examples",
      "strengths": ["3-4 strengths associated with this trait"],
      "challenges": ["2-3 challenges or growth areas associated with this trait"],
      "developmentStrategies": ["2 specific, actionable strategies to leverage or develop this trait"]
    }
  ],
  "cognitiveProfile": {
    "style": "A description of their cognitive/thinking style",
    "strengths": ["3-4 cognitive strengths"],
    "blindSpots": ["2-3 cognitive blind spots or challenges"],
    "description": "A paragraph explaining their cognitive patterns in more depth",
    "learningStyle": "Their preferred approach to learning new information",
    "decisionMakingProcess": "How they typically approach important decisions"
  },
  "emotionalInsights": {
    "awareness": "Description of their emotional self-awareness",
    "regulation": "Description of their emotional regulation approach",
    "empathy": A number between 1-10 indicating empathic capacity,
    "description": "A paragraph about their emotional landscape and patterns",
    "stressResponse": "How they typically respond under significant stress or pressure",
    "emotionalTriggersAndCoping": {
      "triggers": ["2-3 situations that might trigger emotional reactions"],
      "copingStrategies": ["2-3 effective coping strategies for this individual"]
    }
  },
  "interpersonalDynamics": {
    "communicationStyle": "Their primary communication style",
    "relationshipPattern": "Their typical approach to relationships",
    "conflictApproach": "Their typical approach to handling conflict",
    "socialNeeds": "Description of their social needs and boundaries",
    "leadershipStyle": "Their natural approach to leadership roles",
    "teamRole": "Their most effective role in collaborative settings"
  },
  "valueSystem": {
    "coreValues": ["3-5 fundamental values that guide their decisions"],
    "motivationSources": ["2-3 primary sources of motivation"],
    "meaningMakers": ["2-3 things that provide a sense of purpose"],
    "culturalConsiderations": "How their values might manifest across different cultural contexts"
  },
  "growthPotential": {
    "areasOfDevelopment": ["3-4 primary areas for growth and development"],
    "personalizedRecommendations": [
      {
        "area": "Name of development area",
        "why": "Brief explanation of why this matters for them",
        "action": "A specific, personalized action they can take",
        "resources": "Suggested resource (book, practice, etc.)"
      }
    ],
    "keyStrengthsToLeverage": ["3 key strengths they can leverage for growth"],
    "developmentTimeline": {
      "shortTerm": "Focus for next 30 days",
      "mediumTerm": "Focus for next 3-6 months",
      "longTerm": "Focus for ongoing development"
    }
  },
  "careerInsights": {
    "environmentFit": "Description of work environments where they're likely to thrive",
    "challengeAreas": "Types of work situations that might be more difficult",
    "roleAlignments": ["5-7 career fields or roles that might align well with their profile"],
    "workStyles": {
      "collaboration": "How they tend to collaborate with others",
      "autonomy": "Their need for independence and self-direction",
      "structure": "Their preference for structure vs. flexibility"
    }
  }
}

IMPORTANT:
- Use the weighted response patterns to identify genuine insights - avoid generic statements.
- Balance positive attributes with genuine growth areas - be honest but constructive.
- Make insights specific, actionable, and evidence-based from the response patterns.
- For any scores (trait scores, empathy score), use realistic values based on response patterns, not overly high values.
- Look for meaningful correlations between different response areas, e.g., how cognitive patterns influence emotional responses.
- Provide personalized, practical recommendations that acknowledge the individual's unique profile.
- Use the seed value ${seed} to ensure consistency if the analysis is regenerated.
- Return valid JSON without any markdown code block formatting (no \`\`\`json tags).
- Ensure all JSON is properly formatted with no errors.
`;
}
