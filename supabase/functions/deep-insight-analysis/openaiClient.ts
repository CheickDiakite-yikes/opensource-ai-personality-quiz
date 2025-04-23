
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logDebug, logResponseStats, createPerformanceTracker } from "./logging.ts";
import { retryable } from "./retryUtils.ts";

/**
 * Creates an optimized OpenAI API request with enhanced error handling
 * 
 * @param openAIApiKey The OpenAI API key
 * @param messages Array of message objects to send to OpenAI
 * @param maxTokens Maximum tokens for response
 * @param signal AbortController signal for timeout handling
 * @returns Response from OpenAI API
 */
export async function createOpenAIRequest(
  openAIApiKey: string, 
  messages: any[], 
  maxTokens: number, 
  signal: AbortSignal
): Promise<Response> {
  const perfTracker = createPerformanceTracker("OpenAI API request");
  
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
    presence_penalty: API_CONFIG.PRESENCE_PENALTY,
    stream: false,
    response_format: API_CONFIG.RESPONSE_FORMAT,
  };

  logDebug("Creating OpenAI request", { 
    model: payload.model, 
    messagesCount: messages.length,
    maxTokens,
    temperature: API_CONFIG.TEMPERATURE
  });

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorBody);
      } catch {
        errorData = { message: errorBody };
      }
      
      const errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
      
      logError({
        status: response.status,
        message: errorMessage,
        details: errorData
      }, "OpenAI API Error");
      
      // Create error with useful information
      const error = new Error(`OpenAI API Error: ${response.status} - ${errorMessage}`);
      (error as any).status = response.status;
      (error as any).details = errorData;
      throw error;
    }

    const duration = perfTracker.end();
    logDebug(`OpenAI request succeeded in ${duration.toFixed(2)}ms`);
    return response;
    
  } catch (error) {
    perfTracker.end();
    
    // Enhance error with timeout information if it's an abort error
    if (error.name === "AbortError") {
      const timeoutError = new Error(`OpenAI request timed out`);
      timeoutError.name = "TimeoutError";
      throw timeoutError;
    }
    
    // Pass through other errors
    throw error;
  }
}

/**
 * Enhanced response handling with detailed logging
 */
export async function handleOpenAIResponse(response: Response) {
  const perfTracker = createPerformanceTracker("OpenAI response processing");
  
  try {
    const data = await response.json();
    logResponseStats(data);
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || !data.choices.length) {
      throw new Error("OpenAI response missing expected 'choices' array");
    }
    
    perfTracker.end();
    return data;
  } catch (error) {
    perfTracker.end();
    logError(error, "Error parsing OpenAI response");
    throw new Error(`Failed to parse OpenAI response: ${error.message}`);
  }
}

/**
 * Creates a streamable OpenAI response
 * This can be used for future streaming implementation
 */
export async function createStreamingOpenAIRequest(
  openAIApiKey: string, 
  messages: any[], 
  maxTokens: number
) {
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
    presence_penalty: API_CONFIG.PRESENCE_PENALTY,
    stream: true
  };

  logDebug("Creating streaming OpenAI request");

  const response = await fetch(API_CONFIG.BASE_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logError({ status: response.status, body: errorBody }, "OpenAI API streaming error");
    throw new Error(`OpenAI API Error: ${response.status} - ${errorBody}`);
  }

  return response;
}
