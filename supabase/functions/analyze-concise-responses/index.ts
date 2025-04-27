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

    // Enhanced seed mechanism for consistent yet personalized results
    const seed = Math.floor(Math.random() * 10000);
    console.log(`Using seed: ${seed} for analysis generation`);

    // Enhanced prompt with strict JSON formatting instructions
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using more capable model for nuanced analysis
        messages: [
          {
            role: "system",
            content: `You are an expert psychological profiler specializing in identifying UNIQUE and DISTINCTIVE personality patterns. Your analyses are deeply personalized, evidence-based, and focused on what makes each individual special. You excel at:
            1. Identifying unexpected trait combinations
            2. Spotting meaningful contradictions in responses
            3. Recognizing rare personality patterns
            4. Creating highly specific, personalized insights
            
            CRITICAL: Return ONLY valid JSON without any markdown formatting or code blocks. Every field must be properly quoted and formatted.`
          },
          {
            role: "user",
            content: generateEnhancedAnalysisPrompt(responses, seed)
          }
        ],
        temperature: 0.6, // Balanced between creativity and consistency
        frequency_penalty: 0.3,
        presence_penalty: 0.2,
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
      
      // Clean the response text
      analysisText = analysisText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/\\"/g, '"')
        .replace(/\t/g, ' ')
        .trim();
      
      // Parse and validate the JSON structure
      analysisData = JSON.parse(analysisText);
      
      // Validate required fields
      const requiredFields = [
        'id', 'overview', 'uniquenessMarkers', 'coreProfiling',
        'traits', 'cognitiveProfile', 'emotionalInsights',
        'interpersonalDynamics', 'growthPotential'
      ];
      
      const missingFields = requiredFields.filter(field => !analysisData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Analysis data missing required fields: ${missingFields.join(', ')}`);
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

// Enhanced dynamic question weighting system
const getQuestionWeight = (questionId: string, allResponses: Record<string, string>): number => {
  // Base weights from question importance
  const baseWeights: Record<string, number> = {
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

  // Get base weight or default to 1.0
  const baseWeight = baseWeights[questionId] || 1.0;
  
  // DYNAMIC WEIGHT ADJUSTMENT: Check for unusual response patterns
  
  // 1. Check for outlier responses compared to the category average
  const category = questionId.split('-')[0];
  const categoryResponses = Object.entries(allResponses)
    .filter(([qId]) => qId.startsWith(category + '-'))
    .map(([_, answer]) => answer);
  
  // Calculate if this response is different from other responses in the same category
  const isOutlier = categoryResponses.filter(r => r === allResponses[questionId]).length <= 1;
  
  // 2. Check for contrasting responses across categories (cognitive vs emotional)
  let hasContrastingPatterns = false;
  
  if (category === 'cognitive' || category === 'emotional') {
    const otherCategory = category === 'cognitive' ? 'emotional' : 'cognitive';
    const thisResponse = allResponses[questionId];
    const otherCategoryResponses = Object.entries(allResponses)
      .filter(([qId]) => qId.startsWith(otherCategory + '-'))
      .map(([_, answer]) => answer);
      
    // Simple check: if this response is notably different from other category responses
    if (otherCategoryResponses.length > 0) {
      const differentResponses = otherCategoryResponses.filter(r => r !== thisResponse).length;
      hasContrastingPatterns = differentResponses >= otherCategoryResponses.length / 2;
    }
  }
  
  // 3. Add weight for potentially insightful combinations
  let insightWeight = 1.0;
  
  // Example: Decision making style (cognitive-3) combined with emotional regulation (emotional-5)
  // can reveal important patterns about how the person handles stress
  if ((questionId === 'cognitive-3' && allResponses['emotional-5']) || 
      (questionId === 'emotional-5' && allResponses['cognitive-3'])) {
    insightWeight = 1.2;
  }
  
  // Example: Core values (values-3) combined with social behavior (social-4)
  // can reveal authenticity vs social adaptation patterns
  if ((questionId === 'values-3' && allResponses['social-4']) || 
      (questionId === 'social-4' && allResponses['values-3'])) {
    insightWeight = 1.15;
  }
  
  // Combine all factors for final weight
  let finalWeight = baseWeight;
  
  if (isOutlier) finalWeight *= 1.3; // Increase weight for outlier responses
  if (hasContrastingPatterns) finalWeight *= 1.2; // Increase for contrasting patterns
  finalWeight *= insightWeight; // Apply additional insight weight
  
  return Math.round(finalWeight * 100) / 100; // Round to 2 decimal places
};

// Enhanced question descriptions for better context
const getQuestionDescription = (questionId: string): string => {
  const questionDescriptions: Record<string, string> = {
    "core-1": "Approach to major life decisions and change",
    "core-2": "Response pattern to unexpected challenges",
    "core-3": "Sources of energy and engagement",
    "core-4": "Core values in measuring success and achievement",
    "core-5": "Self-perception and identity formation",
    "emotional-1": "Emotional awareness and processing style",
    "emotional-2": "Empathic accuracy and perspective-taking",
    "emotional-3": "Emotional support approach with others",
    "emotional-4": "Conflict resolution and emotional recovery",
    "emotional-5": "Emotional regulation in crisis situations",
    "cognitive-1": "Information processing and learning preferences",
    "cognitive-2": "Problem-solving style and approach",
    "cognitive-3": "Decision-making framework and process",
    "cognitive-4": "Planning and organization tendencies",
    "cognitive-5": "Response to feedback and criticism",
    "social-1": "Social positioning and group dynamics",
    "social-2": "Conflict management in social settings",
    "social-3": "Boundary-setting in relationships",
    "social-4": "Priority framework in close relationships",
    "social-5": "Helping behavior and support style",
    "values-1": "Foundational decision-making drivers",
    "values-2": "Sources of meaning and fulfillment",
    "values-3": "Core value system architecture",
    "values-4": "Recognition and validation needs",
    "values-5": "Future-oriented goals and aspirations"
  };
  
  return questionDescriptions[questionId] || questionId;
};

function generateEnhancedAnalysisPrompt(responses: Record<string, string>, seed: number): string {
  // Format responses with enhanced weights and descriptions
  const formattedResponses = Object.entries(responses).map(([questionId, answer]) => {
    const questionDesc = getQuestionDescription(questionId);
    const dynamicWeight = getQuestionWeight(questionId, responses);
    return `${questionDesc}: ${answer} (Weight: ${dynamicWeight.toFixed(1)})`;
  }).join("\n");
  
  return `
Create a HIGHLY PERSONALIZED psychological profile that emphasizes what makes this individual UNIQUE and DISTINCTIVE. Focus on identifying unexpected patterns, meaningful contradictions, and rare trait combinations in their responses.

RESPONSE DATA:
${formattedResponses}

CRITICAL INSTRUCTIONS:
1. Focus on what makes this person UNIQUE - avoid generic statements
2. Identify unexpected combinations of traits
3. Highlight meaningful contradictions in their responses
4. Create specific, evidence-based insights
5. Use the seed value ${seed} for consistency
6. Return PURE JSON without markdown formatting

Required JSON Structure:
{
  "id": "UUID string",
  "overview": "2-3 paragraphs highlighting UNIQUE traits",
  "uniquenessMarkers": ["3-5 specific traits/patterns that make this person distinctive"],
  "coreProfiling": {
    "primaryArchetype": "Unique archetype name",
    "secondaryArchetype": "Complementary archetype",
    "description": "How these combine uniquely",
    "compatibilityInsights": ["Compatible types", "Challenging types"]
  },
  "traits": [{
    "trait": "Specific trait name",
    "score": number (1-10),
    "description": "How this trait manifests uniquely",
    "strengths": ["3-4 specific strengths"],
    "challenges": ["2-3 specific challenges"],
    "developmentStrategies": ["2-3 personalized strategies"]
  }],
  "cognitiveProfile": {
    "style": "Description of their cognitive style highlighting unique aspects",
    "strengths": ["3-4 cognitive strengths with specific examples"],
    "blindSpots": ["2-3 cognitive blind spots with specific examples"],
    "description": "Paragraph explaining their cognitive patterns with emphasis on distinctive elements",
    "learningStyle": "Preferred learning approach with personalized examples",
    "decisionMakingProcess": "Approach to important decisions with personalized examples"
  },
  "emotionalInsights": {
    "awareness": "Description of emotional self-awareness with personalized examples",
    "regulation": "Description of emotional regulation approach with personalized examples",
    "empathy": number (1-10) indicating empathic capacity,
    "description": "Paragraph about their emotional landscape emphasizing distinctive patterns",
    "stressResponse": "Typical response under stress with personalized examples",
    "emotionalTriggersAndCoping": {
      "triggers": ["2-3 situations that trigger emotional reactions"],
      "copingStrategies": ["2-3 effective coping strategies"]
    }
  },
  "interpersonalDynamics": {
    "communicationStyle": "Primary communication style with personalized examples",
    "relationshipPattern": "Typical approach to relationships with personalized examples",
    "conflictApproach": "Typical approach to handling conflict with personalized examples",
    "socialNeeds": "Description of social needs with personalized examples",
    "leadershipStyle": "Natural approach to leadership roles with personalized examples",
    "teamRole": "Most effective role in collaborative settings with personalized examples"
  },
  "valueSystem": {
    "coreValues": ["3-5 fundamental values that guide decisions"],
    "motivationSources": ["2-3 primary sources of motivation"],
    "meaningMakers": ["2-3 things that provide a sense of purpose"],
    "culturalConsiderations": "How values might manifest across different cultural contexts"
  },
  "growthPotential": {
    "areasOfDevelopment": ["3-4 specific areas for growth"],
    "personalizedRecommendations": [{
      "area": "Name of development area",
      "why": "Brief explanation of why this matters",
      "action": "Specific, personalized action",
      "resources": "Suggested resource tailored to them"
    }],
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
    "roleAlignments": ["5-7 specific career fields or roles that might align well"],
    "workStyles": {
      "collaboration": "How they tend to collaborate with others",
      "autonomy": "Their need for independence and self-direction",
      "structure": "Their preference for structure vs. flexibility"
    }
  }
}

IMPORTANT:
- Ensure ALL JSON fields are properly quoted
- Use double quotes for ALL strings
- No trailing commas
- No comments or markup
- Validate JSON structure before returning
`;
}
