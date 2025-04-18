
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
    
    return await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers,
      body,
      signal // Pass the abort signal to fetch
    });
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
