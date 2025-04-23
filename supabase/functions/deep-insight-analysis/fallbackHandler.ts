
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError, logDebug, logWarning } from "./logging.ts";
import { SYSTEM_PROMPT, FALLBACK_PROMPT } from "./prompts.ts";
import { cleanAndParseJSON, validateResponseStructure } from "./utils.ts";

/**
 * Enhanced fallback system with progressive degradation:
 * 1. Try with fallback model and full prompt
 * 2. If that fails, try with fallback model and simplified prompt
 * 3. If all fails, return graceful error response
 */
export async function handleFallback(openAIApiKey: string, formattedResponses: string) {
  logDebug("Attempting fallback analysis...");

  try {
    // First fallback: Try the fallback model with the main prompt
    const result = await attemptFallback(
      openAIApiKey, 
      formattedResponses, 
      API_CONFIG.FALLBACK_MODEL,
      SYSTEM_PROMPT,
      API_CONFIG.FALLBACK_MAX_TOKENS,
      API_CONFIG.FALLBACK_TIMEOUT,
      "primary fallback"
    );
    
    if (result && validateResponseStructure(result)) {
      logDebug("Primary fallback successful");
      return result;
    }
    
    logWarning("Primary fallback produced incomplete results, attempting simplified fallback");
    
    // Second fallback: Try the fallback model with a simplified prompt
    const simplifiedResult = await attemptFallback(
      openAIApiKey, 
      formattedResponses, 
      API_CONFIG.FALLBACK_MODEL,
      FALLBACK_PROMPT,
      Math.floor(API_CONFIG.FALLBACK_MAX_TOKENS * 0.7), // Reduced token count
      Math.floor(API_CONFIG.FALLBACK_TIMEOUT * 0.8), // Reduced timeout
      "simplified fallback"
    );
    
    if (simplifiedResult) {
      logDebug("Simplified fallback successful");
      return enhanceIncompleteResult(simplifiedResult);
    }
    
    // All fallbacks failed, return graceful error message
    logError(new Error("All fallback attempts failed"), "Fallback system");
    return generateEmergencyResponse();
    
  } catch (error) {
    logError(error, "Fallback analysis");
    return generateEmergencyResponse();
  }
}

/**
 * Attempts a fallback analysis with specified parameters
 */
async function attemptFallback(
  openAIApiKey: string, 
  formattedResponses: string,
  model: string,
  promptTemplate: string,
  maxTokens: number,
  timeout: number,
  fallbackType: string
): Promise<any> {
  try {
    logDebug(`Attempting ${fallbackType} with ${model}`);
    
    // Sample responses if they're too long
    let optimizedResponses = formattedResponses;
    if (formattedResponses.length > 8000) {
      optimizedResponses = sampleResponses(formattedResponses, 8000);
      logDebug(`Sampled responses from ${formattedResponses.length} to ${optimizedResponses.length} chars`);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(`${fallbackType} timeout exceeded (${timeout}ms)`);
      logDebug(`${fallbackType} request manually aborted after timeout`);
    }, timeout);

    try {
      const enhancedPrompt = promptTemplate + "\n\nCRITICAL: Return ONLY pure JSON with DOUBLE QUOTES for ALL property names and string values.";

      const openAIRes = await createOpenAIRequest(
        openAIApiKey,
        [
          { role: "system", content: enhancedPrompt },
          { role: "user", content: `Please analyze these assessment responses:\n${optimizedResponses}` }
        ],
        maxTokens,
        controller.signal
      );

      clearTimeout(timeoutId);
      logDebug(`Successfully received ${fallbackType} OpenAI response`);
      const rawData = await handleOpenAIResponse(openAIRes);
      
      if (!rawData || !rawData.choices || !rawData.choices[0] || !rawData.choices[0].message) {
        throw new Error(`Invalid response structure from OpenAI API in ${fallbackType}`);
      }
      
      const rawContent = rawData.choices[0].message.content || "";
      logDebug(`${fallbackType} response length: ${rawContent.length} chars`);
      
      return JSON.parse(rawContent);
    } catch (parseError) {
      clearTimeout(timeoutId);
      logError(parseError, `${fallbackType} parsing`);
      return null;
    }
  } catch (error) {
    logError(error, `${fallbackType} attempt`);
    return null;
  }
}

/**
 * Intelligently samples responses to fit within a maximum length
 */
function sampleResponses(responses: string, maxLength: number): string {
  const lines = responses.split("\n");
  if (lines.length <= 10) return responses; // If there aren't many lines, keep them all
  
  const sampledLines = [];
  const totalLines = lines.length;
  
  // Always include first 3 and last 2 responses
  const alwaysInclude = [...lines.slice(0, 3), ...lines.slice(-2)];
  let remainingBudget = maxLength - alwaysInclude.join("\n").length;
  
  // Evenly sample the rest
  const middleLines = lines.slice(3, -2);
  const step = Math.max(1, Math.floor(middleLines.length / (remainingBudget / 100)));
  
  for (let i = 0; i < middleLines.length; i += step) {
    sampledLines.push(middleLines[i]);
  }
  
  // Combine and return
  return [...lines.slice(0, 3), ...sampledLines, ...lines.slice(-2)].join("\n");
}

/**
 * Enhances incomplete results with placeholder values for missing fields
 */
function enhanceIncompleteResult(result: any): any {
  // Ensure all expected top-level sections exist
  const expectedSections = [
    'cognitivePatterning', 
    'emotionalArchitecture', 
    'interpersonalDynamics',
    'coreTraits',
    'careerInsights',
    'motivationalProfile',
    'growthPotential'
  ];
  
  for (const section of expectedSections) {
    if (!result[section]) {
      result[section] = {};
      
      // Add a note about simplified analysis
      if (section === 'coreTraits') {
        result[section].primary = "Analysis based on simplified processing due to system constraints.";
      }
    }
  }
  
  return result;
}

/**
 * Generate an emergency response when all fallbacks fail
 */
function generateEmergencyResponse(): any {
  return {
    cognitivePatterning: { 
      decisionMaking: "Analysis currently unavailable due to technical constraints.",
      problemSolvingApproach: "Please try again later for a complete analysis of your cognitive patterns."
    },
    emotionalArchitecture: { 
      emotionalAwareness: "Analysis temporarily unavailable.", 
      stressResponse: "The system encountered difficulties processing your emotional patterns."
    },
    coreTraits: { 
      primary: "Your analysis is currently incomplete due to a technical limitation.",
      tertiaryTraits: ["Analysis in progress"] 
    },
    interpersonalDynamics: {
      attachmentStyle: "We apologize for the inconvenience. Your full analysis could not be completed at this time.",
      compatibleTypes: ["Please try again later"]
    },
    _meta: {
      status: "error",
      message: "Analysis processing encountered a technical limitation. Please try again later."
    }
  };
}
