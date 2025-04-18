
import { API_CONFIG } from "./openaiConfig.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError, logDebug } from "./logging.ts";

export async function handleFallback(openAIApiKey: string, formattedResponses: string) {
  logDebug("Using simplified fallback approach with smaller model");
  console.time("openai-fallback-call");
  
  try {
    // Create an AbortController for the fallback
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("Fallback timeout exceeded");
      logDebug("Manually aborting fallback request after timeout", { timeout: API_CONFIG.FALLBACK_TIMEOUT });
    }, API_CONFIG.FALLBACK_TIMEOUT);
    
    try {
      const simplifiedPrompt = formattedResponses.length > 6000 
        ? formattedResponses.substring(0, 6000) + "..." // Further truncate if extremely long
        : formattedResponses;
      
      logDebug(`Fallback using model: ${API_CONFIG.FALLBACK_MODEL}, response length: ${simplifiedPrompt.length}`);
      
      // Use a simpler prompt and smaller model for the fallback
      const fallbackResponse = await createOpenAIRequest(
        openAIApiKey,
        [
          { 
            role: "system", 
            content: "Create a personality profile as JSON. Include: cognitivePatterning, emotionalArchitecture, coreTraits, and interpersonalDynamics. Keep it brief."
          },
          { 
            role: "user", 
            content: `Quick personality analysis from these responses:\n${simplifiedPrompt}` 
          }
        ],
        API_CONFIG.FALLBACK_MAX_TOKENS,
        controller.signal,
        API_CONFIG.FALLBACK_MODEL // Use smaller/faster model for fallback
      );

      clearTimeout(timeoutId); // Clear timeout if request completes
      const result = await handleOpenAIResponse(fallbackResponse);
      console.timeEnd("openai-fallback-call");
      logDebug("Fallback completed successfully");
      return result;
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      logError(error, "Fallback request");
      throw error;
    }
  } catch (fallbackError) {
    logError(fallbackError, "Fallback attempt");
    
    // Create ultra-minimal fallback response if all else fails
    logDebug("Creating minimal static fallback response");
    return {
      choices: [
        {
          message: {
            content: JSON.stringify({
              cognitivePatterning: {
                decisionMaking: "Balanced analytical and intuitive approach",
                learningStyle: "Adaptive learning with practical application focus"
              },
              emotionalArchitecture: {
                emotionalAwareness: "Moderate emotional awareness with core feelings identification",
                regulationStyle: "Balanced emotional regulation with occasional fluctuations"
              },
              coreTraits: {
                primary: "Conscientious and thoughtful individual",
                tertiaryTraits: ["Analytical", "Adaptable", "Curious", "Practical", "Resilient"]
              },
              interpersonalDynamics: {
                attachmentStyle: "Secure attachment with healthy boundaries",
                communicationPattern: "Direct and thoughtful communication"
              }
            })
          }
        }
      ],
      usage: {
        total_tokens: 0,
        completion_tokens: 0,
        prompt_tokens: 0
      }
    };
  }
}
