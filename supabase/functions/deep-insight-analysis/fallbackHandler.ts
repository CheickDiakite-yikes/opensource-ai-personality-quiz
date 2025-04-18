
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError, logDebug } from "./logging.ts";
import { SYSTEM_PROMPT } from "./prompts.ts";

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
      const enhancedSystemPrompt = SYSTEM_PROMPT + "\n\nCRITICAL: Return ONLY pure JSON with DOUBLE QUOTES for ALL property names and string values. No single quotes, no unquoted properties, no markdown formatting, no code blocks, no explanation.";

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
      
      // Extract JSON from the raw content
      let jsonString = rawContent;
      
      // Check if response contains markdown JSON blocks and extract just the JSON
      if (jsonString.includes("```json")) {
        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonString = jsonMatch[1].trim();
        } else {
          // Try without the "json" language specifier
          const basicMatch = jsonString.match(/```\s*([\s\S]*?)\s*```/);
          if (basicMatch && basicMatch[1]) {
            jsonString = basicMatch[1].trim();
          }
        }
      }
      
      logDebug("Cleaning JSON in fallback...");
      
      // Very aggressive JSON cleaning that handles multiple issues
      // 1. Replace single-quoted property names with double quotes
      jsonString = jsonString.replace(/'([^']+?)'\s*:/g, '"$1":');
      
      // 2. Replace unquoted property names with double quotes (handles alphanumeric and underscores)
      jsonString = jsonString.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
      
      // 3. Replace single-quoted string values with double quotes (avoiding apostrophes in words)
      jsonString = jsonString.replace(/:\s*'([^']*)'/g, ': "$1"');
      
      // 4. Fix trailing commas before closing braces and brackets
      jsonString = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      
      // 5. Balance missing brackets if needed
      const openBraces = (jsonString.match(/{/g) || []).length;
      const closeBraces = (jsonString.match(/}/g) || []).length;
      if (openBraces > closeBraces) {
        jsonString += '}'.repeat(openBraces - closeBraces);
      }
      
      // 6. Fix NaN, undefined and other JavaScript values not valid in JSON
      jsonString = jsonString
        .replace(/:\s*undefined/g, ': null')
        .replace(/:\s*NaN/g, ': null')
        .replace(/:\s*Infinity/g, ': null');
      
      try {
        return JSON.parse(jsonString);
      } catch (jsonError) {
        logError(jsonError, "Fallback JSON parsing");
        
        // Try an even more aggressive approach as a last resort
        logDebug("Attempting final JSON recovery in fallback...");
        
        // Try to find a valid JSON object by looking for an object that starts with { and ends with }
        const possibleJsonMatch = rawContent.match(/{[\s\S]*}/);
        if (possibleJsonMatch) {
          let lastResortJson = possibleJsonMatch[0];
          
          // Apply the same cleanups as before
          lastResortJson = lastResortJson.replace(/'([^']+?)'\s*:/g, '"$1":');
          lastResortJson = lastResortJson.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
          lastResortJson = lastResortJson.replace(/:\s*'([^']*)'/g, ': "$1"');
          lastResortJson = lastResortJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          
          try {
            return JSON.parse(lastResortJson);
          } catch (finalError) {
            // Create an emergency fallback object
            return {
              cognitivePatterning: { decisionMaking: "Analysis unavailable due to technical issues" },
              emotionalArchitecture: { emotionalAwareness: "Analysis generation encountered errors" },
              coreTraits: { 
                primary: "Analysis unavailable", 
                tertiaryTraits: ["Technical issue encountered"] 
              }
            };
          }
        } else {
          throw new Error("Could not parse JSON or extract valid structure from OpenAI response");
        }
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
