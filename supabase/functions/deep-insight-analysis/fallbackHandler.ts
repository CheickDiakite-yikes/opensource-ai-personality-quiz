
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError, logDebug } from "./logging.ts";
import { SYSTEM_PROMPT } from "./prompts.ts";
import { cleanAndParseJSON } from "./utils.ts";

export async function handleFallback(openAIApiKey: string, formattedResponses: string) {
  logDebug("Attempting fallback analysis...");

  try {
    const config = {
      model: API_CONFIG.FALLBACK_MODEL,
      max_tokens: API_CONFIG.FALLBACK_MAX_TOKENS,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      totalPromptTokens: SYSTEM_PROMPT.length + formattedResponses.length,
      responsesCount: formattedResponses.split('\n').length
    };

    logDebug("Fallback config:", config);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("Fallback request timeout exceeded");
      logDebug("Fallback request manually aborted after timeout", { timeout: API_CONFIG.FALLBACK_TIMEOUT });
    }, API_CONFIG.FALLBACK_TIMEOUT);

    try {
      logDebug("Sending fallback request to OpenAI");

      // Add specific instruction to return only plain JSON with strict double quotes
      const enhancedSystemPrompt = SYSTEM_PROMPT + "\n\nCRITICAL: Return ONLY pure JSON with DOUBLE QUOTES for ALL property names and string values.";

      const openAIRes = await createOpenAIRequest(
        openAIApiKey,
        [
          { role: "system", content: enhancedSystemPrompt },
          { role: "user", content: `Please analyze these assessment responses:\n${formattedResponses}` }
        ],
        API_CONFIG.FALLBACK_MAX_TOKENS,
        controller.signal
      );

      clearTimeout(timeoutId);
      logDebug("Successfully received fallback OpenAI response");
      const rawData = await handleOpenAIResponse(openAIRes);
      
      // If there's no content, throw error
      if (!rawData || !rawData.choices || !rawData.choices[0] || !rawData.choices[0].message) {
        throw new Error("Invalid response structure from OpenAI API in fallback");
      }
      
      const rawContent = rawData.choices[0].message.content || "";
      logDebug(`Fallback response length: ${rawContent.length} chars`);
      
      // With JSON mode enabled, we can directly parse the content
      try {
        return JSON.parse(rawContent);
      } catch (jsonError) {
        logError(jsonError, "Fallback JSON parsing");
        
        // Create an emergency fallback object when all parsing attempts fail
        return {
          cognitivePatterning: { decisionMaking: "Analysis unavailable due to technical issues" },
          emotionalArchitecture: { emotionalAwareness: "Analysis generation encountered errors" },
          coreTraits: { 
            primary: "Analysis unavailable", 
            tertiaryTraits: ["Technical issue encountered"] 
          }
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      logError(error, "Fallback OpenAI API call");
      throw error;
    }
  } catch (error) {
    logError(error, "Fallback analysis");
    throw new Error("Fallback analysis failed: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}
