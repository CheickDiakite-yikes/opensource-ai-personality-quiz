
// openaiClient.ts
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logDebug } from "./logging.ts";
import { withRetry } from "./retryUtils.ts";

export async function createOpenAIRequest(openAIApiKey: string, messages: any[], maxTokens: number, signal: AbortSignal) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${openAIApiKey}`,
    ...corsHeaders,
  };

  const payload = {
    model: API_CONFIG.DEFAULT_MODEL,
    messages: messages,
    max_tokens: maxTokens,
    temperature: API_CONFIG.TEMPERATURE,
    top_p: API_CONFIG.TOP_P,
    frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
    stream: false,
    response_format: { type: "json_object" }, // Enable strict JSON mode
  };

  logDebug("createOpenAIRequest payload:", payload);

  return withRetry(
    async () => {
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
        signal: signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logError(`OpenAI API Error: ${response.status} - ${errorBody}`);
        throw new Error(`OpenAI API Error: ${response.status} - ${errorBody}`);
      }

      return response;
    },
    {
      maxAttempts: API_CONFIG.RETRY_COUNT,
      initialDelay: 2000,
      maxDelay: 10000,
      backoffFactor: 2
    },
    "OpenAI API request"
  );
}

export async function handleOpenAIResponse(response: Response) {
  try {
    const data = await response.json();
    logDebug("OpenAI Response Data:", data);
    
    // Ensure we have the expected response structure
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      logError("Invalid OpenAI response structure:", data);
      throw new Error("Invalid OpenAI response structure");
    }

    // With JSON mode enabled, we can directly parse the content
    const content = data.choices[0].message.content;
    logDebug("Content length from OpenAI:", content.length);
    
    try {
      // With strict JSON mode, this should always be valid JSON
      const parsedContent = JSON.parse(content);
      logDebug("Successfully parsed OpenAI JSON response");

      // Validate essential fields and provide fallbacks
      ensureEssentialFields(parsedContent);
      
      return {
        ...data,
        parsedContent
      };
    } catch (parseError) {
      logError("Error parsing OpenAI JSON content:", parseError);
      logError("Content that failed to parse:", content.substring(0, 500) + "...");
      throw new Error("Failed to parse OpenAI JSON content");
    }
  } catch (error) {
    logError("Error processing OpenAI response:", error);
    throw new Error("Failed to process OpenAI response");
  }
}

// Add a function to ensure we have all essential fields with fallback values
function ensureEssentialFields(content: any) {
  // Provide fallbacks for overview and core_traits
  if (!content.cognitivePatterning || typeof content.cognitivePatterning !== 'object') {
    content.cognitivePatterning = {
      decisionMaking: "Your decision-making tends to prioritize logical analysis balanced with practical considerations.",
      learningStyle: "You learn best through structured approaches that include both theory and practical application.",
      attention: "Your attention pattern reveals a balance between detail focus and big-picture thinking.",
      problemSolvingApproach: "You approach problems methodically, breaking them into manageable components.",
      informationProcessing: "You process information through logical frameworks while considering implications.",
      analyticalTendencies: "You exhibit strong analytical capabilities with attention to relevant details."
    };
  }
  
  if (!content.emotionalArchitecture || typeof content.emotionalArchitecture !== 'object') {
    content.emotionalArchitecture = {
      emotionalAwareness: "You demonstrate solid emotional self-awareness and recognition of feelings.",
      regulationStyle: "Your emotional regulation involves balancing expression with appropriate restraint.",
      empathicCapacity: "You show genuine empathy when engaging with others' feelings and perspectives."
    };
  }
  
  if (!content.coreTraits || typeof content.coreTraits !== 'object') {
    content.coreTraits = {
      primary: "Analytical Thinker",
      secondary: "Empathetic Communicator",
      tertiaryTraits: ["Logical reasoning", "Detail-oriented", "Adaptable", "Introspective"],
      strengths: ["Critical thinking", "Pattern recognition", "Effective communication"],
      challenges: ["Perfectionism", "Overthinking complex situations"]
    };
  }
  
  // Ensure we have at least basic overview text
  if (!content.overview && !content.overviewText) {
    content.overview = "Your personality profile reveals a thoughtful individual who balances analytical thinking with interpersonal awareness. You demonstrate strengths in logical reasoning and communication, while maintaining adaptability in various situations.";
  }
}
