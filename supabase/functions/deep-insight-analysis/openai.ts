
import { SYSTEM_PROMPT } from "./prompts.ts";
import { corsHeaders, API_CONFIG } from "./openaiConfig.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logRequestConfig, logError, logDebug } from "./logging.ts";
import { handleFallback } from "./fallbackHandler.ts";

export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    logDebug("OpenAI API key missing or empty");
    throw new Error("OpenAI API key is missing or invalid");
  }

  logDebug(`Starting OpenAI API call with model: ${API_CONFIG.DEFAULT_MODEL}`);
  console.time("openai-api-call");

  try {
    const config = {
      model: API_CONFIG.DEFAULT_MODEL,
      max_tokens: API_CONFIG.MAIN_MAX_TOKENS,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      totalPromptTokens: SYSTEM_PROMPT.length + formattedResponses.length,
      responsesCount: formattedResponses.split('\n').length
    };
    
    logRequestConfig(config);
    
    // Determine if we should reduce the prompt size based on token count
    let optimizedPrompt = formattedResponses;
    if (formattedResponses.length > 8000) {
      logDebug("Very large input detected, optimizing prompt size");
      optimizedPrompt = formattedResponses.substring(0, 8000) + "...";
      logDebug(`Reduced prompt from ${formattedResponses.length} to ${optimizedPrompt.length} characters`);
    }
    
    // Implement retry loop
    let lastError = null;
    
    for (let attemptCount = 0; attemptCount <= API_CONFIG.RETRY_COUNT; attemptCount++) {
      try {
        if (attemptCount > 0) {
          logDebug(`Retry attempt ${attemptCount}/${API_CONFIG.RETRY_COUNT}`);
        }
        
        // Create an AbortController to handle timeouts manually
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort("Request timeout exceeded");
          logDebug("Manually aborting request after timeout", { timeout: API_CONFIG.MAIN_TIMEOUT });
        }, API_CONFIG.MAIN_TIMEOUT);
        
        try {
          // Pass signal to fetch request
          logDebug("Sending request to OpenAI", { timeout: API_CONFIG.MAIN_TIMEOUT });
          const fetchPromise = createOpenAIRequest(
            openAIApiKey, 
            [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: `Please analyze these assessment responses:\n${optimizedPrompt}` }
            ],
            API_CONFIG.MAIN_MAX_TOKENS,
            controller.signal
          );
          
          const openAIRes = await fetchPromise;
          clearTimeout(timeoutId); // Clear the timeout if request completes
          logDebug("Successfully received OpenAI response");
          console.timeEnd("openai-api-call");
          
          return await handleOpenAIResponse(openAIRes);
        } catch (error) {
          clearTimeout(timeoutId); // Ensure we clear the timeout to prevent memory leaks
          logError(error, `API call attempt ${attemptCount + 1}`);
          lastError = error;
          // Continue to next retry attempt
        }
      } catch (retryError) {
        logError(retryError, `Retry wrapper error attempt ${attemptCount + 1}`);
        lastError = retryError;
        // Continue to next retry attempt
      }
    }
    
    // All retry attempts failed, throw the last error to trigger the fallback
    logDebug("All retry attempts failed, using fallback");
    throw lastError || new Error("All OpenAI API attempts failed");
  } catch (error) {
    logError(error, "OpenAI API call");
    
    // Now we'll try the fallback
    logDebug("Main API call failed. Attempting fallback...");
    try {
      return await handleFallback(openAIApiKey, formattedResponses);
    } catch (fallbackError) {
      logError(fallbackError, "Both main and fallback approaches failed");
      throw new Error("Analysis processing failed after multiple attempts: " + 
        (fallbackError instanceof Error ? fallbackError.message : "Unknown error"));
    }
  }
}
