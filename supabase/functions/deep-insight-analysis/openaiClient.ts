
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
  // Create or ensure object structures exist
  if (!content.cognitivePatterning || typeof content.cognitivePatterning !== 'object') {
    content.cognitivePatterning = {};
  }
  
  if (!content.emotionalArchitecture || typeof content.emotionalArchitecture !== 'object') {
    content.emotionalArchitecture = {};
  }
  
  if (!content.coreTraits || typeof content.coreTraits !== 'object') {
    content.coreTraits = {};
  }
  
  // Provide fallbacks for cognitive patterns
  if (!content.cognitivePatterning.decisionMaking) {
    content.cognitivePatterning.decisionMaking = "Your decision-making tends to prioritize logical analysis balanced with practical considerations.";
  }
  
  if (!content.cognitivePatterning.learningStyle) {
    content.cognitivePatterning.learningStyle = "You learn best through structured approaches that include both theory and practical application.";
  }
  
  if (!content.cognitivePatterning.attention) {
    content.cognitivePatterning.attention = "Your attention pattern reveals a balance between detail focus and big-picture thinking.";
  }
  
  if (!content.cognitivePatterning.problemSolvingApproach) {
    content.cognitivePatterning.problemSolvingApproach = "You approach problems methodically, breaking them into manageable components.";
  }
  
  if (!content.cognitivePatterning.informationProcessing) {
    content.cognitivePatterning.informationProcessing = "You process information through logical frameworks while considering implications.";
  }
  
  if (!content.cognitivePatterning.analyticalTendencies) {
    content.cognitivePatterning.analyticalTendencies = "You exhibit strong analytical capabilities with attention to relevant details.";
  }
  
  // Provide fallbacks for emotional architecture
  if (!content.emotionalArchitecture.emotionalAwareness) {
    content.emotionalArchitecture.emotionalAwareness = "You demonstrate solid emotional self-awareness and recognition of feelings.";
  }
  
  if (!content.emotionalArchitecture.regulationStyle) {
    content.emotionalArchitecture.regulationStyle = "Your emotional regulation involves balancing expression with appropriate restraint.";
  }
  
  if (!content.emotionalArchitecture.empathicCapacity) {
    content.emotionalArchitecture.empathicCapacity = "You show genuine empathy when engaging with others' feelings and perspectives.";
  }
  
  // Provide fallbacks for core traits
  if (!content.coreTraits.primary) {
    content.coreTraits.primary = "Analytical Thinker";
  }
  
  if (!content.coreTraits.secondary) {
    content.coreTraits.secondary = "Empathetic Communicator";
  }
  
  if (!content.coreTraits.tertiaryTraits || !Array.isArray(content.coreTraits.tertiaryTraits)) {
    content.coreTraits.tertiaryTraits = ["Logical reasoning", "Detail-oriented", "Adaptable", "Introspective"];
  }
  
  if (!content.coreTraits.strengths || !Array.isArray(content.coreTraits.strengths)) {
    content.coreTraits.strengths = ["Critical thinking", "Pattern recognition", "Effective communication"];
  }
  
  if (!content.coreTraits.challenges || !Array.isArray(content.coreTraits.challenges)) {
    content.coreTraits.challenges = ["Perfectionism", "Overthinking complex situations"];
  }
  
  // Ensure we have at least basic overview text
  if (!content.overview && !content.overviewText) {
    content.overview = "Your personality profile reveals a thoughtful individual who balances analytical thinking with interpersonal awareness. You demonstrate strengths in logical reasoning and communication, while maintaining adaptability in various situations.";
  } else if (!content.overview && content.overviewText) {
    // If overviewText exists but not overview, copy it
    content.overview = content.overviewText;
  }
}
