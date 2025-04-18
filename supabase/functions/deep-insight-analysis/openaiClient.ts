
import { API_CONFIG } from "./openaiConfig.ts";
import { logRequestConfig, logResponseStats } from "./logging.ts";

export async function createOpenAIRequest(
  openAIApiKey: string, 
  messages: Array<{ role: string; content: string }>, 
  maxTokens: number = API_CONFIG.MAIN_MAX_TOKENS, 
  signal?: AbortSignal,
  modelOverride?: string
) {
  const model = modelOverride || API_CONFIG.DEFAULT_MODEL;
  console.log(`Creating OpenAI request with model: ${model}, max_tokens: ${maxTokens}`);
  
  try {
    return await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        max_tokens: maxTokens,
        temperature: API_CONFIG.TEMPERATURE,
        top_p: API_CONFIG.TOP_P,
        frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
        messages,
        response_format: { type: "json_object" },
      }),
      signal // Pass the abort signal to fetch
    });
  } catch (error) {
    console.error("Fetch error in createOpenAIRequest:", error.name, error.message);
    
    // Add detail to AbortError to distinguish between timeout and other aborts
    if (error.name === "AbortError") {
      error.message = `Request aborted: ${error.message || "Request timeout reached"}`;
    }
    
    throw error;
  }
}

export async function handleOpenAIResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI error details:", {
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

  try {
    const data = await response.json();
    logResponseStats(data);
    return data;
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    throw new Error(`Failed to parse OpenAI response: ${error.message}`);
  }
}
