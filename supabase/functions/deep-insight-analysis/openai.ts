
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logDebug, logResponseStats, createPerformanceTracker } from "./logging.ts";
import { retryable } from "./retryUtils.ts";
import { SYSTEM_PROMPT, USER_PROMPT, FALLBACK_PROMPT } from "./prompts.ts";

export async function callOpenAI(apiKey: string, formattedResponses: string) {
  const perfTracker = createPerformanceTracker("OpenAI API call");
  
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },
    {
      role: "user",
      content: USER_PROMPT(formattedResponses)
    }
  ];

  logDebug("Sending request to OpenAI API");
  logDebug(`Request payload size: ${JSON.stringify(messages).length} characters`);
  
  try {
    const response = await retryable(async () => {
      return await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...corsHeaders
        },
        body: JSON.stringify({
          model: API_CONFIG.DEFAULT_MODEL,
          messages: messages,
          temperature: API_CONFIG.TEMPERATURE,
          top_p: API_CONFIG.TOP_P,
          frequency_penalty: API_CONFIG.FREQUENCY_PENALTY, 
          presence_penalty: API_CONFIG.PRESENCE_PENALTY,
          response_format: API_CONFIG.RESPONSE_FORMAT,
          max_tokens: API_CONFIG.MAX_TOKENS || 4000
        })
      });
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logError(`OpenAI API error: ${response.status}`, error);
      
      // If we get a 400 error, attempt to use fallback prompt
      if (response.status === 400) {
        logDebug("Attempting with fallback prompt due to 400 error");
        return await callOpenAIWithFallbackPrompt(apiKey, formattedResponses);
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${error?.error?.message || 'Unknown error'}`);
    }

    const responseData = await response.json();
    logDebug("Received successful response from OpenAI API");
    logResponseStats(responseData);
    
    // Validate the response has the expected structure
    if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
      logError("Invalid response structure from OpenAI API", responseData);
      throw new Error("Invalid response structure from OpenAI");
    }

    // Extract the content and parse as JSON
    const content = responseData.choices[0].message.content;
    try {
      const parsedContent = JSON.parse(content);
      logDebug("Successfully parsed JSON response");
      
      // Transform properties to ensure consistent naming
      const transformedContent = transformResponseProperties(parsedContent);
      
      perfTracker.end();
      return transformedContent;
    } catch (parseError) {
      logError("Failed to parse JSON from OpenAI response", parseError);
      throw new Error("Failed to parse analysis JSON");
    }
  } catch (error) {
    logError("Error during OpenAI API call", error);
    perfTracker.end();
    throw error;
  }
}

// Fallback function with a simpler prompt
async function callOpenAIWithFallbackPrompt(apiKey: string, formattedResponses: string) {
  logDebug("Using fallback prompt");
  
  const messages = [
    {
      role: "system",
      content: FALLBACK_PROMPT
    },
    {
      role: "user",
      content: `Please analyze these responses and provide JSON: ${formattedResponses}`
    }
  ];

  const response = await fetch(API_CONFIG.BASE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...corsHeaders
    },
    body: JSON.stringify({
      model: API_CONFIG.FALLBACK_MODEL || API_CONFIG.DEFAULT_MODEL,
      messages: messages,
      temperature: 0.5, // Lower temperature for more deterministic output
      response_format: API_CONFIG.RESPONSE_FORMAT,
      max_tokens: 3000
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    logError(`Fallback OpenAI API error: ${response.status}`, error);
    throw new Error(`Fallback OpenAI API error: ${response.status}`);
  }

  const responseData = await response.json();
  logDebug("Received successful fallback response from OpenAI API");
  
  try {
    const parsedContent = JSON.parse(responseData.choices[0].message.content);
    logDebug("Successfully parsed JSON from fallback response");
    return transformResponseProperties(parsedContent);
  } catch (parseError) {
    logError("Failed to parse JSON from fallback response", parseError);
    throw new Error("Failed to parse fallback analysis");
  }
}

// Transform response properties to ensure consistent naming
function transformResponseProperties(content: any) {
  return {
    ...content,
    overview: content.overview || "",
    intelligence_score: content.intelligence_score || content.intelligenceScore || 0,
    emotional_intelligence_score: content.emotional_intelligence_score || content.emotionalIntelligenceScore || 0,
    core_traits: content.core_traits || content.coreTraits || {},
    cognitive_patterning: content.cognitive_patterning || content.cognitivePatterning || {},
    emotional_architecture: content.emotional_architecture || content.emotionalArchitecture || {},
    interpersonal_dynamics: content.interpersonal_dynamics || content.interpersonalDynamics || {},
    growth_potential: content.growth_potential || content.growthPotential || {},
    response_patterns: content.response_patterns || content.responsePatterns || {}
  };
}
