
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser compatibility
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
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
    
    // Call OpenAI API with improved error handling
    console.log("Calling OpenAI API...");
    let analysisResult;
    try {
      analysisResult = await callOpenAI(prompt);
      console.log("OpenAI API call completed successfully");
    } catch (openAiError) {
      console.error("Primary OpenAI API call failed:", openAiError.message);
      // Attempt retry with reduced content
      console.log("Attempting fallback analysis with reduced content...");
      analysisResult = await callOpenAIWithReducedContent(responses);
    }

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
    "tertiaryTraits": ["Array of 10+ significant traits with detailed explanations for each"],
    "strengths": ["Detailed analysis of at least 8 key strengths with examples and contexts where they shine"],
    "challenges": ["Thoughtful analysis of at least 8 growth areas with nuanced description"],
    "adaptivePatterns": ["Analysis of adaptation and flexibility patterns in different contexts"],
    "potentialBlindSpots": ["Insight into at least 5 potential unconscious patterns that may affect decision-making"]
  },
  "careerInsights": {
    "naturalStrengths": ["Detailed analysis of professional strengths based on personality patterns"],
    "workplaceNeeds": ["In-depth exploration of ideal work environment factors"],
    "leadershipStyle": "Comprehensive analysis of leadership approach and management preferences",
    "idealWorkEnvironment": "Detailed description of optimal work setting that aligns with personality needs",
    "careerPathways": ["Well-reasoned career direction suggestions with at least 8 specific fields"],
    "professionalChallenges": ["Analysis of potential career growth areas and how to address them"],
    "potentialRoles": ["At least 10 specific job roles and positions that align with profile"]
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
    "specificActionItems": ["At least 8 concrete steps for personal growth"],
    "longTermTrajectory": "Analysis of potential development path over time",
    "potentialPitfalls": ["Areas requiring attention and awareness to avoid common challenges"],
    "growthMindsetIndicators": "Analysis of learning and development orientation"
  }
}

BE EXHAUSTIVE in your analysis. Each string field should contain at least 150 words of rich, detailed insight. All array fields must contain AT LEAST the minimum number of items specified in the comments (or 5 if not specified). Ensure that your analysis is thorough, psychologically sound, and provides genuine value through specific, personalized insights rather than generic statements.
`;
}

async function callOpenAI(prompt: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o", // Using GPT-4o as the closest available model
      messages: [
        {
          role: "system",
          content: "Analyze personality quiz results by interpreting the scores and identifying personality traits based on given criteria. Provide comprehensive, evidence-based analysis with exceptional detail and depth."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 16000, // Within GPT-4o's limit
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenAI API Error:", error);
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  try {
    // Validate the response content
    const content = JSON.parse(data.choices[0].message.content);
    validateAnalysisContent(content);
    return content;
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    throw new Error("Failed to parse the AI analysis response");
  }
}

async function callOpenAIWithReducedContent(responses: AnalysisRequest["responses"]) {
  // Create a simpler prompt with reduced content
  const sampleSize = Math.min(responses.length, 30);
  const sampledResponses = [...responses]
    .sort(() => 0.5 - Math.random())
    .slice(0, sampleSize);
  
  console.log(`Using ${sampleSize} sampled responses for fallback analysis`);
  
  const simplifiedPrompt = generatePrompt(sampledResponses);
  
  try {
    // Call OpenAI with reduced content and simpler parameters
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        messages: [
          {
            role: "system",
            content: "Create a complete personality profile based on limited quiz responses. Ensure all schema sections are covered thoroughly."
          },
          {
            role: "user",
            content: simplifiedPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 12000, // Further reduced for safety
        top_p: 1.0,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Fallback OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    try {
      const content = JSON.parse(data.choices[0].message.content);
      validateAnalysisContent(content);
      return content;
    } catch (parseError) {
      console.error("Error parsing fallback response:", parseError);
      return generateDefaultAnalysis();
    }
  } catch (fallbackError) {
    console.error("Fallback analysis failed:", fallbackError);
    return generateDefaultAnalysis();
  }
}

function validateAnalysisContent(content: any) {
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
    if (!content[section] || typeof content[section] !== 'object') {
      throw new Error(`Missing or invalid section: ${section}`);
    }
  }
  
  // Ensure arrays have minimum content
  if (!Array.isArray(content.coreTraits.strengths) || content.coreTraits.strengths.length < 3) {
    throw new Error("Strengths array missing or insufficient");
  }
  
  if (!Array.isArray(content.coreTraits.challenges) || content.coreTraits.challenges.length < 3) {
    throw new Error("Challenges array missing or insufficient");
  }
}

function generateDefaultAnalysis() {
  // Provide a default analysis as last resort
  console.log("Generating default analysis as last resort");
  
  return {
    cognitivePatterning: {
      decisionMaking: "Tends to balance analytical thinking with intuitive judgment when making decisions. Considers both facts and feelings in the decision-making process.",
      learningStyle: "Shows signs of being a multimodal learner who benefits from both visual and experiential learning approaches.",
      attention: "Demonstrates ability to focus on tasks that align with personal interests while potentially finding it challenging to maintain focus on less engaging activities.",
      problemSolvingApproach: "Approaches problems methodically, often breaking them down into manageable components before addressing each part.",
      informationProcessing: "Processes information through both analytical and intuitive channels, with a preference for connecting new information to existing knowledge.",
      analyticalTendencies: "Shows strength in identifying patterns and making connections between seemingly unrelated concepts."
    },
    emotionalArchitecture: {
      emotionalAwareness: "Demonstrates a developing emotional awareness with ability to recognize emotional states but occasionally needs time to process complex emotional experiences.",
      regulationStyle: "Tends to regulate emotions through a combination of reflection and action, with varying effectiveness depending on context.",
      empathicCapacity: "Shows natural empathy toward others, particularly those with shared experiences or perspectives.",
      emotionalComplexity: "Can experience and hold multiple emotions simultaneously, though may sometimes find it challenging to articulate nuanced emotional states.",
      stressResponse: "Under stress, typically responds by seeking to understand the situation before taking action, though may occasionally become overwhelmed with multiple stressors.",
      emotionalResilience: "Demonstrates resilience through ability to recover from setbacks, particularly when supported by familiar environments and relationships."
    },
    interpersonalDynamics: {
      attachmentStyle: "Exhibits a generally secure attachment style with some selective caution in new relationships.",
      communicationPattern: "Communicates with a blend of directness and diplomacy, adapting style based on relationship context.",
      conflictResolution: "Tends to address conflicts through discussion and compromise, though may occasionally avoid confrontation in highly charged situations.",
      relationshipNeeds: "Values authenticity and mutual respect in relationships, with a need for both connection and personal space.",
      socialBoundaries: "Sets boundaries that protect personal well-being while remaining open to meaningful connections.",
      groupDynamics: "Functions well in groups where roles are clear, often taking supportive roles with occasional leadership when topics align with personal strengths.",
      compatibilityProfile: "Most compatible with individuals who value authenticity, intellectual exchange, and balanced independence.",
      compatibleTypes: [
        "Thoughtful listeners who appreciate depth of conversation",
        "Independent thinkers who respect boundaries",
        "Emotionally intelligent partners who value growth",
        "Reliable, consistent individuals who provide security",
        "Creative minds who bring fresh perspectives"
      ],
      challengingRelationships: [
        "Highly controlling individuals who limit autonomy",
        "Emotionally volatile people with unpredictable responses",
        "Extremely competitive personalities focused on winning over collaboration",
        "Rigid thinkers resistant to new ideas or perspectives",
        "Individuals who avoid emotional depth or authentic connection"
      ]
    },
    coreTraits: {
      primary: "Reflective Observer: Tends to process experiences thoroughly before responding, with a natural inclination toward thoughtful analysis rather than immediate reaction.",
      secondary: "Adaptive Connector: Balances need for meaningful connection with preservation of individual identity, adapting approach based on context.",
      tertiaryTraits: [
        "Intellectually curious with drive to understand underlying principles",
        "Selectively social, valuing depth of connection over breadth",
        "Practically creative, applying innovative thinking to real-world situations",
        "Quietly determined when pursuing meaningful goals",
        "Ethically centered with consistent internal value system",
        "Adaptively resilient, finding ways to navigate challenges",
        "Thoughtfully expressive, communicating with purpose",
        "Autonomy-seeking while maintaining connections",
        "Detail-oriented in matters of personal importance",
        "Contextually flexible across different environments"
      ],
      strengths: [
        "Thoughtful analysis that considers multiple perspectives",
        "Authentic communication that builds trust",
        "Perceptive understanding of others' motivations and needs",
        "Resilience in facing and adapting to challenges",
        "Creative problem-solving that connects diverse ideas",
        "Self-awareness that enables personal growth",
        "Loyalty and reliability in significant relationships",
        "Capacity for deep focus on meaningful activities"
      ],
      challenges: [
        "Perfectionism that may delay action or completion",
        "Overthinking that can lead to analysis paralysis",
        "Selective avoidance of emotionally challenging situations",
        "Reluctance to assert needs in certain contexts",
        "Difficulty with transitions between different social contexts",
        "Occasional tendency to withdraw when overwhelmed",
        "Balancing idealism with practical limitations",
        "Maintaining consistent energy across various responsibilities"
      ],
      adaptivePatterns: [
        "Modulating social engagement based on energy levels",
        "Shifting between analytical and intuitive approaches as needed",
        "Adjusting communication style to audience while maintaining authenticity",
        "Developing structured flexibility for approaching varying challenges"
      ],
      potentialBlindSpots: [
        "May underestimate impact of emotional factors in decision making",
        "Possible tendency to delay action while seeking perfect understanding",
        "Might overlook practical details when focused on conceptual framework",
        "Could undervalue informal social connections that offer valuable opportunities",
        "May unnecessarily limit potential by avoiding unfamiliar challenges"
      ]
    },
    careerInsights: {
      naturalStrengths: [
        "Analytical thinking that identifies patterns and connections",
        "Thoughtful communication that translates complex ideas effectively",
        "Ethical reasoning that maintains integrity in decisions",
        "Creative problem-solving that generates innovative solutions",
        "Self-directed learning that continuously builds expertise",
        "Attention to meaningful details that others might overlook",
        "Collaborative potential when working with like-minded colleagues"
      ],
      workplaceNeeds: [
        "Meaningful work aligned with personal values",
        "Reasonable autonomy in approach and execution",
        "Recognition for quality rather than quantity of contribution",
        "Opportunities for continuous learning and development",
        "Balance between collaboration and independent work",
        "Clear expectations with flexibility in implementation",
        "Environment that minimizes unnecessary social politics"
      ],
      leadershipStyle: "Leads through thoughtful guidance rather than directive control, focusing on developing others' strengths while establishing clear purpose. Most effective when leading teams that value expertise and collaborative problem-solving.",
      idealWorkEnvironment: "Thrives in settings that combine structure with flexibility, where innovation is valued, continuous learning is supported, and contributions are recognized for their quality and impact rather than conformity to rigid expectations.",
      careerPathways: [
        "Research and analysis roles across various fields",
        "Specialized consulting that leverages depth of knowledge",
        "Content development requiring thoughtful creation",
        "Instructional design or educational development",
        "Strategic planning roles requiring systems thinking",
        "User experience or human-centered design",
        "Specialized project management for complex initiatives",
        "Roles involving ethical oversight or compliance"
      ],
      professionalChallenges: [
        "Environments requiring constant high-volume social interaction",
        "Highly competitive cultures that undervalue collaboration",
        "Roles with excessive routine without meaningful variation",
        "Settings where decisions must be made with minimal information",
        "Cultures that prioritize politics over performance",
        "Environments lacking opportunities for growth and development"
      ],
      potentialRoles: [
        "Research Analyst in specialized fields",
        "Content Strategist developing meaningful narratives",
        "Specialized Writer or Editor",
        "Instructional Designer for educational programs",
        "User Experience Researcher",
        "Ethics Consultant or Compliance Specialist",
        "Strategic Planning Analyst",
        "Program Evaluator assessing effectiveness",
        "Specialized Project Manager for complex initiatives",
        "Educational Developer or Curriculum Designer",
        "Human Resources Analyst focusing on organizational development",
        "Policy Analyst examining complex social issues"
      ]
    },
    motivationalProfile: {
      primaryDrivers: [
        "Understanding and mastery of meaningful subjects",
        "Creation of work with lasting positive impact",
        "Development of authentic connections with others",
        "Alignment between actions and personal values",
        "Growth through continuous learning and self-improvement"
      ],
      secondaryDrivers: [
        "Recognition for quality and expertise in chosen areas",
        "Freedom to approach tasks in personally effective ways",
        "Creation of order and structure from complexity",
        "Preservation of time and space for personal reflection",
        "Balance between various life domains and responsibilities"
      ],
      inhibitors: [
        "Perfectionism blocking completion or initiation",
        "Concern about potential judgment from others",
        "Avoidance of emotionally uncomfortable situations",
        "Energy management challenges across multiple demands",
        "Reluctance to advocate strongly for personal needs"
      ],
      values: [
        "Authenticity in self-expression and relationships",
        "Continuous learning and intellectual growth",
        "Ethical consistency and integrity in actions",
        "Meaningful contribution to larger purposes",
        "Balance between connection and autonomy",
        "Thoughtful consideration in decisions and actions",
        "Quality and depth over quantity and superficiality"
      ],
      aspirations: "Seeks to create a life that balances meaningful achievement with authentic connection, where personal growth continues throughout life stages, and where contributions align with core values while maintaining sustainable well-being.",
      fearPatterns: "May experience concerns about missing opportunities through excessive caution, not fulfilling potential due to perfectionism, or failing to create sufficient stability while pursuing meaningful but uncertain paths."
    },
    growthPotential: {
      developmentAreas: [
        "Balancing analysis with timely action",
        "Expanding comfort with appropriate self-advocacy",
        "Developing greater tolerance for productive uncertainty",
        "Building resilience for high-pressure situations",
        "Enhancing capacity for navigating interpersonal conflicts",
        "Strengthening ability to maintain boundaries without withdrawal",
        "Expanding professional visibility in strategic ways"
      ],
      recommendations: [
        "Practice 'good enough' completion of less critical tasks",
        "Set progressive challenges for social and professional visibility",
        "Develop personalized strategies for energy management",
        "Create structured reflection time to prevent overthinking",
        "Build support systems that encourage growth and accountability",
        "Establish clear criteria for when to act despite uncertainty",
        "Regularly reassess and adjust work-life integration practices"
      ],
      specificActionItems: [
        "Identify one project weekly where 'good enough' is the standard",
        "Practice articulating needs directly in low-stakes situations",
        "Create a personal decision-making framework to prevent analysis paralysis",
        "Develop a 'visibility strategy' for professional contributions",
        "Schedule regular reflection time to assess progress and adjust course",
        "Join or create a small group focused on mutual growth and development",
        "Experiment with new approaches through time-limited trials",
        "Document growth progress to recognize incremental improvements"
      ],
      longTermTrajectory: "With focused development in these areas, expect growth toward more confident self-expression, increased comfort with visibility, more effective boundary management, and greater ability to take calculated risks while maintaining core strengths in thoughtful analysis, authentic connection, and meaningful contribution.",
      potentialPitfalls: [
        "Retreating to comfort zones when growth becomes challenging",
        "Substituting analysis for action when facing uncertainty",
        "Neglecting self-care during periods of intensive growth",
        "Attempting too many developmental areas simultaneously",
        "Setting unrealistic standards for growth timelines"
      ],
      growthMindsetIndicators: "Shows natural inclination toward growth through consistent curiosity and interest in learning. Can strengthen growth mindset by focusing on process over outcomes, viewing challenges as opportunities rather than threats, and celebrating incremental progress rather than expecting perfection."
    }
  };
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
    // We don't throw here as this is a non-critical operation
    // The analysis can still be returned to the user
  }
}
