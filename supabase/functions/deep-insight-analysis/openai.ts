
import { SYSTEM_PROMPT } from "./prompts.ts";
import { corsHeaders, API_CONFIG } from "./openaiConfig.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logRequestConfig, logError } from "./logging.ts";
import { handleFallback } from "./fallbackHandler.ts";

export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    console.error("OpenAI API key missing or empty");
    throw new Error("OpenAI API key is missing or invalid");
  }

  console.log(`Starting OpenAI API call with model: ${API_CONFIG.DEFAULT_MODEL}`);
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
    if (formattedResponses.length > 12000) {
      console.log("Very large input detected, optimizing prompt size");
      optimizedPrompt = formattedResponses.substring(0, 12000) + "...";
      console.log(`Reduced prompt from ${formattedResponses.length} to ${optimizedPrompt.length} characters`);
    }
    
    // Create an AbortController to handle timeouts manually
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("Request timeout exceeded");
      console.warn("Manually aborting request after timeout:", API_CONFIG.MAIN_TIMEOUT);
    }, API_CONFIG.MAIN_TIMEOUT);
    
    try {
      // Pass signal to fetch request
      console.log("Sending request to OpenAI with timeout:", API_CONFIG.MAIN_TIMEOUT);
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
      console.log("Successfully received OpenAI response");
      console.timeEnd("openai-api-call");
      
      return await handleOpenAIResponse(openAIRes);
    } catch (error) {
      clearTimeout(timeoutId); // Ensure we clear the timeout to prevent memory leaks
      console.error("Main API call error:", error.name, error.message, error.stack);
      throw error;
    }
  } catch (error) {
    logError(error, "OpenAI API call");
    
    // Check for all possible abort-related errors
    if (error.name === "AbortError" || 
        error.message?.includes("abort") ||
        error.message?.includes("timeout") || 
        error.message?.includes("exceeded") ||
        error.message?.includes("Failed to fetch") ||
        error.name === "TypeError") {
      
      console.log("Main API call failed or aborted. Attempting fallback with simplified approach...");
      try {
        return await handleFallback(openAIApiKey, formattedResponses);
      } catch (fallbackError) {
        console.error("Both main and fallback approaches failed:", fallbackError);
        throw new Error("Analysis processing failed after multiple attempts: " + (fallbackError.message || "Unknown error"));
      }
    } else if (error.name === "OpenAIAPIError" || error.message?.includes("OpenAI API Error")) {
      console.log("OpenAI API returned an error. Attempting fallback with different model...");
      try {
        return await handleFallback(openAIApiKey, formattedResponses);
      } catch (fallbackError) {
        console.error("Both main and fallback approaches failed:", fallbackError);
        throw new Error("OpenAI API error: " + (error.message || "Unknown error"));
      }
    }
    throw error;
  }
}
