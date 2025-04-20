
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
    response_format: { type: "json_object" }, // Ensure JSON format is enforced
  };

  logDebug("OpenAI request payload model:", payload.model);
  logDebug("OpenAI request max tokens:", maxTokens);

  return withRetry(
    async () => {
      try {
        const response = await fetch(API_CONFIG.BASE_URL, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
          signal: signal,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(e => "Failed to read error response body");
          const statusCode = response.status;
          const errorMessage = `OpenAI API Error: Status ${statusCode}: ${errorText}`;
          
          logError({ 
            message: errorMessage,
            status: statusCode,
            errorText,
            headers: Object.fromEntries([...response.headers.entries()].filter(h => !h[0].toLowerCase().includes('auth')))
          }, "OpenAI API Error Response");
          
          throw new Error(errorMessage);
        }

        return response;
      } catch (error) {
        // Additional detailed error logging
        const errorDetail = {
          message: error.message || "Unknown fetch error",
          name: error.name || "FetchError",
          cause: error.cause ? (error.cause.message || String(error.cause)) : "No cause provided",
          stack: error.stack
        };
        
        logError(errorDetail, "OpenAI API Request Failed");
        throw error; // Re-throw for retry mechanism
      }
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
    logDebug("OpenAI Response received successfully");
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      logError({
        message: "Invalid OpenAI response structure - missing choices array",
        response: data
      }, "OpenAI Response Structure Error");
      throw new Error("Invalid OpenAI response structure: missing choices");
    }
    
    if (!data.choices[0].message) {
      logError({
        message: "Invalid OpenAI response structure - missing message in first choice",
        firstChoice: data.choices[0]
      }, "OpenAI Response Structure Error");
      throw new Error("Invalid OpenAI response structure: missing message");
    }
    
    return data;
  } catch (error) {
    logError({
      message: error.message || "Unknown parsing error",
      name: error.name || "ParseError", 
      stack: error.stack
    }, "Error parsing OpenAI response");
    throw new Error(`Failed to parse OpenAI response: ${error.message}`);
  }
}
