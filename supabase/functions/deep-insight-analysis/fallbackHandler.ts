
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError, logDebug } from "./logging.ts";
import { SYSTEM_PROMPT } from "./prompts.ts";
import { cleanAndParseJSON } from "./utils.ts";
import { generateDefaultAnalysis } from "./defaultAnalysis.ts";

export async function handleFallback(openAIApiKey: string, formattedResponses: string) {
  logDebug("Attempting fallback analysis with model: " + API_CONFIG.FALLBACK_MODEL);

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
    
    // Create a smaller sample of responses for the fallback
    const responses = formattedResponses.split('\n');
    const sampleSize = Math.min(responses.length, 50);
    const sampledResponses = responses
      .sort(() => 0.5 - Math.random())  // Shuffle responses
      .slice(0, sampleSize)  // Take a random sample
      .join('\n');
      
    logDebug(`Using ${sampleSize} samples for fallback analysis`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("Fallback request timeout exceeded");
      logDebug("Fallback request manually aborted after timeout", { timeout: API_CONFIG.FALLBACK_TIMEOUT });
    }, API_CONFIG.FALLBACK_TIMEOUT);

    try {
      logDebug("Sending fallback request to OpenAI using model: " + API_CONFIG.FALLBACK_MODEL);

      // Add specific instruction to return only plain JSON with strict double quotes
      const enhancedSystemPrompt = SYSTEM_PROMPT + 
        "\n\nCRITICAL: Return ONLY pure JSON with DOUBLE QUOTES for ALL property names and string values." + 
        "\n\nIMPORTANT: Since we are in fallback mode, focus on providing a COMPLETE analysis for ALL sections with quality content, even if more generalized.";

      const openAIRes = await createOpenAIRequest(
        openAIApiKey,
        [
          { role: "system", content: enhancedSystemPrompt },
          { role: "user", content: `URGENTLY analyze these assessment responses for a complete personality profile:\n${sampledResponses}` }
        ],
        API_CONFIG.FALLBACK_MAX_TOKENS,
        controller.signal
      );

      clearTimeout(timeoutId);
      logDebug("Successfully received fallback OpenAI response using model: " + API_CONFIG.FALLBACK_MODEL);
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
        
        // Try cleaning the JSON before giving up
        try {
          const cleanedJson = cleanAndParseJSON(rawContent);
          if (cleanedJson) {
            logDebug("Successfully parsed JSON after cleaning");
            return cleanedJson;
          }
        } catch (cleanError) {
          logError(cleanError, "Cleaned JSON parsing");
        }
        
        // Create a fallback analysis as last resort
        logDebug("Generating default analysis as last resort");
        return generateDefaultAnalysis(sampledResponses);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      logError(error, "Fallback OpenAI API call");
      
      // Final fallback - generate a basic analysis
      return generateDefaultAnalysis(sampledResponses);
    }
  } catch (error) {
    logError(error, "Fallback analysis");
    
    // Ultimate fallback - never return nothing
    logDebug("Using emergency default analysis");
    return generateDefaultAnalysis(formattedResponses);
  }
}
