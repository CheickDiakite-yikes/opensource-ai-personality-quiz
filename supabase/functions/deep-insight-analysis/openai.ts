
import { API_CONFIG } from "./openaiConfig.ts";
import { logDebug, logError, logInfo, logWarning } from "./logging.ts";
import { SYSTEM_PROMPT, USER_PROMPT } from "./prompts.ts";

// Enhanced call to OpenAI with better prompting and error handling
export async function callOpenAI(apiKey: string, formattedResponses: string) {
  // Create a timeout controller for the request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    logError("OpenAI API request timed out");
  }, API_CONFIG.FALLBACK_TIMEOUT);

  try {
    logInfo(`Using OpenAI model: ${API_CONFIG.DEFAULT_MODEL}`);
    
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

    const requestPayload = {
      model: API_CONFIG.DEFAULT_MODEL,
      messages: messages,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      presence_penalty: API_CONFIG.PRESENCE_PENALTY,
      max_tokens: API_CONFIG.MAX_TOKENS,
      response_format: API_CONFIG.RESPONSE_FORMAT
    };

    logDebug(`Request payload: ${JSON.stringify(requestPayload).substring(0, 500)}...`);

    // Make the API call
    try {
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      // Clear the timeout now that we got a response
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        logError(`OpenAI API error (status ${response.status}): ${errorText}`);
        
        // If we get a rate limit error or server error, try the fallback model
        if (response.status === 429 || response.status >= 500) {
          return tryFallbackModel(apiKey, formattedResponses);
        }
        
        throw new Error(`OpenAI API error: ${errorText}`);
      }

      const result = await response.json();
      
      // Verify that we have a proper response
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        logError("Invalid response structure from OpenAI API", result);
        throw new Error("Invalid response from OpenAI API");
      }
      
      // Log token usage for monitoring
      if (result.usage) {
        logInfo(`Token usage: ${result.usage.total_tokens} (${result.usage.prompt_tokens} prompt, ${result.usage.completion_tokens} completion)`);
      }
      
      return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // If it's an abort error, it means the request timed out
      if (fetchError.name === 'AbortError') {
        logWarning("OpenAI request timed out, trying fallback model");
        return tryFallbackModel(apiKey, formattedResponses);
      }
      
      throw fetchError;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    logError("Error calling OpenAI API:", error);
    throw error;
  }
}

// Fallback function to use a smaller, faster model when the main one fails
async function tryFallbackModel(apiKey: string, formattedResponses: string) {
  logInfo(`Attempting fallback with model: ${API_CONFIG.FALLBACK_MODEL}`);
  
  try {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT + "\n\nIMPORTANT: This is a fallback request. Focus on providing valid JSON with all required fields."
      },
      {
        role: "user",
        content: USER_PROMPT(formattedResponses) + "\n\nNOTE: Please ensure your response is valid JSON and includes ALL required fields."
      }
    ];

    const fallbackPayload = {
      model: API_CONFIG.FALLBACK_MODEL,
      messages: messages,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      presence_penalty: API_CONFIG.PRESENCE_PENALTY,
      max_tokens: API_CONFIG.FALLBACK_MAX_TOKENS,
      response_format: API_CONFIG.RESPONSE_FORMAT
    };

    // Add a timeout controller for the fallback request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      logError("Fallback OpenAI request timed out");
    }, API_CONFIG.FALLBACK_TIMEOUT);

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(fallbackPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      logError(`Fallback model API error (status ${response.status}): ${errorText}`);
      throw new Error(`Fallback model API error: ${errorText}`);
    }

    const result = await response.json();
    
    // Verify the fallback response
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      logError("Invalid response structure from fallback model", result);
      throw new Error("Invalid response from fallback model");
    }
    
    logInfo("Successfully received response from fallback model");
    
    // Log token usage for the fallback
    if (result.usage) {
      logInfo(`Fallback token usage: ${result.usage.total_tokens} (${result.usage.prompt_tokens} prompt, ${result.usage.completion_tokens} completion)`);
    }
    
    return result;
  } catch (fallbackError) {
    logError("Error with fallback model:", fallbackError);
    throw new Error(`Failed to get response from both primary and fallback models: ${fallbackError.message}`);
  }
}
