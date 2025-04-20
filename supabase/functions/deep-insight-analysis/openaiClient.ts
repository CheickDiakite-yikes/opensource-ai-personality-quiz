
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

  // Add additional headers to potentially improve reliability
  const enhancedHeaders = {
    ...headers,
    "OpenAI-Beta": "responsiveness=high" // Request higher responsiveness
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
  
  // Log more details about the request for diagnostics
  logDebug(`OpenAI request payload size: ${JSON.stringify(payload).length} bytes`);

  return withRetry(
    async () => {
      try {
        const response = await fetch(API_CONFIG.BASE_URL, {
          method: "POST",
          headers: enhancedHeaders,
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
          
          // Enhanced error with more context
          const error = new Error(errorMessage);
          (error as any).statusCode = statusCode;
          (error as any).responseHeaders = Object.fromEntries([...response.headers.entries()].filter(h => !h[0].toLowerCase().includes('auth')));
          throw error;
        }

        return response;
      } catch (error) {
        // Additional detailed error logging
        const errorDetail = {
          message: error.message || "Unknown fetch error",
          name: error.name || "FetchError",
          cause: error.cause ? (error.cause.message || String(error.cause)) : "No cause provided",
          stack: error.stack,
          aborted: error.name === 'AbortError' ? true : false
        };
        
        if (error.name === 'AbortError') {
          logDebug("Request aborted due to timeout or manual abort");
        }
        
        logError(errorDetail, "OpenAI API Request Failed");
        throw error; // Re-throw for retry mechanism
      }
    },
    {
      maxAttempts: API_CONFIG.RETRY_COUNT,
      initialDelay: API_CONFIG.RETRY_INITIAL_DELAY,
      maxDelay: API_CONFIG.RETRY_MAX_DELAY,
      backoffFactor: API_CONFIG.RETRY_BACKOFF_FACTOR
    },
    `OpenAI API request (${API_CONFIG.DEFAULT_MODEL})`
  );
}

export async function handleOpenAIResponse(response: Response) {
  try {
    const data = await response.json();
    logDebug("OpenAI Response received successfully");
    
    // Enhanced validation and logging
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      const errorDetails = {
        message: "Invalid OpenAI response structure - missing choices array",
        response: JSON.stringify(data).substring(0, 1000) // Log first 1000 chars to avoid huge logs
      };
      logError(errorDetails, "OpenAI Response Structure Error");
      throw new Error("Invalid OpenAI response structure: missing choices");
    }
    
    if (!data.choices[0].message) {
      const errorDetails = {
        message: "Invalid OpenAI response structure - missing message in first choice",
        firstChoice: JSON.stringify(data.choices[0]).substring(0, 500)
      };
      logError(errorDetails, "OpenAI Response Structure Error");
      throw new Error("Invalid OpenAI response structure: missing message");
    }
    
    // Log usage info for monitoring
    if (data.usage) {
      logDebug("OpenAI usage stats:", {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        model: data.model
      });
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
