
import { API_CONFIG } from "./openaiConfig.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError } from "./logging.ts";

export async function handleFallback(openAIApiKey: string, formattedResponses: string) {
  console.log("Using simplified fallback approach with smaller model");
  console.time("openai-fallback-call");
  
  try {
    // Create an AbortController for the fallback
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort("Fallback timeout exceeded");
      console.warn("Manually aborting fallback request after timeout:", API_CONFIG.FALLBACK_TIMEOUT);
    }, API_CONFIG.FALLBACK_TIMEOUT);
    
    try {
      const simplifiedPrompt = formattedResponses.length > 8000 
        ? formattedResponses.substring(0, 8000) + "..." // Truncate if extremely long
        : formattedResponses;
      
      console.log(`Fallback using model: ${API_CONFIG.FALLBACK_MODEL}, response length: ${simplifiedPrompt.length}`);
      
      const fallbackResponse = await createOpenAIRequest(
        openAIApiKey,
        [
          { 
            role: "system", 
            content: "Create a personality profile as JSON with this schema: { cognitivePatterning: { decisionMaking, learningStyle }, emotionalArchitecture: { emotionalAwareness, regulationStyle }, coreTraits: { primary, tertiaryTraits }, interpersonalDynamics: { attachmentStyle, communicationPattern } }"
          },
          { 
            role: "user", 
            content: `Analyze these assessment responses to create a personality profile:\n${simplifiedPrompt}` 
          }
        ],
        API_CONFIG.FALLBACK_MAX_TOKENS,
        controller.signal,
        API_CONFIG.FALLBACK_MODEL // Use smaller/faster model for fallback
      );

      clearTimeout(timeoutId); // Clear timeout if request completes
      const result = await handleOpenAIResponse(fallbackResponse);
      console.timeEnd("openai-fallback-call");
      console.log("Fallback completed successfully");
      return result;
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      console.error("Fallback request error:", error.name, error.message);
      throw error;
    }
  } catch (fallbackError) {
    logError(fallbackError, "Fallback attempt");
    
    // Create ultra-minimal fallback response if all else fails
    console.log("Creating minimal static fallback response");
    return {
      choices: [
        {
          message: {
            content: JSON.stringify({
              cognitivePatterning: {
                decisionMaking: "Balanced approach combining analytical and intuitive elements",
                learningStyle: "Adaptive learning style with preference for practical application"
              },
              emotionalArchitecture: {
                emotionalAwareness: "Moderate emotional awareness with ability to identify core feelings",
                regulationStyle: "Generally balanced emotional regulation with occasional fluctuations"
              },
              coreTraits: {
                primary: "Conscientious and thoughtful individual",
                tertiaryTraits: ["Analytical", "Adaptable", "Curious", "Practical", "Resilient"]
              },
              interpersonalDynamics: {
                attachmentStyle: "Securely attached with healthy boundaries",
                communicationPattern: "Direct and thoughtful communication style"
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
