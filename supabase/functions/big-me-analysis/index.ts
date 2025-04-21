
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.13.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced function to clean and parse JSON that might contain markdown formatting
const cleanAndParseJSON = (content: string): any => {
  try {
    // First try direct parsing
    return JSON.parse(content);
  } catch (error) {
    console.log("Direct JSON parsing failed, attempting to clean content");
    
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try to find anything that looks like a JSON object
      const potentialJsonMatch = content.match(/\{[\s\S]*\}/);
      if (potentialJsonMatch) {
        return JSON.parse(potentialJsonMatch[0]);
      }
      
      // Try more aggressive cleaning - remove any non-JSON characters at the beginning and end
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const cleanedContent = content.substring(firstBrace, lastBrace + 1);
        return JSON.parse(cleanedContent);
      }
    } catch (cleanError) {
      console.error("Failed to parse after cleaning:", cleanError);
    }
    
    // If all else fails, throw an informative error
    throw new Error(`Failed to parse JSON content. Content starts with: ${content.substring(0, 100)}...`);
  }
};

// Create a comprehensive default analysis when the AI fails
const createDefaultAnalysis = () => {
  return {
    cognitivePatterning: {
      decisionMaking: "Balanced approach combining logical analysis with intuitive insights.",
      learningStyle: "Versatile learner who adapts to different educational contexts and materials.",
      attention: "Focused with ability to sustain concentration on important tasks.",
      problemSolvingApproach: "Methodical problem-solver who breaks down complex issues into manageable parts.",
      informationProcessing: "Processes information thoroughly before making decisions.",
      analyticalTendencies: "Strong critical thinking skills with attention to detail.",
      notableExamples: ["Shows careful consideration in responses", "Demonstrates analytical depth"]
    },
    emotionalArchitecture: {
      emotionalAwareness: "Good understanding of personal emotional states and their triggers.",
      regulationStyle: "Balanced emotional regulation with effective coping mechanisms.",
      empathicCapacity: "Strong ability to understand others' perspectives and feelings.",
      emotionalComplexity: "Recognizes and navigates the nuances of different emotions.",
      stressResponse: "Handles stress through constructive problem-solving and seeking support.",
      emotionalResilience: "Recovers well from setbacks and learns from challenges.",
      notableExamples: ["Shows empathetic understanding", "Demonstrates emotional awareness"]
    },
    interpersonalDynamics: {
      attachmentStyle: "Secure attachment style with healthy relationship expectations.",
      communicationPattern: "Clear communicator who values honesty and transparency.",
      conflictResolution: "Seeks collaborative solutions that address all parties' concerns.",
      relationshipNeeds: "Values authentic connections and mutual growth in relationships.",
      socialBoundaries: "Maintains healthy boundaries while remaining approachable.",
      groupDynamics: "Contributes positively to group settings with collaborative approach.",
      compatibilityProfile: "Most compatible with authentic, growth-oriented individuals.",
      compatibleTypes: ["Growth-oriented individuals", "Authentic communicators", "Supportive partners", "Creative collaborators", "Honest and direct communicators"],
      challengingRelationships: ["Overly critical individuals", "Emotionally unavailable partners", "Controlling personalities", "Highly competitive people", "Those resistant to personal growth"],
      notableExamples: ["Values authentic connections", "Seeks mutual understanding"]
    },
    coreTraits: {
      primary: "Analytical Thinker",
      secondary: "Empathetic Communicator",
      tertiaryTraits: [
        { label: "Adaptable", explanation: "Shows flexibility in changing situations and environments" },
        { label: "Resilient", explanation: "Demonstrates ability to recover and learn from setbacks" },
        { label: "Curious", explanation: "Shows genuine interest in learning and understanding" },
        { label: "Thoughtful", explanation: "Considers implications before making decisions" },
        { label: "Responsible", explanation: "Takes ownership of actions and commitments" },
        { label: "Creative", explanation: "Approaches problems with innovative thinking" },
        { label: "Diligent", explanation: "Shows persistence and thoroughness in tasks" },
        { label: "Authentic", explanation: "Presents true self and values genuineness" }
      ],
      strengths: ["Critical thinking", "Emotional intelligence", "Adaptability", "Problem-solving", "Attentive listening", "Analytical skills", "Empathy"],
      challenges: ["Perfectionism", "Overthinking", "Balancing logic and emotion", "Setting boundaries", "Managing stress during uncertainty"],
      adaptivePatterns: ["Learning from feedback", "Adjusting approaches based on context", "Finding balance between different needs", "Integrating multiple perspectives", "Refining strategies based on outcomes"],
      potentialBlindSpots: ["May overlook intuition when focused on analysis", "Could neglect self-care when helping others", "Might delay decisions seeking perfect solutions", "Can overextend to avoid disappointing others", "Might miss opportunities requiring quick action due to careful deliberation"],
      notableExamples: ["Demonstrates balanced thinking", "Shows both analytical and emotional intelligence"]
    },
    careerInsights: {
      naturalStrengths: ["Critical analysis", "Problem-solving", "Communication", "Adaptability", "Team collaboration", "Learning agility", "Project management"],
      workplaceNeeds: ["Intellectual stimulation", "Meaningful work", "Supportive culture", "Growth opportunities", "Work-life balance", "Recognition for contributions", "Collaborative environment"],
      leadershipStyle: "Balanced leadership combining analytical thinking with emotional intelligence and interpersonal awareness.",
      idealWorkEnvironment: "Collaborative setting that values both individual contribution and teamwork, with opportunities for growth and learning.",
      careerPathways: ["Strategic analysis", "Research", "Education", "Consulting", "Psychology", "Project management", "Communications"],
      professionalChallenges: ["Maintaining work-life balance", "Managing perfectionism", "Prioritizing competing demands", "Setting professional boundaries", "Navigating office politics"],
      potentialRoles: ["Analyst", "Researcher", "Consultant", "Educator", "Project Manager", "Content Developer", "Therapist", "UX Designer", "Strategic Advisor", "Business Analyst"],
      notableExamples: ["Strong analytical capabilities", "Balanced interpersonal skills"]
    },
    motivationalProfile: {
      primaryDrivers: ["Personal growth", "Understanding complex subjects", "Helping others", "Creating value", "Learning and development", "Solving problems", "Making meaningful contributions"],
      secondaryDrivers: ["Recognition for expertise", "Intellectual stimulation", "Professional advancement", "Financial security", "Positive social impact", "Creative expression", "Work-life harmony"],
      inhibitors: ["Excessive self-criticism", "Uncertainty", "Lack of meaning", "Restrictive environments", "Lack of growth opportunities", "Micromanagement", "Negative team dynamics"],
      values: ["Integrity", "Growth", "Compassion", "Excellence", "Balance", "Authenticity", "Wisdom", "Connection", "Knowledge", "Purpose"],
      aspirations: "Seeking to develop expertise while making positive contributions to others' lives and continuing personal growth journey.",
      fearPatterns: "Concerns about not meeting high personal standards or failing to achieve meaningful impact in chosen areas.",
      notableExamples: ["Values growth and development", "Motivated by meaningful contribution"]
    },
    growthPotential: {
      developmentAreas: ["Balancing analysis with intuition", "Managing perfectionism", "Setting healthy boundaries", "Embracing uncertainty", "Practicing self-compassion", "Delegating effectively", "Prioritizing self-care"],
      recommendations: ["Regular reflection practices", "Mindfulness techniques", "Structured goal-setting", "Seeking diverse perspectives", "Cultivating support network", "Skill development in areas of interest", "Exploring creative outlets"],
      specificActionItems: ["Start a daily reflection journal", "Set weekly learning goals", "Practice delegating one task per week", "Schedule dedicated self-care time", "Join a community of like-minded professionals", "Take courses in areas of interest", "Practice saying no when necessary"],
      longTermTrajectory: "Continued integration of analytical strengths with emotional intelligence, leading to increased wisdom and potential for significant positive impact.",
      potentialPitfalls: ["Overthinking important decisions", "Taking on too much responsibility", "Neglecting personal needs", "Avoiding necessary conflicts", "Perfectionism limiting progress", "Analysis paralysis", "Burnout from overextending"],
      growthMindsetIndicators: "Demonstrates openness to feedback and willingness to learn from challenges and setbacks.",
      notableExamples: ["Shows growth orientation", "Open to development and feedback"]
    }
  };
};

serve(async (req) => {
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    console.log("[BigMe] Starting analysis process");
    // Start timer for performance tracking
    const startTime = Date.now();
    
    // Parse request
    const { userId, responses } = await req.json();

    // Validate request
    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      return new Response(JSON.stringify({
        error: "Invalid request. Missing userId or responses.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Extract questions and answers from responses
    const questionsAndAnswers = responses.map(response => ({
      question: response.question,
      answer: response.selectedOption || response.customResponse || "No answer provided",
      category: response.category,
    }));

    console.log(`[BigMe] Processing analysis for user ${userId} with ${responses.length} responses`);

    // Enhanced Deep Analysis systemPrompt for much richer personality feedback
    const systemPrompt = `
      You are Atlas, a world-leading expert in personality psychology and advanced psychometric assessment.
      **YOUR GOAL:** Generate the most comprehensive, multi-layered, unique, and insightful psychological profile possible for the user based on their questionnaire answers.

      # ANALYSIS OUTPUT FORMAT - CRITICAL REQUIREMENTS
      Generate JSON output with these SPECIFIC SECTIONS, providing RICH DETAIL for each:

      1. COGNITIVE PATTERNING:
        - Detail their decision-making style, learning approach, problem-solving methods, and analytical tendencies
        - Provide specific behavioral examples that demonstrate these patterns
        - Identify key strengths and potential limitations in cognitive functioning

      2. EMOTIONAL ARCHITECTURE:
        - Analyze emotional awareness, regulation style, empathic capacity, and resilience
        - Describe emotional complexity and stress response patterns
        - Provide specific insights into emotional processing and expression

      3. INTERPERSONAL DYNAMICS:
        - Detail attachment style, communication patterns, conflict resolution approaches
        - Identify compatibility with different personality types (PROVIDE AT LEAST 5 COMPATIBLE AND 5 CHALLENGING TYPES)
        - Describe relationship needs, social boundaries, and group interaction patterns

      4. CORE TRAITS:
        - Identify primary personality orientation and secondary characteristics
        - List 8-10 tertiary traits with brief explanations for each
        - Provide at least 7 strengths, 5 challenges, 5 adaptive patterns, and 5 potential blind spots

      5. CAREER INSIGHTS:
        - List at least 7 natural professional strengths and ideal workplace needs
        - Describe leadership style and ideal work environment
        - Suggest at least 7 career pathways and 10 specific potential roles that align with their profile

      6. MOTIVATIONAL PROFILE:
        - Identify at least 7 primary drivers and 7 secondary motivators
        - List at least 5 potential inhibitors to motivation
        - Describe core values, aspirations, and fear patterns

      7. GROWTH POTENTIAL:
        - Suggest at least 5 specific development areas with actionable recommendations
        - Provide at least 6 specific action items for personal growth
        - Describe long-term growth trajectory and potential pitfalls

      # CRITICAL FORMAT INSTRUCTIONS
      - Output VALID JSON with properties wrapped in DOUBLE QUOTES
      - For the "coreTraits.tertiaryTraits" array, use objects with "label" and "explanation" properties
      - All arrays must contain multiple items - NEVER leave arrays empty
      - DO NOT include markdown formatting or code blocks
      - Your output must be parseable by JSON.parse()
      - NEVER use placeholders or default content - analyze with high detail based on responses
    `;

    try {
      // Increased timeout to 45 seconds (still safe for edge functions that have 60s limit)
      const analysisTimeout = setTimeout(() => {
        console.error("[BigMe] Analysis timed out after 45 seconds");
        throw new Error("Analysis timed out");
      }, 45000);

      console.log("[BigMe] Calling OpenAI API with optimized prompt");
      
      // Implement a retry mechanism for better reliability
      let retryCount = 0;
      const maxRetries = 1;
      let analysisJson;
      
      while (retryCount <= maxRetries) {
        try {
          const analysisResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openAIApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              max_tokens: 4000,
              messages: [
                {
                  role: "system",
                  content: systemPrompt
                },
                {
                  role: "user",
                  content: `Please analyze these assessment responses thoroughly and provide a complete personality profile with all required sections:\n${JSON.stringify(questionsAndAnswers)}`,
                },
              ],
              temperature: 0.7,
              response_format: { type: "json_object" },
            }),
          });

          // Clear timeout as we got a response
          clearTimeout(analysisTimeout);

          if (!analysisResponse.ok) {
            const errorData = await analysisResponse.json();
            console.error("[BigMe] OpenAI API error:", errorData);
            throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
          }

          console.log("[BigMe] OpenAI response received, processing...");
          const openAiResult = await analysisResponse.json();
          const analysisContent = openAiResult.choices[0].message.content;
          
          console.log("[BigMe] Analysis generated, parsing JSON...");
          
          // Parse the JSON response with better error handling
          try {
            analysisJson = cleanAndParseJSON(analysisContent);
            console.log("[BigMe] Successfully parsed JSON");
            // If we reach here, parsing was successful, break out of retry loop
            break;
          } catch (parseError) {
            console.error("[BigMe] Failed to parse JSON:", parseError);
            
            if (retryCount < maxRetries) {
              console.log(`[BigMe] Retry ${retryCount + 1} of ${maxRetries}`);
              retryCount++;
              // Continue to next iteration for retry
            } else {
              throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
            }
          }
        } catch (apiError) {
          console.error("[BigMe] Error calling OpenAI:", apiError);
          
          if (retryCount < maxRetries) {
            console.log(`[BigMe] Retry ${retryCount + 1} of ${maxRetries}`);
            retryCount++;
            // Continue to next iteration for retry
          } else {
            throw new Error(`OpenAI API failed after retries: ${apiError.message}`);
          }
        }
      }
      
      console.log("[BigMe] Final processed analysis ready for DB");

      try {
        // Store analysis in database
        const { data, error } = await supabase
          .from("big_me_analyses")
          .insert({
            user_id: userId,
            analysis_result: analysisJson,
            responses: questionsAndAnswers
          })
          .select("id, created_at")
          .single();

        if (error) {
          console.error("[BigMe] Database error:", error);
          throw new Error(`Failed to store analysis: ${error.message}`);
        }

        console.log("[BigMe] Analysis stored successfully with ID:", data.id);
        console.log(`[BigMe] Total processing time: ${Date.now() - startTime}ms`);

        // Return success response with analysis data
        return new Response(
          JSON.stringify({
            success: true,
            message: "Analysis completed successfully",
            analysisId: data.id,
            createdAt: data.created_at,
            analysis: analysisJson,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (dbError) {
        console.error("[BigMe] Database operation failed:", dbError);
        throw new Error(`Database operation failed: ${dbError.message}`);
      }
    } catch (openaiError) {
      console.error("[BigMe] OpenAI API error:", openaiError);
      throw new Error(`OpenAI API error: ${openaiError.message}`);
    }
  } catch (error) {
    console.error("[BigMe] Error in big-me-analysis function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred while processing the analysis",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
