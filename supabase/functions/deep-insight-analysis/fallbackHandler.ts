
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
      // Further simplify and reduce the prompt for fallback
      const MAX_FALLBACK_SIZE = 4000; // Even more strict limit for fallback
      let simplifiedPrompt = formattedResponses;
      
      if (formattedResponses.length > MAX_FALLBACK_SIZE) {
        // Get a representative sample of responses instead of just truncating
        const allResponses = formattedResponses.split('\n');
        const totalResponses = allResponses.length;
        
        // Calculate how many responses to sample with a minimum of 10
        const sampleSize = Math.max(10, Math.floor(totalResponses * 0.4));
        let sampledResponses = [];
        
        // Take responses from beginning, middle and end for better representation
        sampledResponses = sampledResponses.concat(allResponses.slice(0, Math.floor(sampleSize/3)));
        sampledResponses = sampledResponses.concat(
          allResponses.slice(
            Math.floor(totalResponses/2 - sampleSize/6), 
            Math.floor(totalResponses/2 + sampleSize/6)
          )
        );
        sampledResponses = sampledResponses.concat(
          allResponses.slice(totalResponses - Math.floor(sampleSize/3))
        );
        
        simplifiedPrompt = sampledResponses.join('\n');
        simplifiedPrompt += "\n\n[Content sampled for analysis. Please analyze key patterns in available responses.]";
      }
      
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
