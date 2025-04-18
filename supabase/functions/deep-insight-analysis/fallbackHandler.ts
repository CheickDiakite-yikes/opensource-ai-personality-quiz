
import { API_CONFIG } from "./openaiConfig.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError } from "./logging.ts";

export async function handleFallback(openAIApiKey: string, formattedResponses: string) {
  console.log("Using fallback with full responses. Length:", formattedResponses.length);
  console.time("openai-fallback-call");
  
  try {
    const fallbackResponse = await createOpenAIRequest(
      openAIApiKey,
      [
        { 
          role: "system", 
          content: "You're a psychology expert specializing in personality analysis. Create a detailed personality profile with core traits, cognitive patterns, emotional tendencies, and interpersonal dynamics. Structure your response as JSON matching the schema: { cognitivePatterning: { decisionMaking, learningStyle }, emotionalArchitecture: { emotionalAwareness, regulationStyle }, coreTraits: { primary, tertiaryTraits }, interpersonalDynamics: { attachmentStyle, communicationPattern } }"
        },
        { 
          role: "user", 
          content: `Analyze these key assessment responses to create a personality profile:\n${formattedResponses}` 
        }
      ],
      API_CONFIG.FALLBACK_MAX_TOKENS
    );

    const result = await handleOpenAIResponse(fallbackResponse);
    console.timeEnd("openai-fallback-call");
    console.log("Fallback completed successfully with tokens:", result.usage?.total_tokens || "N/A");
    console.log("Fallback response content length:", result.choices[0].message.content.length);
    return result;
  } catch (fallbackError) {
    logError(fallbackError, "Fallback attempt");
    throw fallbackError;
  }
}

