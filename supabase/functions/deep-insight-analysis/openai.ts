
import { SYSTEM_PROMPT } from "./prompts.ts";
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
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
    
    // More conservative prompt size limit
    const MAX_PROMPT_SIZE = 10000; // Reduced from 14000 to leave more space for processing
  
    let optimizedPrompt = formattedResponses;
  
    if (formattedResponses.length > MAX_PROMPT_SIZE) {
      logDebug(`Large input detected (${formattedResponses.length} chars), optimizing prompt size`);
    
      const responses = formattedResponses.split('\n');
      const keptResponses = [];
      let totalLength = 0;
    
      // Enhanced sampling strategy for better response selection
      for (const response of responses) {
        // Prioritize detailed responses but with stricter length criteria
        if (totalLength + response.length <= MAX_PROMPT_SIZE - 1000 && response.length > 150) {
          keptResponses.push(response);
          totalLength += response.length + 1;
        }
      }
    
      // If we haven't collected enough detailed responses, add some shorter ones
      if (keptResponses.length < 12) { // Increased minimum responses
        for (const response of responses) {
          if (totalLength + response.length <= MAX_PROMPT_SIZE - 1000) {
            keptResponses.push(response);
            totalLength += response.length + 1;
          }
        }
      }
    
      optimizedPrompt = keptResponses.join('\n');
      optimizedPrompt += "\n\n[Content intelligently sampled for comprehensive analysis. Focus on key patterns and detailed insights.]";
    
      logDebug(`Reduced prompt from ${formattedResponses.length} to ${optimizedPrompt.length} characters`);
    }
    
    // Implement retry loop with exponential backoff
    let lastError = null;
    
    for (let attemptCount = 0; attemptCount <= API_CONFIG.RETRY_COUNT; attemptCount++) {
      try {
        if (attemptCount > 0) {
          // Exponential backoff - wait longer for each retry
          const backoffDelay = Math.pow(2, attemptCount) * 1000; // 2s, 4s, 8s, etc.
          logDebug(`Retry attempt ${attemptCount}/${API_CONFIG.RETRY_COUNT} after ${backoffDelay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
        
        // Create an AbortController with a more generous timeout
        const controller = new AbortController();
        const extendedTimeout = API_CONFIG.MAIN_TIMEOUT * (attemptCount + 1); // Increase timeout for each retry
        const timeoutId = setTimeout(() => {
          controller.abort("Request timeout exceeded");
          logDebug("Manually aborting request after timeout", { timeout: extendedTimeout });
        }, extendedTimeout);
        
        try {
          // Add attempt information to logs
          logDebug(`Sending request to OpenAI (attempt ${attemptCount + 1}/${API_CONFIG.RETRY_COUNT + 1})`, { 
            timeout: extendedTimeout,
            promptLength: optimizedPrompt.length 
          });
          
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
          
          logDebug(`Successfully received OpenAI response on attempt ${attemptCount + 1}`);
          console.timeEnd("openai-api-call");
          
          // Ensure strict JSON format in the response
          return await handleOpenAIResponse(openAIRes);
        } catch (error) {
          clearTimeout(timeoutId); // Ensure we clear the timeout to prevent memory leaks
          
          // Add more context to the error
          const enhancedError = error instanceof Error 
            ? new Error(`API call attempt ${attemptCount + 1} failed: ${error.message}`)
            : new Error(`API call attempt ${attemptCount + 1} failed with unknown error`);
            
          logError(enhancedError, `API call attempt ${attemptCount + 1}`);
          lastError = enhancedError;
          
          // If this is the last retry, don't continue to the next attempt
          if (attemptCount >= API_CONFIG.RETRY_COUNT) {
            throw lastError;
          }
          // Otherwise, continue to next retry attempt
        }
      } catch (retryError) {
        logError(retryError, `Retry wrapper error attempt ${attemptCount + 1}`);
        lastError = retryError;
        
        // If this is the last retry, don't continue to the next attempt
        if (attemptCount >= API_CONFIG.RETRY_COUNT) {
          throw lastError;
        }
        // Otherwise, continue to next retry attempt
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
