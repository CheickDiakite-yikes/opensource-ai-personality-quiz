
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

  console.log("Starting OpenAI API call with model: gpt-4o");
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
    
    // Create an AbortController to handle timeouts manually
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("Request timeout exceeded");
      console.warn("Manually aborting request after timeout:", API_CONFIG.MAIN_TIMEOUT);
    }, API_CONFIG.MAIN_TIMEOUT);
    
    try {
      // Pass signal to fetch request
      const fetchPromise = createOpenAIRequest(
        openAIApiKey, 
        [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Please analyze these assessment responses with rigorous scoring standards:\n${formattedResponses}` }
        ],
        API_CONFIG.MAIN_MAX_TOKENS,
        controller.signal
      );
      
      const openAIRes = await fetchPromise;
      clearTimeout(timeoutId); // Clear the timeout if request completes
      console.timeEnd("openai-api-call");
      
      return await handleOpenAIResponse(openAIRes);
    } catch (error) {
      clearTimeout(timeoutId); // Ensure we clear the timeout to prevent memory leaks
      throw error;
    }
  } catch (error) {
    logError(error, "OpenAI API call");
    
    // Check for all possible abort-related errors
    if (error.name === "AbortError" || 
        error.message?.includes("abort") ||
        error.message?.includes("timeout") || 
        error.message?.includes("Failed to fetch") ||
        error.name === "TypeError") {
      
      console.log("Main API call failed or aborted. Attempting fallback with simpler prompt...");
      try {
        return await handleFallback(openAIApiKey, formattedResponses);
      } catch (fallbackError) {
        console.error("Both main and fallback approaches failed:", fallbackError);
        throw new Error("Analysis processing failed after multiple attempts");
      }
    }
    throw error;
  }
}
