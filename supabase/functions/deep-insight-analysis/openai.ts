
import { API_CONFIG } from "./openaiConfig.ts";
import { logDebug, logError, logInfo } from "./logging.ts";
import { retryable } from "./retryUtils.ts";

// Enhanced call to OpenAI with better prompting and error handling
export async function callOpenAI(apiKey: string, formattedResponses: string) {
  const prompt = `
You are an expert psychological analyst specialized in creating detailed personality profiles based on assessment responses. 
Your analysis must be EXTREMELY DETAILED, COMPREHENSIVE, and NUANCED. 

USER RESPONSES:
${formattedResponses}

IMPORTANT GUIDELINES:
1. Provide a thorough, rich analysis - at least 500 words for each major section.
2. Use professional psychological terminology and concepts.
3. Analyze cognitive patterns, emotional architecture, and interpersonal dynamics in great depth.
4. Avoid generic or vague statements. Be specific and personalized.
5. Include concrete examples of how traits might manifest in real life.
6. Ensure all analysis sections are FULLY POPULATED with rich content.
7. DO NOT leave any sections empty or with placeholder content.
8. Assign accurate, evidence-based intelligence and emotional intelligence scores.
9. Format your response as a detailed JSON object.
10. NEVER use phrases like "based on limited information" or qualifiers about the assessment limitations.

Your response MUST include these JSON fields, all FULLY POPULATED with rich, detailed content (no placeholders):
{
  "overview": "[500+ words comprehensive personality overview]",
  "core_traits": {
    "primary": "[detailed description of primary trait]",
    "secondary": "[detailed description of secondary trait]",
    "manifestations": "[detailed examples of how these traits manifest]"
  },
  "cognitive_patterning": {
    "decisionMaking": "[detailed analysis of decision-making approach]",
    "learningStyle": "[detailed analysis of learning style]",
    "problemSolving": "[detailed analysis of problem-solving approach]",
    "informationProcessing": "[detailed analysis of information processing]"
  },
  "emotional_architecture": {
    "emotionalAwareness": "[detailed analysis of emotional awareness]",
    "regulationStyle": "[detailed analysis of emotional regulation]",
    "emotionalResponsiveness": "[detailed analysis of emotional responsiveness]",
    "emotionalPatterns": "[detailed analysis of emotional patterns]"
  },
  "interpersonal_dynamics": {
    "attachmentStyle": "[detailed analysis of attachment style]",
    "communicationPattern": "[detailed analysis of communication pattern]",
    "conflictResolution": "[detailed analysis of conflict resolution style]",
    "relationshipNeeds": "[detailed analysis of relationship needs]"
  },
  "growth_potential": {
    "developmentalPath": "[detailed roadmap for personal growth]",
    "blindSpots": "[detailed analysis of personal blind spots]",
    "untappedStrengths": "[detailed analysis of untapped strengths]",
    "growthExercises": "[specific exercises for personal development]"
  },
  "intelligence_score": [score between 1-100],
  "emotional_intelligence_score": [score between 1-100],
  "response_patterns": {
    "primaryChoice": "[type identifier]",
    "secondaryChoice": "[type identifier]"
  }
}
`;

  // Log the constructed prompt (abbreviated for privacy)
  logDebug(`Prompt constructed, length: ${prompt.length} characters`);

  try {
    const requestPayload = {
      model: API_CONFIG.DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: prompt
        }
      ],
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      presence_penalty: API_CONFIG.PRESENCE_PENALTY,
      max_tokens: API_CONFIG.MAX_TOKENS,
      response_format: API_CONFIG.RESPONSE_FORMAT
    };

    logInfo(`Calling OpenAI API with model: ${API_CONFIG.DEFAULT_MODEL}`);
    logDebug(`Request payload: ${JSON.stringify(requestPayload, null, 2).substring(0, 500)}...`);

    // First attempt with primary model
    const fetchAPI = retryable(fetch, API_CONFIG.RETRY_ATTEMPTS);
    const response = await fetchAPI(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError(`OpenAI API error (status ${response.status}): ${errorText}`);
      
      // If the error is 429 (rate limit) or 500+ (server error), try with fallback model
      if (response.status === 429 || response.status >= 500) {
        logInfo(`Retrying with fallback model: ${API_CONFIG.FALLBACK_MODEL}`);
        
        const fallbackPayload = {
          ...requestPayload,
          model: API_CONFIG.FALLBACK_MODEL,
          max_tokens: API_CONFIG.FALLBACK_MAX_TOKENS
        };
        
        const fallbackResponse = await fetch(API_CONFIG.BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify(fallbackPayload),
        });
        
        if (!fallbackResponse.ok) {
          const fallbackErrorText = await fallbackResponse.text();
          logError(`Fallback OpenAI API error: ${fallbackErrorText}`);
          throw new Error(`OpenAI API error: ${fallbackErrorText}`);
        }
        
        return await fallbackResponse.json();
      }
      
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    
    // Verify that the response contains choices
    if (!result || !result.choices || !result.choices[0]) {
      throw new Error("Invalid response structure from OpenAI API");
    }
    
    // Log success with response token usage
    if (result.usage) {
      logInfo(`OpenAI API call successful. Used ${result.usage.total_tokens} tokens (${result.usage.prompt_tokens} prompt, ${result.usage.completion_tokens} completion)`);
    } else {
      logInfo("OpenAI API call successful but no token usage data received");
    }
    
    return result;
  } catch (error) {
    logError("Error calling OpenAI API:", error);
    throw error;
  }
}
