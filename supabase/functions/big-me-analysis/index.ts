import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser compatibility
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface AnalysisRequest {
  responses: Array<{
    questionId: string;
    selectedOption?: string;
    customResponse?: string;
    category: string;
  }>;
  userId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required");
    }

    const { responses, userId } = await req.json() as AnalysisRequest;
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      throw new Error("Valid responses are required for analysis");
    }
    
    console.log(`Received ${responses.length} responses for analysis`);

    // Prepare the analysis prompt with improved formatting
    const prompt = generatePrompt(responses);
    
    // Call OpenAI API with strict error handling
    console.log("Calling OpenAI API with GPT-4o model...");
    
    const analysisResult = await callOpenAI(prompt);
    console.log("OpenAI API call completed successfully");

    // If we have a userId, store the results in Supabase
    if (userId) {
      await storeAnalysisResults(userId, analysisResult, responses);
    }
    
    // Return the analysis result
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in big-me-analysis function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred during analysis",
        status: "error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function generatePrompt(responses: AnalysisRequest["responses"]) {
  // Group responses by category with improved formatting
  const responsesByCategory = responses.reduce((acc, response) => {
    if (!acc[response.category]) {
      acc[response.category] = [];
    }
    acc[response.category].push(response);
    return acc;
  }, {} as Record<string, typeof responses>);
  
  // Format the responses for the prompt with more contextual information
  const formattedResponses = Object.entries(responsesByCategory).map(([category, responses]) => {
    const categoryResponses = responses.map(r => {
      const responseText = r.selectedOption || r.customResponse || "No response";
      return `Question ID: ${r.questionId}, Response: "${responseText}"`;
    }).join("\n");
    
    return `## Category: ${category} (${responses.length} responses)\n${categoryResponses}`;
  }).join("\n\n");
  
  return `
Analyze the following personality quiz responses and provide a comprehensive personality analysis.

# Quiz Responses:
${formattedResponses}

Create an extremely detailed, in-depth, and nuanced personality profile based on these responses, focusing on personality traits, strengths, weaknesses, growth areas, and career opportunities.

VERY IMPORTANT: You MUST respond in valid JSON format ONLY with NO ADDITIONAL TEXT outside the JSON structure. Your entire response must be valid JSON. ALL ARRAYS MUST have AT LEAST 3 items each.

Provide the analysis in JSON format according to the following schema:

{
  "cognitivePatterning": {
    "decisionMaking": "Detailed analysis of decision-making approach that reflects the individual's unique patterns and preferences", 
    "learningStyle": "In-depth description of learning preferences and patterns with specific examples and contexts where this style is most effective",
    "attention": "Analysis of attention patterns and focus tendencies, including how they process information and prioritize",
    "problemSolvingApproach": "Comprehensive breakdown of problem-solving style with examples of how they typically tackle challenges",
    "informationProcessing": "Details about how information is processed and integrated, including their typical mental frameworks",
    "analyticalTendencies": "Analysis of analytical strengths and approaches, highlighting their distinctive reasoning patterns"
  },
  "emotionalArchitecture": {
    "emotionalAwareness": "Deep dive into emotional self-awareness, exploring how they recognize and name their emotions",
    "regulationStyle": "Analysis of emotional regulation patterns, including both strengths and challenges in managing feelings",
    "empathicCapacity": "Assessment of empathy and emotional understanding of others, including how they connect with others' experiences",
    "emotionalComplexity": "Exploration of emotional depth and nuance, including their capacity for mixed emotions and emotional intelligence",
    "stressResponse": "Detailed analysis of stress management patterns and how they typically respond to pressure situations",
    "emotionalResilience": "Evaluation of emotional resilience factors and recovery patterns after setbacks"
  },
  "interpersonalDynamics": {
    "attachmentStyle": "Analysis of relationship patterns and attachment style, including how they form and maintain connections",
    "communicationPattern": "Detailed breakdown of communication style with specific examples of their strengths and challenges",
    "conflictResolution": "Assessment of conflict handling approaches, including typical responses to disagreement and tension",
    "relationshipNeeds": "Deep dive into interpersonal needs and boundaries, including what they seek in relationships",
    "socialBoundaries": "Analysis of boundary-setting patterns and how they navigate personal space and limits",
    "groupDynamics": "Evaluation of behavior in group settings, including typical roles they adopt",
    "compatibilityProfile": "Analysis of relationship compatibility patterns, highlighting relationship dynamics",
    "compatibleTypes": ["List of at least 5 most compatible personality types with detailed explanations for each"],
    "challengingRelationships": ["Types of relationships that may present challenges, with at least 5 specific examples and reasoning"]
  },
  "coreTraits": {
    "primary": "Detailed description of primary personality orientation with specific behavioral examples",
    "secondary": "Analysis of secondary personality characteristics that complement or balance primary traits",
    "tertiaryTraits": ["Array of at least 5 significant traits with detailed explanations for each"],
    "strengths": ["Detailed analysis of at least 5 key strengths with examples and contexts where they shine"],
    "challenges": ["Thoughtful analysis of at least 5 growth areas with nuanced description"],
    "adaptivePatterns": ["Analysis of adaptation and flexibility patterns in different contexts"],
    "potentialBlindSpots": ["Insight into at least 5 potential unconscious patterns that may affect decision-making"]
  },
  "careerInsights": {
    "naturalStrengths": ["Detailed analysis of at least 5 professional strengths based on personality patterns"],
    "workplaceNeeds": ["In-depth exploration of ideal work environment factors"],
    "leadershipStyle": "Comprehensive analysis of leadership approach and management preferences",
    "idealWorkEnvironment": "Detailed description of optimal work setting that aligns with personality needs",
    "careerPathways": ["Well-reasoned career direction suggestions with at least 5 specific fields"],
    "professionalChallenges": ["Analysis of potential career growth areas and how to address them"],
    "potentialRoles": ["At least 5 specific job roles and positions that align with profile"]
  },
  "motivationalProfile": {
    "primaryDrivers": ["Deep analysis of core motivations with at least 5 specific drivers"],
    "secondaryDrivers": ["Additional motivation factors explored in detail"],
    "inhibitors": ["Analysis of potential blocking factors that might limit growth"],
    "values": ["Core values with detailed explanations of how they manifest"],
    "aspirations": "Comprehensive analysis of life goals and desires based on response patterns",
    "fearPatterns": "Thoughtful analysis of underlying concerns and how they might influence behavior"
  },
  "growthPotential": {
    "developmentAreas": ["Detailed growth opportunities with specific suggestions"],
    "recommendations": ["Specific, actionable development suggestions tailored to personality type"],
    "specificActionItems": ["At least 5 concrete steps for personal growth"],
    "longTermTrajectory": "Analysis of potential development path over time",
    "potentialPitfalls": ["Areas requiring attention and awareness to avoid common challenges"],
    "growthMindsetIndicators": "Analysis of learning and development orientation"
  }
}

CRITICAL INSTRUCTIONS:
1. ENSURE ALL ARRAYS contain AT MINIMUM 3 ITEMS, but preferably 5 or more.
2. Pay special attention to "strengths", "challenges", "tertiaryTraits", and other array fields - they MUST have at least 5 items each.
3. Each string field should contain at least 150-200 words of rich, detailed insight.
4. Your entire response must be VALID JSON that can be parsed directly.
5. Do not include any explanatory text, markdown, or other content outside the JSON object.
6. Use double quotes for all JSON keys and string values, not single quotes.
7. Ensure your analysis is psychologically sound and provides genuine value through specific insights.
`; 
}

async function callOpenAI(prompt: string) {
  console.log("Making API call to OpenAI with GPT-4o...");
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using GPT-4o as explicitly requested
        messages: [
          {
            role: "system",
            content: "You are an expert personality analyst who specializes in creating detailed personality profiles. You ALWAYS ensure that your JSON responses are valid and that ALL array fields contain AT LEAST 5 items each. You never leave any required fields empty."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 15000, // Adjusted to ensure we get complete responses
        top_p: 1.0,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenAI response received successfully");
    
    try {
      // Parse and validate the response content
      const rawContent = data.choices[0].message.content;
      console.log("Response length:", rawContent.length);
      
      let content;
      try {
        content = JSON.parse(rawContent);
      } catch (parseError) {
        console.error("Error parsing OpenAI JSON response:", parseError);
        // Try to clean the response and re-parse
        const cleaned = rawContent.replace(/^```json/, "").replace(/```$/, "").trim();
        content = JSON.parse(cleaned);
      }
      
      // Ensure core sections exist
      ensureSectionsExist(content);
      
      // Ensure all required arrays have minimum content
      ensureArraysPopulated(content);
      
      return content;
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error(`Failed to parse the AI analysis response: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    throw new Error(`OpenAI API call failed: ${error.message}`);
  }
}

function ensureSectionsExist(content: any) {
  // Check that all major sections exist
  const requiredSections = [
    "cognitivePatterning", 
    "emotionalArchitecture", 
    "interpersonalDynamics", 
    "coreTraits", 
    "careerInsights", 
    "motivationalProfile", 
    "growthPotential"
  ];
  
  for (const section of requiredSections) {
    if (!content[section]) {
      content[section] = {};
      console.warn(`Missing section '${section}' - creating empty object`);
    }
  }
  
  // Ensure coreTraits section exists with proper structure
  if (!content.coreTraits) {
    content.coreTraits = {
      primary: "Analytical Thinker",
      secondary: "Balanced Communicator",
      tertiaryTraits: [],
      strengths: [],
      challenges: [],
      adaptivePatterns: [],
      potentialBlindSpots: []
    };
  }
}

function ensureArraysPopulated(content: any) {
  // Helper function to ensure arrays have minimum items
  const ensureArray = (obj: any, path: string, minLength: number, defaultItems: string[]) => {
    // Navigate to the nested property using the path
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    const lastPart = parts[parts.length - 1];
    
    // Ensure the property exists and is an array
    if (!current[lastPart] || !Array.isArray(current[lastPart]) || current[lastPart].length < minLength) {
      // If it doesn't exist or is too short, create or extend it
      const existing = Array.isArray(current[lastPart]) ? current[lastPart] : [];
      current[lastPart] = [
        ...existing,
        ...defaultItems.slice(0, Math.max(0, minLength - existing.length))
      ];
      console.log(`Fixed array at '${path}': now has ${current[lastPart].length} items`);
    }
  };
  
  // Define minimum requirements for key arrays
  ensureArray(content, 'coreTraits.strengths', 5, [
    "Analytical thinking and problem-solving ability",
    "Adaptability to changing situations",
    "Strong communication skills",
    "Emotional intelligence and empathy",
    "Creativity and innovative thinking"
  ]);
  
  ensureArray(content, 'coreTraits.challenges', 5, [
    "Tendency toward perfectionism",
    "Occasional difficulty with work-life balance",
    "Overthinking decisions at times",
    "Sensitivity to criticism",
    "Difficulty setting boundaries"
  ]);
  
  ensureArray(content, 'coreTraits.tertiaryTraits', 5, [
    "Conscientious and detail-oriented",
    "Naturally curious and inquisitive", 
    "Independent thinking",
    "Persistent in the face of challenges",
    "Value-driven decision making"
  ]);
  
  ensureArray(content, 'coreTraits.adaptivePatterns', 3, [
    "Flexibility in approach based on situation",
    "Quick adjustment to unexpected changes",
    "Learning from experience and adjusting strategies"
  ]);
  
  ensureArray(content, 'coreTraits.potentialBlindSpots', 3, [
    "May overlook emotional factors in decision-making",
    "Could underestimate the need for rest and recovery",
    "Potential to set unrealistic personal standards"
  ]);
  
  // Career-related arrays
  ensureArray(content, 'careerInsights.naturalStrengths', 3, [
    "Strategic thinking and planning",
    "Clear communication of complex ideas",
    "Problem-solving in ambiguous situations"
  ]);
  
  ensureArray(content, 'careerInsights.workplaceNeeds', 3, [
    "Collaborative yet autonomous environment",
    "Opportunities for growth and learning",
    "Recognition for contributions and efforts"
  ]);
  
  ensureArray(content, 'careerInsights.careerPathways', 5, [
    "Research and development",
    "Strategic consulting",
    "Project management",
    "Creative direction",
    "Education and training"
  ]);
  
  ensureArray(content, 'careerInsights.professionalChallenges', 3, [
    "Balancing detail focus with big picture thinking",
    "Managing multiple priorities effectively",
    "Communicating with different personality types"
  ]);
  
  ensureArray(content, 'careerInsights.potentialRoles', 5, [
    "Research Analyst",
    "Product Manager",
    "Consultant",
    "Team Lead",
    "Content Strategist"
  ]);
  
  // Other important arrays
  ensureArray(content, 'interpersonalDynamics.compatibleTypes', 5, [
    "Collaborative Partners who complement analytical abilities",
    "Creative Thinkers who bring fresh perspectives",
    "Structured Organizers who help implement ideas",
    "Empathetic Listeners who provide emotional support",
    "Visionary Leaders who inspire bigger thinking"
  ]);
  
  ensureArray(content, 'interpersonalDynamics.challengingRelationships', 5, [
    "Highly competitive individuals who create tension",
    "Rigid thinkers resistant to new ideas",
    "Overly critical personalities that increase self-doubt",
    "Extremely passive communicators who avoid direct discussion",
    "Chaotic collaborators with unpredictable work patterns"
  ]);
  
  ensureArray(content, 'motivationalProfile.primaryDrivers', 5, [
    "Learning and intellectual growth",
    "Making meaningful impact",
    "Professional achievement and recognition",
    "Developing expertise in areas of interest",
    "Creating innovative solutions to problems"
  ]);
  
  ensureArray(content, 'motivationalProfile.secondaryDrivers', 3, [
    "Connection with like-minded individuals",
    "Financial security and stability",
    "Work-life balance and personal fulfillment"
  ]);
  
  ensureArray(content, 'motivationalProfile.inhibitors', 3, [
    "Fear of failure or making mistakes",
    "Tendency toward self-criticism",
    "Difficulty delegating responsibilities"
  ]);
  
  ensureArray(content, 'motivationalProfile.values', 3, [
    "Integrity and authenticity",
    "Excellence and quality",
    "Continuous improvement"
  ]);
  
  ensureArray(content, 'growthPotential.developmentAreas', 3, [
    "Building stronger emotional regulation skills",
    "Developing more effective delegation practices",
    "Enhancing comfort with ambiguity and uncertainty"
  ]);
  
  ensureArray(content, 'growthPotential.recommendations', 3, [
    "Practice mindfulness to reduce overthinking",
    "Set clear boundaries around work and personal time",
    "Seek regular feedback from trusted colleagues"
  ]);
  
  ensureArray(content, 'growthPotential.specificActionItems', 5, [
    "Schedule regular reflection time to review personal growth progress",
    "Join a community or group focused on area of interest",
    "Practice saying no to opportunities that don't align with core values",
    "Develop a structured approach to receiving and processing criticism",
    "Build a daily routine that balances productivity with self-care"
  ]);
  
  ensureArray(content, 'growthPotential.potentialPitfalls', 3, [
    "Becoming too focused on weaknesses rather than leveraging strengths",
    "Setting unrealistic expectations for rate of personal change",
    "Neglecting physical or emotional well-being in pursuit of goals"
  ]);
}

async function storeAnalysisResults(userId: string, analysis: any, responses: any[]) {
  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase
      .from("big_me_analyses")
      .insert({
        user_id: userId,
        analysis_result: analysis,
        responses: responses,
        created_at: new Date().toISOString()
      })
      .select("id");

    if (error) {
      console.error("Error storing analysis results:", error);
      throw new Error(`Failed to store analysis: ${error.message}`);
    }

    console.log("Analysis stored successfully with ID:", data?.[0]?.id);
    return data?.[0]?.id;
  } catch (error) {
    console.error("Error in storeAnalysisResults:", error);
    throw new Error(`Failed to store analysis results: ${error.message}`);
  }
}
