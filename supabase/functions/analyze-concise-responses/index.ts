
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
            content: "You are an expert psychological profiler with deep expertise in cognitive psychology, personality theory, emotional intelligence, and human development. Your analyses are insightful, nuanced, and personally meaningful. You excel at identifying unique combinations of traits and patterns that make each individual distinctive. Focus on creating highly personalized, evidence-based insights that avoid stereotypes and demonstrate deep understanding of the complexities of human personality. Return only valid JSON without any markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7, // Increased temperature for more creative and diverse outputs
        frequency_penalty: 0.3, // Added to reduce repetition in language
        presence_penalty: 0.2, // Added to encourage exploration of different topics/traits
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

// Helper function to generate the enhanced analysis prompt
function generateEnhancedAnalysisPrompt(responses: Record<string, string>, seed: number): string {
  // Convert responses to more readable format with enhanced descriptions
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
  
  // Format responses with enhanced weights and descriptions
  const formattedResponses = Object.entries(responses).map(([questionId, answer]) => {
    const questionDesc = getQuestionDescription(questionId);
    const optionNumber = optionMappings[questionId]?.[answer] || answer;
    const dynamicWeight = getQuestionWeight(questionId, responses);
    return `${questionDesc}: Option ${optionNumber} (Weight: ${dynamicWeight.toFixed(1)})`;
  }).join("\n");
  
  // Identify pattern connections and contradictions
  interface CategoryScore {
    total: number;
    count: number;
    responses: number[];
  }
  
  // Calculate category scores for pattern detection
  const categoryScores: Record<string, CategoryScore> = {
    "core": {total: 0, count: 0, responses: []},
    "emotional": {total: 0, count: 0, responses: []},
    "cognitive": {total: 0, count: 0, responses: []},
    "social": {total: 0, count: 0, responses: []},
    "values": {total: 0, count: 0, responses: []}
  };
  
  Object.entries(responses).forEach(([questionId, answer]) => {
    const category = questionId.split('-')[0];
    const optionNumber = optionMappings[questionId]?.[answer] || parseInt(answer);
    const weight = getQuestionWeight(questionId, responses);
    
    if (categoryScores[category]) {
      categoryScores[category].total += optionNumber * weight;
      categoryScores[category].count += weight;
      categoryScores[category].responses.push(optionNumber);
    }
  });

  // Find unusual patterns
  const patternFindings: string[] = [];
  
  // Look for contradictions within categories
  Object.entries(categoryScores).forEach(([category, data]) => {
    if (data.responses.length < 2) return;
    
    // Check for high variance in responses (contradictory answers in same category)
    const mean = data.responses.reduce((sum, val) => sum + val, 0) / data.responses.length;
    const variance = data.responses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.responses.length;
    
    if (variance > 1.2) {
      patternFindings.push(`High variance in ${category} responses (${variance.toFixed(2)}) suggests complex or potentially contradictory patterns`);
    }
  });
  
  // Cross-category comparisons for interesting combinations
  if (categoryScores.cognitive.count > 0 && categoryScores.emotional.count > 0) {
    const cognitiveAvg = categoryScores.cognitive.total / categoryScores.cognitive.count;
    const emotionalAvg = categoryScores.emotional.total / categoryScores.emotional.count;
    
    const diff = Math.abs(cognitiveAvg - emotionalAvg);
    if (diff > 1.0) {
      patternFindings.push(`Notable difference (${diff.toFixed(2)}) between cognitive and emotional domains may indicate distinctive cognitive-emotional processing style`);
    }
  }

  if (categoryScores.core.count > 0 && categoryScores.values.count > 0) {
    const coreAvg = categoryScores.core.total / categoryScores.core.count;
    const valuesAvg = categoryScores.values.total / categoryScores.values.count;
    
    const diff = Math.abs(coreAvg - valuesAvg);
    if (diff > 1.0) {
      patternFindings.push(`Significant difference (${diff.toFixed(2)}) between core traits and values systems may suggest evolving or aspirational identity`);
    }
  }
  
  // Format category averages for more context
  const categoryAverages = Object.entries(categoryScores).map(([category, {total, count}]) => {
    return `${category.charAt(0).toUpperCase() + category.slice(1)} average: ${count > 0 ? (total/count).toFixed(2) : 'N/A'}`;
  }).join(", ");
  
  // Add patterns found
  const patternAnalysis = patternFindings.length > 0 
    ? "Distinctive patterns detected:\n" + patternFindings.join("\n")
    : "No strong distinctive patterns detected in response distribution";
  
  return `
Analyze the following 25 personality assessment responses and create a HIGHLY PERSONALIZED, evidence-based personality profile that highlights what makes this individual UNIQUE and DISTINCTIVE. These questions cover core traits, emotional intelligence, cognitive patterns, social dynamics, and values/motivations.

RESPONSE DATA:
${formattedResponses}

RESPONSE PATTERNS:
${categoryAverages}

PATTERN ANALYSIS:
${patternAnalysis}

INSTRUCTIONS:
Create a detailed personality analysis in pure JSON format (no markdown code blocks) with the following enhanced structure. Focus on UNIQUENESS and DISTINCT PERSONALITY ELEMENTS throughout the analysis:

{
  "id": "${crypto.randomUUID()}",
  "userId": "system-generated",
  "overview": "A 2-3 paragraph overview of the individual's psychological profile that highlights what makes them UNIQUE. Identify distinctive patterns, unexpected trait combinations, and particularly notable aspects of their personality. Focus on what differentiates this person rather than general statements.",
  "uniquenessMarkers": [
    "3-5 specific traits, patterns, or characteristics that make this person distinctive",
    "Focus on unexpected combinations and contradictions that reveal complex personality architecture"
  ],
  "coreProfiling": {
    "primaryArchetype": "A distinctive and specific archetype that reflects their unique pattern - avoid generic terms like 'Analytical Strategist' - instead use more specific descriptors like 'Adaptive Systems Architect' or 'Empathic Problem Detective'",
    "secondaryArchetype": "A complementary or contrasting influence specific to this individual",
    "description": "A paragraph explaining how these archetypes combine in a UNIQUE way for this person with specific behavioral examples",
    "compatibilityInsights": ["3-4 types of people they likely work well with", "2-3 types of people they might find challenging"]
  },
  "traits": [
    {
      "trait": "A specific personality trait (5-7 traits total)",
      "score": A number between 1-10 indicating strength of this trait,
      "description": "Brief description of how this trait manifests in UNIQUE ways with specific behavioral examples",
      "strengths": ["3-4 strengths associated with this trait"],
      "challenges": ["2-3 challenges or growth areas associated with this trait"],
      "developmentStrategies": ["2 specific, actionable strategies tailored to leverage or develop this trait"]
    }
  ],
  "cognitiveProfile": {
    "style": "A description of their cognitive/thinking style that highlights UNIQUE aspects",
    "strengths": ["3-4 cognitive strengths with specific examples"],
    "blindSpots": ["2-3 cognitive blind spots or challenges with specific examples"],
    "description": "A paragraph explaining their cognitive patterns with emphasis on DISTINCTIVE elements",
    "learningStyle": "Their preferred approach to learning new information with personalized examples",
    "decisionMakingProcess": "How they typically approach important decisions with personalized examples"
  },
  "emotionalInsights": {
    "awareness": "Description of their emotional self-awareness with personalized examples",
    "regulation": "Description of their emotional regulation approach with personalized examples",
    "empathy": A number between 1-10 indicating empathic capacity,
    "description": "A paragraph about their emotional landscape emphasizing DISTINCTIVE patterns",
    "stressResponse": "How they typically respond under significant stress with personalized examples",
    "emotionalTriggersAndCoping": {
      "triggers": ["2-3 situations that might trigger emotional reactions for this specific individual"],
      "copingStrategies": ["2-3 effective coping strategies tailored for this individual"]
    }
  },
  "interpersonalDynamics": {
    "communicationStyle": "Their primary communication style with personalized examples",
    "relationshipPattern": "Their typical approach to relationships with personalized examples",
    "conflictApproach": "Their typical approach to handling conflict with personalized examples",
    "socialNeeds": "Description of their social needs with personalized examples",
    "leadershipStyle": "Their natural approach to leadership roles with personalized examples",
    "teamRole": "Their most effective role in collaborative settings with personalized examples"
  },
  "valueSystem": {
    "coreValues": ["3-5 fundamental values that guide their decisions"],
    "motivationSources": ["2-3 primary sources of motivation specific to this individual"],
    "meaningMakers": ["2-3 things that provide a sense of purpose for this specific individual"],
    "culturalConsiderations": "How their values might manifest across different cultural contexts"
  },
  "growthPotential": {
    "areasOfDevelopment": ["3-4 SPECIFIC primary areas for growth and development"],
    "personalizedRecommendations": [
      {
        "area": "Name of development area specific to this individual",
        "why": "Brief explanation of why this matters for them specifically",
        "action": "A specific, personalized action they can take",
        "resources": "Suggested resource (book, practice, etc.) tailored to them"
      }
    ],
    "keyStrengthsToLeverage": ["3 key strengths they can leverage for growth"],
    "developmentTimeline": {
      "shortTerm": "Focus for next 30 days specific to them",
      "mediumTerm": "Focus for next 3-6 months specific to them",
      "longTerm": "Focus for ongoing development specific to them"
    }
  },
  "careerInsights": {
    "environmentFit": "Description of work environments where they're likely to thrive with specific examples",
    "challengeAreas": "Types of work situations that might be more difficult with specific examples",
    "roleAlignments": ["5-7 specific career fields or roles that might align well with their profile"],
    "workStyles": {
      "collaboration": "How they tend to collaborate with others",
      "autonomy": "Their need for independence and self-direction",
      "structure": "Their preference for structure vs. flexibility"
    }
  }
}

IMPORTANT:
- Create a TRULY UNIQUE profile for this individual - avoid generic statements at all costs
- Highlight DISTINCTIVE combinations of traits that make this person different from others
- Identify any paradoxical or contradictory elements that add complexity and depth to their profile
- Focus on SPECIFIC behaviors and examples rather than generic descriptions
- For any scores (trait scores, empathy score), use realistic values based on response patterns
- Look for meaningful correlations between different response areas
- Provide personalized, practical recommendations that acknowledge their unique profile
- Use the seed value ${seed} to ensure consistency if the analysis is regenerated
- Return valid JSON without any markdown code block formatting (no \`\`\`json tags)
- Ensure all JSON is properly formatted with no errors
`;
}

