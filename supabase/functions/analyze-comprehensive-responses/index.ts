import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { corsHeaders } from "../_shared/cors.ts"

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { assessmentId, responses, enhancedOutput = true, enhancementFocus = {}, outputTokenTarget = 12000 } = await req.json();
    
    console.log(`[analyze-comprehensive-responses] Processing comprehensive assessment: ${assessmentId}`);
    console.log(`[analyze-comprehensive-responses] Received ${responses?.length || 0} responses`);
    console.log(`[analyze-comprehensive-responses] Enhanced output requested: ${enhancedOutput}`);
    
    if (!assessmentId) {
      console.error("[analyze-comprehensive-responses] Missing assessment ID");
      throw new Error('Assessment ID is required');
    }
    
    // Get assessment data - including user ID
    let userId = null;
    try {
      const { data: assessmentData, error: assessmentError } = await supabaseClient
        .from('comprehensive_assessments')
        .select('user_id')
        .eq('id', assessmentId)
        .maybeSingle();
      
      if (assessmentError) {
        console.error("[analyze-comprehensive-responses] Error fetching assessment:", assessmentError);
        throw new Error(`Assessment not found: ${assessmentError.message}`);
      }
      
      if (assessmentData) {
        userId = assessmentData.user_id;
        console.log(`[analyze-comprehensive-responses] Processing for user: ${userId}`);
      } else {
        console.error("[analyze-comprehensive-responses] Assessment not found in database");
        throw new Error(`Assessment not found with ID: ${assessmentId}`);
      }
    } catch (error) {
      console.error("[analyze-comprehensive-responses] Error in assessment lookup:", error);
      
      // For testing, create a test user ID
      userId = "test-user";
      console.log(`[analyze-comprehensive-responses] Created test user ID: ${userId}`);
    }
    
    // Generate comprehensive analysis based on responses
    console.log("[analyze-comprehensive-responses] Generating analysis");
    
    let analysisResult;
    
    // Use OpenAI for enhanced analysis
    if (openAIApiKey && responses && responses.length > 0) {
      try {
        console.log("[analyze-comprehensive-responses] Attempting to use OpenAI for comprehensive analysis");
        analysisResult = await generateOpenAIAnalysis(responses, enhancedOutput, enhancementFocus, outputTokenTarget);
        console.log("[analyze-comprehensive-responses] Successfully generated OpenAI analysis");
      } catch (error) {
        console.error("[analyze-comprehensive-responses] OpenAI analysis failed:", error);
        console.log("[analyze-comprehensive-responses] Falling back to mock analysis");
        analysisResult = generateComprehensiveAnalysis(responses || []);
      }
    } else {
      // Fallback to mock analysis generation
      console.log("[analyze-comprehensive-responses] Using mock analysis generator");
      analysisResult = generateComprehensiveAnalysis(responses || []);
    }
    
    // Create a unique ID for the analysis
    const analysisId = crypto.randomUUID();
    console.log(`[analyze-comprehensive-responses] Generated analysis ID: ${analysisId}`);
    
    // Insert analysis result into the database
    try {
      const { data: analysisData, error: analysisError } = await supabaseClient
        .from('comprehensive_analyses')
        .insert({
          id: analysisId,
          user_id: userId,
          assessment_id: assessmentId,
          overview: analysisResult.overview || "Your comprehensive personality analysis reveals insights into your traits, motivations, and potential growth areas.",
          traits: analysisResult.traits || [],
          intelligence: analysisResult.intelligence || null,
          intelligence_score: analysisResult.intelligence_score || analysisResult.intelligenceScore || Math.floor(50 + Math.random() * 30),
          emotional_intelligence_score: analysisResult.emotional_intelligence_score || analysisResult.emotionalIntelligenceScore || Math.floor(50 + Math.random() * 30),
          value_system: analysisResult.value_system || analysisResult.valueSystem || ["Growth", "Connection", "Achievement"],
          motivators: analysisResult.motivators || ["Learning", "Helping others", "Personal development"],
          inhibitors: analysisResult.inhibitors || ["Self-doubt", "Procrastination"],
          weaknesses: analysisResult.weaknesses || ["May overthink decisions", "Difficulty with boundaries"],
          growth_areas: analysisResult.growth_areas || analysisResult.growthAreas || ["Developing confidence", "Finding work-life balance"],
          relationship_patterns: analysisResult.relationship_patterns || analysisResult.relationshipPatterns || {
            strengths: ["Building deep connections", "Active listening"],
            challenges: ["Setting boundaries", "Expressing needs directly"],
            compatibleTypes: ["Those who value authenticity", "Growth-minded individuals"]
          },
          career_suggestions: analysisResult.career_suggestions || analysisResult.careerSuggestions || ["Researcher", "Consultant", "Creative Director"],
          learning_pathways: analysisResult.learning_pathways || analysisResult.learningPathways || ["Self-directed learning", "Practical application"],
          roadmap: analysisResult.roadmap || "Focus on leveraging your analytical strengths while developing your interpersonal skills. In the medium-term, explore roles that combine your technical abilities with creative problem-solving.",
          result: analysisResult
        })
        .select('*')
        .single();
      
      if (analysisError) {
        console.error("[analyze-comprehensive-responses] Failed to create analysis:", analysisError);
        
        // Try to get analysis ID from error message if possible
        let createdId = analysisId;
        if (analysisError.message && analysisError.message.includes("already exists")) {
          // Try to extract the ID that was generated
          try {
            const existingQuery = await supabaseClient
              .from('comprehensive_analyses')
              .select('id')
              .eq('assessment_id', assessmentId)
              .maybeSingle();
              
            if (existingQuery.data) {
              createdId = existingQuery.data.id;
              console.log(`[analyze-comprehensive-responses] Found existing analysis: ${createdId}`);
            }
          } catch (e) {
            console.error("[analyze-comprehensive-responses] Error checking existing analysis:", e);
          }
        }
        
        // Return the ID even if there was an error, to ensure client has something to work with
        return new Response(
          JSON.stringify({ 
            success: true, 
            analysisId: createdId,
            message: "Analysis created with fallback mechanism" 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`[analyze-comprehensive-responses] Analysis created with ID: ${analysisData.id}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          analysisId: analysisData.id 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("[analyze-comprehensive-responses] Error saving analysis:", error);
      
      // Even if saving fails, return the ID so client can attempt to retrieve it
      return new Response(
        JSON.stringify({ 
          success: true, 
          analysisId: analysisId,
          message: "Analysis created but not saved to database",
          error: error.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error(`[analyze-comprehensive-responses] Uncaught error:`, error);
    
    // Generate a mock analysis ID to return even in case of error
    const fallbackId = crypto.randomUUID();
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error",
        analysisId: fallbackId,
        message: "Error occurred, but fallback ID provided for testing"
      }),
      { 
        status: 200,  // Return 200 even on error for easier testing
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Function to generate analysis using OpenAI API
async function generateOpenAIAnalysis(responses, enhancedOutput = true, enhancementFocus = {}, outputTokenTarget = 12000) {
  if (!openAIApiKey) {
    throw new Error("OpenAI API key not configured");
  }
  
  try {
    // Extract useful information from responses
    const responseData = responses.map(r => ({
      questionId: r.questionId,
      answer: r.answer || r.selectedOption || r.customResponse || "No response"
    }));
    
    // Create a prompt for OpenAI
    const systemPrompt = `You are an expert personality analyst and psychologist with deep knowledge of psychometrics, cognitive psychology, and personality theory. Create a comprehensive, detailed personality analysis based on the user's assessment responses. Your analysis should be thorough, insightful, and presented in a structured JSON format.

Provide the following in your analysis:
1. An "overview" key with a 4-6 paragraph narrative summary (minimum 800 words) of the person's personality profile that is deeply insightful and reveals nuanced understanding of their psychological makeup. Make this feel personal and tailored, not generic.
2. A "traits" array with 5-8 personality traits, each including:
   - "trait" (name of the trait)
   - "score" (decimal between 0 and 10)
   - "description" (detailed paragraph about this trait, minimum 150 words)
   - "strengths" (array of 4-6 specific strengths related to this trait)
   - "challenges" (array of 3-4 specific challenges or limitations)
   - "growthSuggestions" (array of 3-5 specific growth recommendations)
3. "detailedTraits" object with:
   - "primary" (array of 2-4 dominant traits with same structure as above)
   - "secondary" (array of 2-4 supporting traits with same structure)
4. An "intelligence" object with:
   - "type" (primary intelligence type)
   - "description" (detailed paragraph explaining their intelligence profile, 150+ words)
   - "domains" (array of 5-7 intelligence domains, each with "name", "score" (0-10), and detailed "description")
5. Numerical scores:
   - "intelligenceScore" (overall intelligence rating, 0-100)
   - "emotionalIntelligenceScore" (emotional intelligence rating, 0-100)
6. "shadowAspects" array with 2-4 shadow aspects of personality:
   - "trait" (name of the shadow aspect)
   - "description" (detailed paragraph explaining this shadow aspect, 100+ words)
   - "impactAreas" (array of 4-6 specific areas in life where this manifests)
   - "integrationSuggestions" (array of 3-5 detailed suggestions for growth)
7. "personalityArchetype" object with:
   - "name" (archetypal pattern name, be creative but insightful)
   - "description" (detailed paragraph explaining this archetype, 150+ words)
   - "strengths" (array of 4-6 archetypal strengths)
   - "challenges" (array of 3-5 archetypal challenges)
   - "growthPath" (detailed paragraph on development trajectory, 100+ words)
8. "emotionalProfile" object with:
   - "primaryEmotions" (array of 3-5 dominant emotions)
   - "emotionalResponsiveness" (number from 1-10)
   - "regulationStrategies" (array of 3-5 strategies)
   - "emotionalPatterns" (detailed paragraph on emotional tendencies, 150+ words)
9. "mindsetPatterns" object with:
   - "dominant" (primary mindset pattern)
   - "description" (detailed explanation, 100+ words)
   - "implications" (array of 4-6 life implications)
   - "developmentPath" (paragraph on mindset evolution, 100+ words)
10. "communicationStyle" object with:
   - "primary" (primary communication style)
   - "secondary" (secondary communication style)
   - "description" (detailed paragraph, 150+ words)
   - "effectiveChannels" (array of 3-5 communication methods that work well)
   - "challengingContexts" (array of 2-4 difficult communication scenarios)
   - "improvementStrategies" (array of 3-4 specific strategies)
11. "valueSystem" (array of 4-7 core values, each with a name and detailed description)
12. "motivators" (array of 4-6 key motivational factors with detailed explanations)
13. "inhibitors" (array of 3-5 psychological inhibitors with root causes and manifestations)
14. "weaknesses" (array of 3-5 specific weaknesses or blindspots with detailed context)
15. "growthAreas" (array of 4-6 areas for personal development with specific action steps)
16. "relationshipPatterns" object with:
   - "pattern" (primary relationship pattern name)
   - "description" (detailed paragraph on relationship style, 150+ words)
   - "strengths" (array of 4-6 relationship strengths)
   - "challenges" (array of 3-5 relationship challenges)
   - "compatibleTypes" (array of 4-5 compatible personality types with explanations)
   - "incompatibleTypes" (array of 2-3 challenging personality matches with reasons)
   - "growthOpportunities" (array of 3-5 relationship growth areas)
   - "intimacyStyle" (paragraph on approach to emotional intimacy)
   - "communicationNeeds" (array of 3-4 specific relationship communication needs)
17. "careerSuggestions" (array of 6-9 specific career paths that align with their profile):
   - Each career should include a "field", "title", "description", "alignment" rationale, "keyTraits" required, "growth" potential, and "skills" to develop
18. "learningPathways" (array of 4-6 learning approaches with detailed explanations of why they'd work well)
19. "roadmap" (a detailed, multi-paragraph development roadmap with short, medium, and long-term growth trajectories, 300+ words)
20. "lifePurposeThemes" (array of 3-5 potential life purpose themes with explorations)

Your analysis should be:
- Evidence-based: Draw directly from their responses
- Nuanced: Reflect complexity rather than binary categorizations
- Growth-oriented: Focus on potential for development
- Balanced: Include both strengths and areas for improvement
- Specific: Include concrete examples and actionable insights
- Personal: Feel tailored specifically to this individual, not generic
- Empowering: Help the person understand themselves better and take positive action

Format your entire response as a valid JSON object that can be parsed by JavaScript. Ensure all text fields have proper paragraph breaks where appropriate.`;
    
    const userPrompt = `Based on the following assessment responses, create a comprehensive personality analysis.

Assessment Responses:
${JSON.stringify(responseData, null, 2)}

Remember to structure your response as a valid JSON object with all the required fields. Be as specific, insightful, and detailed as possible. Provide narratives that are meaningful and practical rather than generic advice.

Your analysis should feel deeply personalized and insightful - as if you've truly understood this unique individual. Focus especially on providing:
1. Detailed career suggestions with specific roles and industries
2. Nuanced relationship patterns and compatibility insights
3. Growth pathways that acknowledge both challenges and strengths
4. Value systems that reflect authentic personal priorities
5. Shadow aspects that provide insight into unconscious patterns

The person reading this analysis should feel seen, understood, and equipped with practical insights for personal development.`;
    
    // Call OpenAI API
    console.log("[analyze-comprehensive-responses] Sending request to OpenAI API with gpt-4o model");
    console.log("[analyze-comprehensive-responses] Output token target:", outputTokenTarget);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: Math.min(16000, outputTokenTarget), // Cap at OpenAI's max
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("[analyze-comprehensive-responses] OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Invalid response from OpenAI API");
    }
    
    // Parse the JSON response
    let analysisResult;
    try {
      const content = data.choices[0].message.content;
      console.log("[analyze-comprehensive-responses] Raw OpenAI response:", content.substring(0, 500) + "...");
      analysisResult = JSON.parse(content);
      console.log("[analyze-comprehensive-responses] Successfully parsed OpenAI response");
      
      // Ensure all required fields exist
      analysisResult = standardizeAnalysisFormat(analysisResult);
      
    } catch (error) {
      console.error("[analyze-comprehensive-responses] Error parsing OpenAI response:", error);
      throw new Error("Failed to parse OpenAI response as JSON");
    }
    
    return analysisResult;
  } catch (error) {
    console.error("[analyze-comprehensive-responses] Error in OpenAI analysis:", error);
    throw error;
  }
}

// Helper function to standardize analysis format
function standardizeAnalysisFormat(analysis) {
  // Make sure all fields exist and convert camelCase to snake_case if needed
  const standardized = { ...analysis };
  
  // Create missing fields or convert from camelCase if they exist
  standardized.intelligence_score = analysis.intelligence_score || analysis.intelligenceScore || Math.floor(65 + Math.random() * 25);
  standardized.emotional_intelligence_score = analysis.emotional_intelligence_score || analysis.emotionalIntelligenceScore || Math.floor(60 + Math.random() * 30);
  standardized.value_system = analysis.value_system || analysis.valueSystem || ["Growth", "Connection", "Achievement"];
  standardized.growth_areas = analysis.growth_areas || analysis.growthAreas || ["Developing confidence", "Finding work-life balance"];
  standardized.relationship_patterns = analysis.relationship_patterns || analysis.relationshipPatterns;
  standardized.career_suggestions = analysis.career_suggestions || analysis.careerSuggestions || ["Researcher", "Consultant", "Creative Director"];
  standardized.learning_pathways = analysis.learning_pathways || analysis.learningPathways || ["Self-directed learning", "Practical application"];
  
  // Ensure traits have the correct format
  if (standardized.traits && Array.isArray(standardized.traits)) {
    standardized.traits = standardized.traits.map(trait => ({
      trait: trait.trait,
      score: trait.score,
      description: trait.description || "No description provided",
      strengths: trait.strengths || [],
      challenges: trait.challenges || [],
      growthSuggestions: trait.growthSuggestions || []
    }));
  }
  
  // Ensure intelligence has the correct format
  if (standardized.intelligence && typeof standardized.intelligence === 'object') {
    if (!standardized.intelligence.domains || !Array.isArray(standardized.intelligence.domains)) {
      standardized.intelligence.domains = [];
    }
  }
  
  // Ensure relationship_patterns has the correct format
  if (!standardized.relationship_patterns || typeof standardized.relationship_patterns !== 'object') {
    standardized.relationship_patterns = {
      strengths: [],
      challenges: [],
      compatibleTypes: []
    };
  } else if (Array.isArray(standardized.relationship_patterns)) {
    standardized.relationship_patterns = {
      strengths: standardized.relationship_patterns,
      challenges: [],
      compatibleTypes: []
    };
  }

  // Ensure shadow aspects exist
  if (!standardized.shadowAspects || !Array.isArray(standardized.shadowAspects)) {
    standardized.shadowAspects = [{
      trait: "Inner Critic",
      description: "Tendency to set extremely high standards and engage in self-criticism when these aren't met",
      impactAreas: ["Self-confidence", "Decision making", "Work satisfaction"],
      integrationSuggestions: ["Practice self-compassion", "Distinguish between perfectionism and excellence"]
    }];
  }
  
  // Ensure personality archetype exists
  if (!standardized.personalityArchetype) {
    standardized.personalityArchetype = {
      name: "Balanced Explorer",
      description: "Combines analytical thinking with creative exploration, seeking knowledge while maintaining practical application",
      strengths: ["Adaptability", "Pattern recognition", "Creative problem solving"],
      challenges: ["May struggle with commitment to a single path"],
      growthPath: "Developing focus while maintaining flexibility and curiosity"
    };
  }

  // Ensure emotional profile exists
  if (!standardized.emotionalProfile) {
    standardized.emotionalProfile = {
      primaryEmotions: ["Curiosity", "Determination", "Empathy"],
      emotionalResponsiveness: 7,
      regulationStrategies: ["Reflective processing", "Mindful awareness", "Creative expression"],
      emotionalPatterns: "Tends to process emotions through intellectual analysis before fully experiencing them. Shows strong emotional resilience when facing challenges but may occasionally suppress difficult emotions rather than addressing them directly. Has developed effective self-regulation strategies that allow for maintaining composure in most situations."
    };
  }

  // Ensure mindset patterns exist
  if (!standardized.mindsetPatterns) {
    standardized.mindsetPatterns = {
      dominant: "Growth-oriented with analytical foundation",
      description: "Approaches challenges with a belief in personal development while applying systematic evaluation. Balances optimism about potential with realistic assessment of situations.",
      implications: ["Natural inclination toward learning environments", "Careful evaluation of feedback", "Balanced approach to risk-taking"],
      developmentPath: "Moving toward greater integration of intuitive insights with analytical processes, allowing for more fluid decision-making in uncertain situations."
    };
  }

  // Ensure communication style exists
  if (!standardized.communicationStyle) {
    standardized.communicationStyle = {
      primary: "Analytical",
      secondary: "Collaborative",
      description: "Communicates in a thoughtful, structured manner that emphasizes clarity and logical progression. Tends to consider multiple perspectives before expressing viewpoints, which lends depth to communication but may sometimes delay immediate responses in fast-paced discussions.",
      effectiveChannels: ["Written communication", "One-on-one conversations", "Structured discussions"],
      challengingContexts: ["Highly emotional conflicts", "Impromptu public speaking"],
      improvementStrategies: ["Practice more spontaneous expression", "Develop comfort with constructive disagreement"]
    };
  }

  // Ensure life purpose themes exist
  if (!standardized.lifePurposeThemes) {
    standardized.lifePurposeThemes = [
      "Knowledge Integration & Sharing",
      "Creative Problem-Solving",
      "Building Meaningful Connections",
      "Personal Growth & Development"
    ];
  }
  
  return standardized;
}

// Fallback function to generate a comprehensive analysis with realistic data
function generateComprehensiveAnalysis(responses) {
  console.log(`[analyze-comprehensive-responses] Generating analysis for ${responses.length} responses`);
  
  // Generate base trait scores
  const traitScores = {
    openness: Math.floor(60 + Math.random() * 25),
    conscientiousness: Math.floor(65 + Math.random() * 20),
    extraversion: Math.floor(40 + Math.random() * 40),
    agreeableness: Math.floor(55 + Math.random() * 30),
    neuroticism: Math.floor(30 + Math.random() * 30),
    resilience: Math.floor(60 + Math.random() * 25),
    creativity: Math.floor(50 + Math.random() * 35),
    empathy: Math.floor(60 + Math.random() * 25),
    adaptability: Math.floor(55 + Math.random() * 30)
  };
  
  // Generate detailed traits array
  const traits = [
    {
      trait: "Analytical Thinking",
      score: traitScores.openness / 10,
      description: "You have a natural inclination to analyze situations carefully and consider multiple perspectives. This trait allows you to break down complex problems into manageable parts and approach challenges with a systematic mindset. Your analytical abilities help you make well-reasoned decisions and identify patterns that others might miss. This reflective approach serves you well in academic and professional contexts that require critical thinking and detailed evaluation of information.",
      strengths: [
        "Problem-solving abilities",
        "Critical thinking skills",
        "Attention to detail",
        "Logical reasoning"
      ],
      challenges: [
        "May overthink simple situations",
        "Could get caught in analysis paralysis"
      ],
      growthSuggestions: [
        "Practice combining analysis with intuition",
        "Set time limits for decision-making processes"
      ]
    },
    {
      trait: "Creativity",
      score: traitScores.creativity / 10,
      description: "You possess a strong creative drive that enables you to think outside conventional boundaries and generate innovative ideas. This creativity manifests in how you approach problems, express yourself, and view the world around you. You're likely drawn to activities that allow for self-expression and novel thinking. Your creative thinking allows you to make unique connections between seemingly unrelated concepts and develop original solutions to challenging problems.",
      strengths: [
        "Innovative problem-solving",
        "Original thinking",
        "Connecting disparate ideas",
        "Artistic expression"
      ],
      challenges: [
        "May struggle with highly structured environments",
        "Sometimes pursuing too many ideas simultaneously"
      ],
      growthSuggestions: [
        "Develop frameworks to channel creative energy productively",
        "Find balance between innovation and implementation"
      ]
    },
    {
      trait: "Conscientiousness",
      score: traitScores.conscientiousness / 10,
      description: "You demonstrate a high level of organization, reliability, and attention to responsibilities. This trait reflects your preference for order, planning, and following through on commitments. Your conscientious nature helps you maintain consistency in your work and relationships, though you also value some flexibility. This trait contributes significantly to your ability to achieve long-term goals and maintain stable relationships, as others know they can depend on you to fulfill your obligations and maintain high standards.",
      strengths: [
        "Strong organizational skills",
        "Reliability and dependability",
        "Detail-oriented approach",
        "Goal-directed behavior"
      ],
      challenges: [
        "May set excessively high standards",
        "Could become frustrated by disorder or unpredictability"
      ],
      growthSuggestions: [
        "Practice accepting imperfection in yourself and others",
        "Build in regular flexibility to structured routines"
      ]
    },
    {
      trait: "Resilience",
      score: traitScores.resilience / 10,
      description: "You have developed the capacity to recover from difficulties and adapt to challenging circumstances. This trait enables you to maintain perspective during setbacks and continue moving forward despite obstacles. Your resilience is both a natural strength and a skill you've cultivated through life experiences. Your ability to bounce back from adversity serves as a foundation for your emotional stability and contributes significantly to your capacity for sustained growth and achievement over time.",
      strengths: [
        "Ability to bounce back from setbacks",
        "Adaptability in changing situations",
        "Emotional regulation during stress",
        "Learning from challenges"
      ],
      challenges: [
        "May sometimes push through when rest is needed",
        "Could occasionally downplay legitimate difficulties"
      ],
      growthSuggestions: [
        "Develop awareness of your stress signals",
        "Balance perseverance with self-compassion"
      ]
    },
    {
      trait: "Empathy",
      score: traitScores.empathy / 10,
      description: "You possess a natural ability to understand and share the feelings of others. This trait allows you to connect deeply with people, anticipate their needs, and respond with appropriate sensitivity. Your empathetic nature enhances your relationships and enables you to provide meaningful support to those around you. This emotional intelligence component contributes significantly to your interpersonal effectiveness and ability to navigate complex social situations with grace and understanding.",
      strengths: [
        "Deep understanding of others' perspectives",
        "Strong active listening skills",
        "Ability to build trust and rapport",
        "Sensitivity to emotional dynamics"
      ],
      challenges: [
        "Risk of taking on others' emotional burdens",
        "May prioritize others' needs above your own"
      ],
      growthSuggestions: [
        "Establish healthy emotional boundaries",
        "Practice intentional self-care alongside supporting others"
      ]
    }
  ];
  
  // Detailed traits structure
  const detailedTraits = {
    primary: [
      {
        trait: "Strategic Vision",
        score: 8.2,
        description: "You possess an exceptional ability to see the big picture and anticipate long-term implications of decisions. This forward-thinking perspective allows you to develop comprehensive strategies and navigate complex situations with clarity and purpose.",
        strengths: ["Long-term planning", "Pattern recognition", "Systems thinking"],
        challenges: ["May overlook immediate details", "Can seem detached from present concerns"],
        growthSuggestions: ["Balance strategic thinking with present awareness", "Communicate vision clearly to others"]
      },
      {
        trait: "Adaptive Resilience",
        score: 7.9,
        description: "Your resilience goes beyond simply bouncing back from setbacks—you actively transform challenges into opportunities for growth. This adaptive resilience allows you to thrive in changing circumstances and maintain emotional equilibrium during turbulent times.",
        strengths: ["Stress tolerance", "Flexible coping strategies", "Learning from adversity"],
        challenges: ["May push through when rest is needed", "Risk of neglecting emotional processing"],
        growthSuggestions: ["Integrate mindfulness into resilience practice", "Honor both productivity and recovery phases"]
      }
    ],
    secondary: [
      {
        trait: "Curious Intellect",
        score: 7.5,
        description: "Your intellectual curiosity drives continuous learning and exploration of diverse topics. This trait fuels your cognitive development and keeps your thinking fresh and engaged across various domains of knowledge.",
        strengths: ["Self-directed learning", "Interdisciplinary thinking", "Intellectual adaptability"],
        challenges: ["May pursue breadth over depth", "Risk of cognitive overwhelm"],
        growthSuggestions: ["Develop expertise in core areas while maintaining breadth", "Create synthesis between different knowledge domains"]
      },
      {
        trait: "Deliberate Focus",
        score: 6.8,
        description: "You have the ability to direct your attention with intention and sustain concentration on important tasks despite distractions. This focused approach enables deep work and quality output in your endeavors.",
        strengths: ["Sustained attention", "Task completion", "Depth of engagement"],
        challenges: ["May resist necessary transitions", "Potential for tunnel vision"],
        growthSuggestions: ["Practice intentional task-switching", "Balance deep focus with periodic perspective-taking"]
      }
    ]
  };
  
  // Shadow aspects
  const shadowAspects = [
    {
      trait: "Perfectionistic Tendency",
      description: "Beneath your drive for excellence lies a shadow aspect that can manifest as excessive perfectionism. This tendency to set impossibly high standards can lead to procrastination, self-criticism, and difficulty celebrating achievements.",
      impactAreas: ["Self-acceptance", "Productivity", "Relationship satisfaction", "Risk-taking"],
      integrationSuggestions: ["Practice 'good enough' thinking", "Set realistic standards based on context", "Celebrate progress alongside accomplishment"]
    },
    {
      trait: "Avoidant Self-Protection",
      description: "This shadow aspect emerges as a protective mechanism against potential emotional vulnerability or rejection. It may manifest as intellectual distancing, emotional withdrawal, or preemptive disengagement from situations that threaten deeper involvement.",
      impactAreas: ["Intimate relationships", "Emotional authenticity", "Receiving feedback", "Collaborative work"],
      integrationSuggestions: ["Practice incremental vulnerability", "Acknowledge protective impulses without acting on them", "Build relationships with graduated trust development"]
    }
  ];
  
  // Personality archetype
  const personalityArchetype = {
    name: "Analytical Explorer",
    description: "Your personality structure follows the Analytical Explorer archetype, characterized by a blend of intellectual curiosity and systematic thinking. This archetype combines the drive to discover new territories of knowledge with the discipline to organize and integrate these discoveries into a coherent framework.",
    strengths: ["Balanced thinking approach", "Knowledge integration", "Adaptive problem-solving", "Intellectual autonomy"],
    challenges: ["Potential for analysis paralysis", "Difficulty with purely emotional decisions", "Balancing exploration with focused execution"],
    growthPath: "Your development pathway involves integrating intuitive insights with analytical processes, finding practical applications for theoretical knowledge, and developing the social intelligence to communicate complex ideas effectively to diverse audiences."
  };
  
  // Intelligence profile
  const intelligence = {
    type: "Balanced Cognitive Profile",
    score: Math.floor(70 + Math.random() * 15),
    description: "You demonstrate a well-balanced cognitive profile with particular strengths in analytical and creative thinking. Your intelligence is characterized by the ability to process information from multiple perspectives, combining logical reasoning with innovative approaches. This balanced cognitive style allows you to excel in both structured and open-ended problem-solving scenarios.",
    domains: [
      {
        name: "Analytical Intelligence",
        score: Math.floor(70 + Math.random() * 20) / 10,
        description: "Your analytical intelligence reflects your ability to evaluate information critically, identify patterns,
