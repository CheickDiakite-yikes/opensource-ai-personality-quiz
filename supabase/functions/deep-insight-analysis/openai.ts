
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logDebug } from "./logging.ts";
import { SYSTEM_PROMPT, USER_PROMPT } from "./prompts.ts";

/**
 * Call OpenAI API with proper error handling and retries
 */
export async function callOpenAI(apiKey: string, formattedResponses: string) {
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
  
  // Track number of tries
  let attempts = 0;
  let lastError = null;
  
  // Try multiple times if configured
  while (attempts <= API_CONFIG.RETRY_ATTEMPTS) {
    attempts++;
    
    try {
      if (attempts > 1) {
        logDebug(`Retry attempt ${attempts-1} of ${API_CONFIG.RETRY_ATTEMPTS}`);
      }
      
      // Create a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 
        attempts === 1 ? API_CONFIG.FALLBACK_TIMEOUT : API_CONFIG.FALLBACK_TIMEOUT * 1.5);
      
      // Use the appropriate model based on retry attempt
      const model = attempts === 1 ? API_CONFIG.DEFAULT_MODEL : API_CONFIG.FALLBACK_MODEL;
      
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...corsHeaders
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: attempts === 1 ? API_CONFIG.TEMPERATURE : API_CONFIG.TEMPERATURE + 0.1,
          top_p: API_CONFIG.TOP_P,
          frequency_penalty: API_CONFIG.FREQUENCY_PENALTY, 
          presence_penalty: API_CONFIG.PRESENCE_PENALTY,
          response_format: API_CONFIG.RESPONSE_FORMAT,
          max_tokens: attempts === 1 ? API_CONFIG.MAX_TOKENS : API_CONFIG.FALLBACK_MAX_TOKENS
        }),
        signal: controller.signal
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Handle errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        logError(`OpenAI API error: ${response.status}`, error);
        
        // Store the error and retry if we haven't exceeded retry attempts
        lastError = new Error(`OpenAI API error: ${response.status} - ${error?.error?.message || 'Unknown error'}`);
        
        if (attempts <= API_CONFIG.RETRY_ATTEMPTS) {
          // Wait before retrying (exponential backoff)
          await new Promise(r => setTimeout(r, Math.pow(2, attempts-1) * 1000));
          continue;
        }
        throw lastError;
      }
      
      // Success! Return the response data
      logDebug(`Received successful response from OpenAI API using model: ${model}`);
      return response.json();
      
    } catch (error) {
      // Handle aborted requests (timeouts)
      if (error.name === 'AbortError') {
        logError(`Request timed out after ${API_CONFIG.FALLBACK_TIMEOUT}ms`);
        lastError = new Error('OpenAI API request timed out');
        
        if (attempts <= API_CONFIG.RETRY_ATTEMPTS) {
          continue;
        }
      } else {
        // For other errors, store and retry if we can
        logError(`Error calling OpenAI API:`, error);
        lastError = error;
        
        if (attempts <= API_CONFIG.RETRY_ATTEMPTS) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempts-1) * 1000));
          continue;
        }
      }
      
      // If we've exhausted retries, throw the last error
      throw lastError || error;
    }
  }
  
  // This should not be reached, but just in case
  throw lastError || new Error('Failed to get a response from OpenAI API after multiple attempts');
}
