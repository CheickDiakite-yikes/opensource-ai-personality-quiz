import { API_CONFIG } from "./openaiConfig.ts";
import { logRequestConfig, logResponseStats, logError, logDebug } from "./logging.ts";

export async function createOpenAIRequest(
  openAIApiKey: string, 
  messages: Array<{ role: string; content: string }>, 
  maxTokens: number = API_CONFIG.MAIN_MAX_TOKENS, 
  signal?: AbortSignal,
  modelOverride?: string
) {
  const model = modelOverride || API_CONFIG.DEFAULT_MODEL;
  logDebug(`Creating OpenAI request with model: ${model}, max_tokens: ${maxTokens}`);
  
  try {
    const headers = {
      Authorization: `Bearer ${openAIApiKey}`,
      "Content-Type": "application/json",
    };
    
    // Implement request chunking if content is too large
    const totalContentLength = messages.reduce((total, msg) => total + (msg.content?.length || 0), 0);
    
    if (totalContentLength > 10000 && messages.length > 1 && messages[1].role === "user") {
      logDebug(`Large request detected (${totalContentLength} chars), implementing chunking`);
      
      // Only chunk the user message, keep system prompt intact
      const userMessage = messages[1].content;
      const chunkSize = 6000; // Reduce chunk size
      const truncatedMessage = userMessage.substring(0, chunkSize) + 
        "\n\n[Content truncated due to length. Focus on providing quality analysis with available data]";
      
      // Replace the original user message with the truncated version
      messages[1].content = truncatedMessage;
      
      logDebug(`Truncated user message to ${truncatedMessage.length} chars`);
    }
    
    const body = JSON.stringify({
      model: model,
      max_tokens: maxTokens,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      messages,
      response_format: { type: "json_object" },
    });
    
    logDebug("Request headers", { 
      hasAuth: !!headers.Authorization,
      contentType: headers["Content-Type"]
    });
    
    logDebug("Request body structure", { 
      modelUsed: model, 
      messageCount: messages.length,
      maxTokens: maxTokens
    });
    
    // Add exponential backoff retry logic
    let attempt = 0;
    const maxAttempts = 3;
    const baseDelay = 1000; // 1 second initial delay
    
    while (attempt < maxAttempts) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          logDebug(`Retry attempt ${attempt} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        return await fetch(API_CONFIG.BASE_URL, {
          method: "POST",
          headers,
          body,
          signal // Pass the abort signal to fetch
        });
      } catch (retryError) {
        attempt++;
        
        // If this is the last attempt, or if the error is not a network error, throw
        if (attempt >= maxAttempts || (retryError.name !== "TypeError" && retryError.name !== "NetworkError")) {
          throw retryError;
        }
        
        logDebug(`Fetch attempt ${attempt} failed, retrying...`, { 
          errorName: retryError?.name,
          errorMessage: retryError?.message 
        });
      }
    }
    
    // This should never be reached due to the throw in the loop
    throw new Error("Failed after maximum retry attempts");
  } catch (error) {
    logDebug("Fetch error in createOpenAIRequest", {
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack?.substring(0, 200)
    });
    
    // Add detail to AbortError to distinguish between timeout and other aborts
    if (error && error.name === "AbortError") {
      error.message = `Request aborted: ${error.message || "Request timeout reached"}`;
    }
    
    throw error;
  }
}

export async function handleOpenAIResponse(response: Response) {
  try {
    if (!response) {
      throw new Error("Response object is undefined or null");
    }
    
    logDebug("Response status", { status: response.status, statusText: response.statusText });
    
    if (!response.ok) {
      const errorText = await response.text();
      logDebug("OpenAI error response", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      });
      
      let errorMessage = `OpenAI API Error (${response.status}): ${response.statusText}`;
      
      // Try to parse error JSON if available
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        // If parsing fails, use the error text directly if it exists
        if (errorText && errorText.trim().length > 0) {
          errorMessage = `OpenAI API Error (${response.status}): ${errorText}`;
        }
      }
      
      const error = new Error(errorMessage);
      error.name = "OpenAIAPIError";
      throw error;
    }

    const data = await response.json();
    logResponseStats(data);
    return data;
  } catch (error) {
    logError(error, "handleOpenAIResponse");
    throw new Error(`Failed to process OpenAI response: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
