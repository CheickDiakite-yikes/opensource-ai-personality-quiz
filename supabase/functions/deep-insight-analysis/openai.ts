
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
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("OpenAI request timed out after 240 seconds")), API_CONFIG.MAIN_TIMEOUT)
    );
    
    const fetchPromise = createOpenAIRequest(openAIApiKey, [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Please analyze these assessment responses with rigorous scoring standards:\n${formattedResponses}` }
    ]);
    
    const openAIRes = await Promise.race([fetchPromise, timeoutPromise]);
    console.timeEnd("openai-api-call");
    
    return await handleOpenAIResponse(openAIRes);
  } catch (error) {
    logError(error, "OpenAI API call");
    
    if (error.name === "AbortError" || 
        error.message.includes("timeout") || 
        error.message.includes("Failed to fetch") ||
        error.name === "TypeError") {
      
      console.log("Main API call failed. Attempting fallback with simpler prompt...");
      return await handleFallback(openAIApiKey, formattedResponses);
    }
    throw error;
  }
}

